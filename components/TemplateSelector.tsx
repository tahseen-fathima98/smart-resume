'use client'
import React, { useState } from 'react'

const templates = [
  { id: 't1', title: 'Minimal Classic', desc: 'Single-column, clean' },
  { id: 't2', title: 'Two Column', desc: 'Profile + details' },
  { id: 't3', title: 'Modern', desc: 'Bold headings' },
]

export default function TemplateSelector(){
  const [selected, setSelected] = useState('t1')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {templates.map(t=> (
        <div key={t.id} className={`p-3 border rounded ${selected === t.id ? 'border-green-400' : 'border-white/6'}`} onClick={()=> setSelected(t.id)}>
          <div className="h-28 bg-slate-900 rounded flex items-center justify-center">Preview</div>
          <h3 className="font-medium mt-2">{t.title}</h3>
          <p className="text-sm text-slate-400">{t.desc}</p>
          <div className="mt-2 flex justify-between items-center">
            <button className="px-3 py-1 rounded bg-primary text-black">Select</button>
            {selected === t.id && <span className="text-sm text-green-400">Selected</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
