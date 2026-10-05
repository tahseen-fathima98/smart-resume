'use client'
import React, { useState } from 'react'

type Suggestion = { id: string; text: string; patch?: any }

type Props = {
  profile: {
    name: string
    title: string
    summary: string
    experiences: any[]
    skills: any[]
  }
  onApplySuggestion: (patch: any) => void
}

export default function AISuggestionPanel({ profile, onApplySuggestion }: Props) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  const buildPrompt = () => {
    return `Resume Context:
Name: ${profile.name}
Title: ${profile.title}
Summary: ${profile.summary}
Experiences: ${profile.experiences.map((e: any) => `${e.role} at ${e.company} (${e.date}) - ${e.details}`).join(' | ')}
Skills: ${profile.skills.map((s: any) => s.name + ' ' + s.level + '%').join(', ')}

Please produce a JSON array named suggestions. Each suggestion should be an object:
{
  "id": "unique-id",
  "text": "short human readable suggestion",
  "patch": { optional fields: name, title, summary, skills (array of {name,level}), experiences (array of {company,role,date,details}) }
}

Return ONLY valid JSON (no explanation). Provide up to 5 suggestions.`
  }

  const analyze = async () => {
    setLoading(true)
    setError(null)
    setWarning(null)
    setSuggestions([])
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI error')
      setSuggestions(data.suggestions || [])
      setWarning(data.warning || null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="surface-muted flex items-center justify-between gap-4 p-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>AI resume analysis</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Get personalized suggestions to improve your resume</p>
        </div>
        <button onClick={analyze} disabled={loading} className="btn btn-primary whitespace-nowrap">
          {loading && <span className="spinner" />}
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg p-4 text-sm" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {warning && (
        <div className="rounded-lg p-4 text-sm" style={{ background: 'var(--warn-soft)', color: 'var(--warn-text)' }}>
          {warning}
        </div>
      )}

      {suggestions.length === 0 && !loading && !error && (
        <div className="surface-muted p-8 text-center" style={{ borderStyle: 'dashed' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Ready when you are</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Click &quot;Analyze&quot; to get personalized improvement suggestions.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={suggestion.id} className="surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}
                  >
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text)' }}>Suggestion</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{suggestion.text}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => { if (suggestion.patch) onApplySuggestion(suggestion.patch) }}
                  className="btn btn-success !px-3 !py-1.5 text-xs"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSuggestions(prev => prev.filter(x => x.id !== suggestion.id))}
                  className="btn btn-outline !px-3 !py-1.5 text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: 'var(--warn-soft)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--warn-text)' }}>Pro tip</p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--warn-text)' }}>
          For live AI suggestions, add your Hugging Face API key to <code>.env.local</code> as{' '}
          <code>HUGGINGFACE_API_KEY</code>. Without it, the system uses mock data.
        </p>
      </div>
    </div>
  )
}
