import { NextResponse } from 'next/server'

type HFResponse = any

export async function POST(request: Request){
  try {
    const body = await request.json()
    const { prompt } = body

    const HF_KEY = process.env.HUGGINGFACE_API_KEY

    if (!prompt){
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
    }

    // Instruction: return a JSON array of suggestions with patches
    const systemInstruction = `You are an assistant that returns JSON only.
Given the user's resume context, produce a JSON array named suggestions.
Each suggestion must be an object with:
- id: string
- text: short human-readable suggestion
- patch: an object containing any of these optional fields: name (string), title (string), summary (string), skills (array of {name,level}), experiences (array of {company,role,date,details})
Return ONLY the JSON array as the response.`

    // If no HF key, return mocked structured patches
    if (!HF_KEY){
      const suggestions = [
        { id: 'mock-1', text: 'Add a metrics-driven bullet to your experience.', patch: { summary: 'Experienced frontend developer focused on performance optimization, reduced load time by 30%.' } },
        { id: 'mock-2', text: 'Add Tailwind to your skills.', patch: { skills: [{ name: 'React', level: 85 }, { name: 'TypeScript', level: 70 }, { name: 'Tailwind', level: 60 }] } }
      ]
      return NextResponse.json({ suggestions })
    }

    // Call HF inference with instruction + prompt; ask model to output JSON array
    const model = 'google/flan-t5-small'
    const hfUrl = `https://api-inference.huggingface.co/models/${model}`

    const combined = `${systemInstruction}\n\nContext:\n${prompt}\n\nRespond with only valid JSON.`

    const res = await fetch(hfUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: combined, options: { wait_for_model: true } })
    })

    if (!res.ok){
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }

    const data: HFResponse = await res.json()
    // Attempt to extract text
    let text = ''
    if (Array.isArray(data) && data[0] && data[0].generated_text) text = data[0].generated_text
    else if ((data as any).generated_text) text = (data as any).generated_text
    else if (typeof data === 'string') text = data
    else text = JSON.stringify(data)

    // Try parse JSON strictly
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) return NextResponse.json({ suggestions: parsed })
    } catch(e){
      // fallthrough
    }

    // fallback: try to extract JSON substring
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch){
      try {
        const parsed = JSON.parse(jsonMatch[0])
        if (Array.isArray(parsed)) return NextResponse.json({ suggestions: parsed })
      } catch(e){}
    }

    // final fallback: return a message
    return NextResponse.json({ error: 'Could not parse model output as JSON. Model output: ' + text })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
