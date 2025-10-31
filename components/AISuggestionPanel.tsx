'use client'
import React, { useState } from 'react'

type Suggestion = { id: string; text: string; patch?: any }

type Props = {
  name: string
  title: string
  summary: string
  experiences: any[]
  skills: any[]
  applyPatch: (patch: any) => void
}

export default function AISuggestionPanel({ name, title, summary, experiences, skills, applyPatch }: Props){
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const buildPrompt = ()=>{
    return `Resume Context:
Name: ${name}
Title: ${title}
Summary: ${summary}
Experiences: ${experiences.map(e=> `${e.role} at ${e.company} (${e.date}) - ${e.details}`).join(' | ')}
Skills: ${skills.map(s=> s.name + ' ' + s.level + '%').join(', ')}

Please produce a JSON array named suggestions. Each suggestion should be an object:
{
  "id": "unique-id",
  "text": "short human readable suggestion",
  "patch": { optional fields: name, title, summary, skills (array of {name,level}), experiences (array of {company,role,date,details}) }
}

Return ONLY valid JSON (no explanation). Provide up to 5 suggestions.`
  }

  const analyze = async ()=>{
    setLoading(true)
    setError(null)
    setSuggestions([])
    try{
      const res = await fetch('/api/analyze', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ prompt: buildPrompt() }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI error')
      setSuggestions(data.suggestions || [])
    }catch(err: any){
      setError(err.message)
    }finally{setLoading(false)}
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button onClick={analyze} className="px-4 py-2 rounded bg-primary text-black">Analyze with AI</button>
        {loading && <span className="text-sm text-slate-300">Analyzing...</span>}
      </div>

      <div className="mt-4 grid gap-3">
        {error && <div className="text-sm text-red-400">{error}</div>}
        {suggestions.length === 0 && !loading && <div className="text-sm text-slate-400">No suggestions yet. Click Analyze.</div>}

        {suggestions.map(s => (
          <div key={s.id} className="p-3 border border-white/6 rounded-md flex flex-col md:flex-row md:justify-between">
            <div>
              <div className="font-medium">AI Suggestion</div>
              <div className="text-sm text-slate-300">{s.text}</div>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <button onClick={()=> { if (s.patch) applyPatch(s.patch) }} className="px-3 py-1 rounded bg-green-600 text-sm">Apply</button>
              <button onClick={()=> setSuggestions(prev=> prev.filter(x=> x.id !== s.id))} className="px-3 py-1 rounded border text-sm">Dismiss</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-slate-400">Tip: For live structured AI suggestions add your Hugging Face token to <code>.env.local</code> as <code>HUGGINGFACE_API_KEY</code>. Without it the API returns mocked structured patches.</div>
    </div>
  )
}
