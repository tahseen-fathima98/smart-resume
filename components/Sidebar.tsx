'use client'
import React from 'react'
import Link from 'next/link'

export default function Sidebar() {
  const sections = [
    { id: 'editor', label: 'Editor', icon: '✏️' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
    { id: 'skills', label: 'Skills', icon: '🎯' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'templates', label: 'Templates', icon: '📄' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-900/80 backdrop-blur-md border-r border-white/10 p-6 z-50 transform transition-transform duration-300 lg:translate-x-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Smart Resume</h1>
        <p className="text-sm text-slate-400">Builder</p>
      </div>
      
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className="w-full flex items-center gap-3 px-3 py-3 text-left text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="text-xs text-slate-500 text-center">
          <p>Built with Next.js</p>
          <p>& Tailwind CSS</p>
        </div>
      </div>
    </nav>
  )
}
