'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Skill } from '../app/page'

export default function SkillAnalyzer({ skills }: { skills: Skill[] }){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((s)=> (
        <div key={s.name} className="p-4 card flex flex-col items-center">
          <div className="w-28 h-28">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle cx="18" cy="18" r="16" strokeWidth="2" stroke="rgba(255,255,255,0.06)" fill="none" />
              <motion.circle
                cx="18" cy="18" r="16"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(s.level/100)*100} 100`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.8 }}
                stroke="#06b6d4"
                fill="none"
              />
              <text x="18" y="20" alignmentBaseline="middle" textAnchor="middle" style={{ fontSize: '8px', fill: 'white' }}>{s.level}%</text>
            </svg>
          </div>
          <div className="mt-3 text-center">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-slate-400">Proficiency</div>
          </div>
        </div>
      ))}
    </div>
  )
}
