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

export default function AISuggestionPanel({ profile, onApplySuggestion }: Props){
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const buildPrompt = ()=>{
    return `Resume Context:
Name: ${profile.name}
Title: ${profile.title}
Summary: ${profile.summary}
Experiences: ${profile.experiences.map((e: any)=> `${e.role} at ${e.company} (${e.date}) - ${e.details}`).join(' | ')}
Skills: ${profile.skills.map((s: any)=> s.name + ' ' + s.level + '%').join(', ')}

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
    <div className="space-y-6">
      {/* Analysis Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700">
        <div>
          <h3 className="font-medium text-white mb-1">AI Resume Analysis</h3>
          <p className="text-sm text-slate-400">Get personalized suggestions to improve your resume</p>
        </div>
        <button 
          onClick={analyze} 
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        )}

        {suggestions.length === 0 && !loading && !error && (
          <div className="p-8 text-center bg-slate-800/20 rounded-xl border border-slate-700 border-dashed">
            <svg className="w-12 h-12 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="font-medium text-slate-300 mb-2">Ready for AI Analysis</h3>
            <p className="text-sm text-slate-500">Click "Analyze Resume" to get personalized improvement suggestions</p>
          </div>
        )}

        {suggestions.map((suggestion, index) => (
          <div key={suggestion.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-medium text-white">AI Suggestion</h4>
                </div>
                <p className="text-slate-300 leading-relaxed">{suggestion.text}</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={()=> { if (suggestion.patch) onApplySuggestion(suggestion.patch) }} 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Apply
                </button>
                <button 
                  onClick={()=> setSuggestions(prev=> prev.filter(x=> x.id !== suggestion.id))} 
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm rounded-lg font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-amber-300 font-medium">Pro Tip</p>
            <p className="text-xs text-amber-200/80 mt-1">
              For live AI suggestions, add your Hugging Face API key to <code className="px-1 py-0.5 bg-amber-900/40 rounded text-amber-200">.env.local</code> as <code className="px-1 py-0.5 bg-amber-900/40 rounded text-amber-200">HUGGINGFACE_API_KEY</code>. Without it, the system uses mock data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
