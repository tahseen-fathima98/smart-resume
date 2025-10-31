'use client'
import React, { useState, useRef } from 'react'
import ResumeEditor from '../components/ResumeEditor'
import ResumePreview from '../components/ResumePreview'
import SkillAnalyzer from '../components/SkillAnalyzer'
import AISuggestionPanel from '../components/AISuggestionPanel'
import TemplateSelector from '../components/TemplateSelector'

export type Skill = { name: string; level: number }
export type Experience = { company: string; role: string; date: string; details?: string }

export default function Page(){
  const [name, setName] = useState('Tahseen Fathima')
  const [title, setTitle] = useState('Frontend Developer')
  const [summary, setSummary] = useState('I create responsive, accessible user interfaces with React and clean design.')
  const [experiences, setExperiences] = useState<Experience[]>([
    { company: 'ACME', role: 'Frontend Engineer', date: '2023 - Present', details: 'Built customer-facing UI.' }
  ])
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 70 },
    { name: 'CSS', level: 80 },
    { name: 'Design', level: 60 }
  ])

  const applyPatch = (patch: any) => {
    if (patch.name) setName(patch.name)
    if (patch.title) setTitle(patch.title)
    if (patch.summary) setSummary(patch.summary)
    if (Array.isArray(patch.skills)) setSkills(patch.skills)
    if (Array.isArray(patch.experiences)) setExperiences(patch.experiences)
  }

  return (
    <div className="container-centered grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <section id="editor" className="card">
          <h2 className="text-xl font-semibold mb-3">Editor</h2>
          <ResumeEditor
            name={name}
            setName={setName}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            experiences={experiences}
            setExperiences={setExperiences}
            skills={skills}
            setSkills={setSkills}
          />
        </section>

        <section id="skills" className="card">
          <h2 className="text-xl font-semibold mb-3">Skill Analyzer</h2>
          <SkillAnalyzer skills={skills} />
        </section>

        <section id="ai" className="card">
          <h2 className="text-xl font-semibold mb-3">AI Suggestion Panel</h2>
          <AISuggestionPanel
            name={name}
            title={title}
            summary={summary}
            experiences={experiences}
            skills={skills}
            applyPatch={applyPatch}
          />
        </section>
      </div>

      <aside className="space-y-6">
        <section id="preview" className="card">
          <h2 className="text-xl font-semibold mb-3">Live Preview</h2>
          <ResumePreview name={name} title={title} summary={summary} experiences={experiences} skills={skills} />
        </section>

        <section id="templates" className="card">
          <h2 className="text-xl font-semibold mb-3">Templates</h2>
          <TemplateSelector />
        </section>
      </aside>
    </div>
  )
}
