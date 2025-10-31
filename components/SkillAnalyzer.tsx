'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Skill } from '../app/page'

export default function SkillAnalyzer({ skills }: { skills: Skill[] }){
  const getSkillLevel = (level: number) => {
    if (level >= 80) return { label: 'Expert', color: 'text-emerald-400', bg: 'bg-emerald-500' }
    if (level >= 60) return { label: 'Advanced', color: 'text-blue-400', bg: 'bg-blue-500' }
    if (level >= 40) return { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500' }
    return { label: 'Beginner', color: 'text-orange-400', bg: 'bg-orange-500' }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => {
          const skillInfo = getSkillLevel(skill.level)
          return (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Circular progress */}
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-slate-700"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={skillInfo.bg.replace('bg-', 'stroke-')}
                      strokeDasharray={`${skill.level} ${100 - skill.level}`}
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: `${skill.level} ${100 - skill.level}` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{skill.level}%</span>
                  </div>
                </div>

                {/* Skill info */}
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">{skill.name}</h3>
                  <span className={`text-xs ${skillInfo.color} font-medium`}>
                    {skillInfo.label}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Skills overview */}
      <div className="mt-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Skills Overview</h3>
        <div className="space-y-3">
          {skills.map((skill, index) => {
            const skillInfo = getSkillLevel(skill.level)
            return (
              <div key={skill.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className={`text-xs ${skillInfo.color} px-2 py-1 rounded-full bg-slate-700/50`}>
                    {skillInfo.label}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <motion.div
                      className={`${skillInfo.bg} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-slate-400 text-sm font-medium w-10 text-right">
                    {skill.level}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
