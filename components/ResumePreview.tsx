'use client'
import React, { useRef } from 'react'
import { Skill, Experience } from '../app/page'
import { useReactToPrint } from 'react-to-print'

type Props = { 
  name: string
  title: string
  summary: string
  experiences: Experience[]
  skills: Skill[] 
}

export default function ResumePreview({ name, title, summary, experiences, skills }: Props){
  const ref = useRef<HTMLDivElement | null>(null)

  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: `${name}-resume`
  })

  return (
    <div className="w-full">
      {/* Print button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Resume
        </button>
      </div>

      {/* Resume preview */}
      <div ref={ref} className="bg-white text-gray-900 p-8 rounded-lg shadow-xl max-w-2xl mx-auto min-h-[600px] print:shadow-none print:rounded-none">
        {/* Header */}
        <header className="border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{name || 'Your Name'}</h1>
          <p className="text-lg text-gray-600 font-medium">{title || 'Professional Title'}</p>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.role}</h3>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-medium mt-1 sm:mt-0">{exp.date}</span>
                  </div>
                  {exp.details && (
                    <p className="text-gray-700 text-sm mt-2">{exp.details}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-1">
              Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{width: `${skill.level}%`}}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
