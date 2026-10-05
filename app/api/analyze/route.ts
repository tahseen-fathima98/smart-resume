import { NextResponse } from 'next/server'

type Suggestion = {
  id: string
  text: string
  patch?: Record<string, unknown>
}

type HuggingFaceResponse =
  | Array<{ generated_text?: string }>
  | { generated_text?: string; error?: string }
  | string

const DEFAULT_MODEL = 'google/flan-t5-small'
const REQUEST_TIMEOUT_MS = 30_000

function fallbackSuggestions(): Suggestion[] {
  return [
    {
      id: 'fallback-1',
      text: 'Strengthen your summary with a measurable result from your recent work.',
      patch: {
        summary: 'Results-focused professional with a track record of delivering reliable work and measurable improvements.'
      }
    },
    {
      id: 'fallback-2',
      text: 'Keep your most relevant technical skills prominent and easy to scan.',
      patch: {
        skills: [
          { name: 'React', level: 85 },
          { name: 'TypeScript', level: 75 },
          { name: 'Tailwind CSS', level: 65 }
        ]
      }
    }
  ]
}

function fallbackResponse(warning?: string) {
  return NextResponse.json({
    suggestions: fallbackSuggestions(),
    source: 'fallback',
    ...(warning ? { warning } : {})
  })
}

function extractGeneratedText(data: HuggingFaceResponse): string {
  if (typeof data === 'string') return data
  if (Array.isArray(data)) return data[0]?.generated_text ?? ''
  return data.generated_text ?? ''
}

function parseSuggestions(text: string): Suggestion[] | null {
  const candidates = [text, text.match(/\[[\s\S]*\]/)?.[0]].filter(
    (candidate): candidate is string => Boolean(candidate)
  )

  for (const candidate of candidates) {
    try {
      const parsed: unknown = JSON.parse(candidate)
      if (!Array.isArray(parsed)) continue

      const suggestions = parsed
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
        .filter(item => typeof item.text === 'string' && item.text.trim().length > 0)
        .slice(0, 5)
        .map((item, index) => ({
          id: typeof item.id === 'string' && item.id ? item.id : `ai-${index + 1}`,
          text: String(item.text).trim(),
          ...(item.patch && typeof item.patch === 'object'
            ? { patch: item.patch as Record<string, unknown> }
            : {})
        }))

      if (suggestions.length > 0) return suggestions
    } catch {
      // Try the next candidate (for example, JSON embedded in model prose).
    }
  }

  return null
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'The request body must be valid JSON.' }, { status: 400 })
  }

  const prompt =
    body && typeof body === 'object' && 'prompt' in body && typeof body.prompt === 'string'
      ? body.prompt.trim()
      : ''

  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY?.trim()
  if (!apiKey) return fallbackResponse()

  const model = process.env.HUGGINGFACE_MODEL?.trim() || DEFAULT_MODEL
  const inferenceUrl = `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(model).replace(/%2F/g, '/')}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const instruction = `You are a resume coach. Return ONLY a valid JSON array containing at most five suggestions.
Each item must have an id, a short text description, and a patch object. A patch may contain name, title, summary, skills (an array of {name, level}), or experiences (an array of {company, role, date, details}).

Resume context:
${prompt}`

  try {
    const response = await fetch(inferenceUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: instruction,
        parameters: { max_new_tokens: 700, return_full_text: false },
        options: { wait_for_model: true }
      }),
      signal: controller.signal,
      cache: 'no-store'
    })

    if (!response.ok) {
      return fallbackResponse(
        'Live AI is currently unavailable, so offline suggestions are shown instead.'
      )
    }

    const data = (await response.json()) as HuggingFaceResponse
    const suggestions = parseSuggestions(extractGeneratedText(data))

    if (!suggestions) {
      return fallbackResponse(
        'The AI response could not be read, so offline suggestions are shown instead.'
      )
    }

    return NextResponse.json({ suggestions, source: 'huggingface' })
  } catch {
    return fallbackResponse(
      'Live AI could not be reached, so offline suggestions are shown instead.'
    )
  } finally {
    clearTimeout(timeout)
  }
}
