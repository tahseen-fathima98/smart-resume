'use client'
import React from 'react'
import { Skill, Experience } from '../app/page'

type Props = {
  name: string
  setName: (v: string) => void
  title: string
  setTitle: (v: string) => void
  summary: string
  setSummary: (v: string) => void
  experiences: Experience[]
  setExperiences: (v: Experience[]) => void
  skills: Skill[]
  setSkills: (v: Skill[]) => void
}

export default function ResumeEditor({ name, setName, title, setTitle, summary, setSummary, experiences, setExperiences, skills, setSkills }: Props){

  const addExperience = ()=> setExperiences([...experiences, { company: '', role: '', date: '', details: '' }])
  const removeExperience = (idx: number)=> setExperiences(experiences.filter((_,i)=> i !== idx))

  const updateSkillName = (idx: number, newName: string) => {
    const copy = [...skills]
    copy[idx] = { ...copy[idx], name: newName }
    setSkills(copy)
  }
  const updateSkillLevel = (idx: number, level: number) => {
    const copy = [...skills]
    copy[idx] = { ...copy[idx], level }
    setSkills(copy)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-300">Full name</label>
          <input value={name} onChange={(e)=> setName(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/6" />
        </div>
        <div>
          <label className="block text-sm text-slate-300">Professional title</label>
          <input value={title} onChange={(e)=> setTitle(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/6" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-300">Summary</label>
        <textarea value={summary} onChange={(e)=> setSummary(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/6" rows={4} />
      </div>

      <div>
        <h3 className="font-medium">Experiences</h3>
        <div className="space-y-3 mt-2">
          {experiences.map((exp, idx)=> (
            <div key={idx} className="p-3 border border-white/6 rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input placeholder="Role" value={exp.role} onChange={(e)=>{
                  const copy = [...experiences]; copy[idx] = { ...copy[idx], role: e.target.value }; setExperiences(copy)
                }} className="p-2 rounded bg-transparent border border-white/6" />
                <input placeholder="Company" value={exp.company} onChange={(e)=>{
                  const copy = [...experiences]; copy[idx] = { ...copy[idx], company: e.target.value }; setExperiences(copy)
                }} className="p-2 rounded bg-transparent border border-white/6" />
                <input placeholder="Date" value={exp.date} onChange={(e)=>{
                  const copy = [...experiences]; copy[idx] = { ...copy[idx], date: e.target.value }; setExperiences(copy)
                }} className="p-2 rounded bg-transparent border border-white/6" />
              </div>
              <textarea placeholder="Details" value={exp.details} onChange={(e)=>{
                const copy = [...experiences]; copy[idx] = { ...copy[idx], details: e.target.value }; setExperiences(copy)
              }} className="w-full mt-2 p-2 rounded bg-transparent border border-white/6" />
              <div className="flex justify-end mt-2">
                <button onClick={()=> removeExperience(idx)} className="px-3 py-1 rounded border">Remove</button>
              </div>
            </div>
          ))}
          <div>
            <button onClick={addExperience} className="px-4 py-2 rounded bg-primary text-black">Add experience</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium">Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {skills.map((s, idx)=> (
            <div key={idx} className="p-2 border border-white/6 rounded">
              <input value={s.name} onChange={(e)=> updateSkillName(idx, e.target.value)} className="w-full mb-2 p-2 rounded bg-transparent border border-white/6" />
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={100} value={s.level} onChange={(e)=> updateSkillLevel(idx, Number(e.target.value))} className="flex-1" />
                <div className="w-12 text-right text-sm">{s.level}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
