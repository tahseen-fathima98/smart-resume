'use client'
import React from 'react'

export default function ResumePreview({ profile }: { profile: any }){
  return (
    <div className="card">
      <div className="p-4 bg-gradient-to-b from-slate-800/40 to-transparent rounded-lg">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-sm text-slate-300">{profile.title}</p>
        <hr className="my-3 border-white/6" />
        <p className="text-sm">{profile.summary}</p>

        <div className="mt-4">
          <h3 className="font-medium">Experience</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {profile.experiences.map((e: any, i: number)=> (
              <li key={i} className="flex justify-between">
                <div>
                  <div className="font-semibold">{e.role}</div>
                  <div className="text-xs text-slate-400">{e.company}</div>
                </div>
                <div className="text-xs text-slate-400">{e.date}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.skills.map((s: any)=> (
              <span key={s.name} className="text-xs px-2 py-1 rounded-full border border-white/6">{s.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}