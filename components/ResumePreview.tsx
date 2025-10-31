'use client'
import React, { useRef } from 'react'
import { Skill, Experience } from '../app/page'
import { useReactToPrint } from 'react-to-print'

type Props = { name: string; title: string; summary: string; experiences: Experience[]; skills: Skill[] }

export default function ResumePreview({ name, title, summary, experiences, skills }: Props){
  const ref = useRef<HTMLDivElement | null>(null)

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: `${name}-resume`
  })

  return (
    <div>
      <div ref={ref} className="p-4 bg-gradient-to-b from-slate-800/30 to-transparent rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-slate-300">{title}</p>
          </div>
          <div className="text-xs text-slate-400">Resume</div>
        </div>

        <hr className="my-3 border-white/6" />

        <section>
          <h3 className="font-medium">Summary</h3>
          <p className="text-sm text-slate-200 mt-1">{summary}</p>
        </section>

        <section className="mt-4">
          <h3 className="font-medium">Experience</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {experiences.map((e, i)=> (
              <li key={i}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{e.role} — <span className="text-slate-400 font-normal">{e.company}</span></div>
                    <div className="text-xs text-slate-400">{e.details}</div>
                  </div>
                  <div className="text-xs text-slate-400">{e.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <h3 className="font-medium">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s)=> (
              <span key={s.name} className="text-xs px-2 py-1 rounded-full border border-white/6">{s.name}</span>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={handlePrint} className="px-3 py-1 rounded bg-primary text-black">Export to PDF</button>
      </div>
    </div>
)
}
