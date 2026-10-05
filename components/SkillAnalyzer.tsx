'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Skill } from '../app/page'

type Props = {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

function levelInfo(level: number) {
  if (level >= 80) return { label: 'Expert', className: 'badge-success' }
  if (level >= 60) return { label: 'Advanced', className: 'badge-accent' }
  if (level >= 40) return { label: 'Intermediate', className: 'badge-warn' }
  return { label: 'Beginner', className: 'badge' }
}

export default function SkillAnalyzer({ skills, onChange }: Props) {
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(70)

  const addSkill = () => {
    const name = newSkillName.trim()
    if (!name) return
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillName('')
      return
    }
    onChange([...skills, { name, level: newSkillLevel }])
    setNewSkillName('')
    setNewSkillLevel(70)
  }

  const removeSkill = (name: string) => {
    onChange(skills.filter(s => s.name !== name))
  }

  const updateSkillLevel = (name: string, level: number) => {
    onChange(skills.map(s => (s.name === name ? { ...s, level } : s)))
  }

  return (
    <div className="space-y-6">
      <div className="surface-muted p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text)' }}>Add a skill</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="input flex-1"
            placeholder="e.g. React, Project Management..."
            value={newSkillName}
            onChange={e => setNewSkillName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
          />
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(Number(e.target.value))}
              className="slider w-28"
            />
            <span className="w-9 text-sm" style={{ color: 'var(--text-muted)' }}>{newSkillLevel}%</span>
          </div>
          <button onClick={addSkill} className="btn btn-primary whitespace-nowrap">Add skill</button>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="surface-muted p-8 text-center" style={{ borderStyle: 'dashed' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No skills added yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map((skill, index) => {
            const info = levelInfo(skill.level)
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="surface group flex items-center gap-4 p-3.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="truncate text-sm font-medium" style={{ color: 'var(--text)' }}>{skill.name}</span>
                    <span className={`badge ${info.className}`}>{info.label}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={e => updateSkillLevel(skill.name, Number(e.target.value))}
                    className="slider w-full"
                  />
                </div>
                <span className="w-9 flex-shrink-0 text-right text-sm" style={{ color: 'var(--text-muted)' }}>
                  {skill.level}%
                </span>
                <button
                  onClick={() => removeSkill(skill.name)}
                  className="btn-ghost flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Remove ${skill.name}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
