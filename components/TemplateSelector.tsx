'use client'
import React, { useState, useEffect } from 'react'

// Free resume templates data
const templates = [
  { 
    id: 'professional',
    title: 'Professional', 
    desc: 'Clean and minimal design perfect for corporate roles',
    colors: ['bg-blue-600', 'bg-slate-300', 'bg-white'],
    preview: 'Traditional layout with clear sections and professional typography',
    category: 'Corporate',
    features: ['ATS Friendly', 'Clean Design', 'Professional']
  },
  { 
    id: 'modern',
    title: 'Modern', 
    desc: 'Contemporary design with bold accents for creative fields',
    colors: ['bg-emerald-500', 'bg-slate-200', 'bg-white'],
    preview: 'Two-column layout with highlighted skills and modern styling',
    category: 'Creative',
    features: ['Modern Design', 'Color Accents', 'Creative']
  },
  { 
    id: 'executive',
    title: 'Executive', 
    desc: 'Sophisticated layout for senior-level positions',
    colors: ['bg-slate-700', 'bg-slate-400', 'bg-white'],
    preview: 'Elegant design emphasizing leadership and achievements',
    category: 'Executive',
    features: ['Executive Style', 'Sophisticated', 'Leadership']
  },
  { 
    id: 'minimalist',
    title: 'Minimalist', 
    desc: 'Simple and clean design focusing on content',
    colors: ['bg-gray-600', 'bg-gray-300', 'bg-white'],
    preview: 'Minimal design with focus on content and readability',
    category: 'Simple',
    features: ['Minimalist', 'Content Focus', 'Clean']
  },
  { 
    id: 'creative',
    title: 'Creative', 
    desc: 'Artistic and unique design for portfolio showcase',
    colors: ['bg-purple-500', 'bg-pink-300', 'bg-white'],
    preview: 'Creative layout with visual elements and portfolio sections',
    category: 'Creative',
    features: ['Artistic', 'Portfolio Ready', 'Unique']
  },
  { 
    id: 'tech',
    title: 'Tech Professional', 
    desc: 'Modern design tailored for technology professionals',
    colors: ['bg-indigo-600', 'bg-blue-200', 'bg-white'],
    preview: 'Tech-focused layout with skills emphasis and modern appeal',
    category: 'Technology',
    features: ['Tech Focus', 'Skills Emphasis', 'Modern']
  },
]

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void
  selectedTemplate?: string
}

export default function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps){
  const [selected, setSelected] = useState(selectedTemplate || 'professional')
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Corporate', 'Creative', 'Executive', 'Simple', 'Technology']
  
  const filteredTemplates = filter === 'All' 
    ? templates 
    : templates.filter(template => template.category === filter)

  const handleSelect = (templateId: string) => {
    setSelected(templateId)
    onTemplateSelect(templateId)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Choose Your Resume Template
        </h1>
        <p className="text-lg text-slate-400 mb-6">
          Select a professional template that matches your industry and style
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div 
            key={template.id} 
            className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selected === template.id 
                ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900' 
                : 'hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2 hover:ring-offset-slate-900'
            }`}
            onClick={() => handleSelect(template.id)}
          >
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              {/* Preview */}
              <div className="p-6 bg-gradient-to-br from-slate-700 to-slate-800 relative h-48 flex items-center justify-center">
                <div className="w-full h-full bg-white/90 rounded-lg shadow-lg p-4 text-gray-900 text-xs">
                  {/* Mock resume preview */}
                  <div className="space-y-2">
                    <div className={`h-2 ${template.colors[0]} rounded w-3/4`}></div>
                    <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                    <div className="space-y-1 mt-3">
                      <div className="h-1 bg-gray-400 rounded w-full"></div>
                      <div className="h-1 bg-gray-400 rounded w-4/5"></div>
                      <div className="h-1 bg-gray-400 rounded w-3/5"></div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className={`h-1.5 ${template.colors[0]} rounded w-1/3`}></div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color scheme indicator */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {template.colors.map((color, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full ${color} border border-gray-300`}></div>
                    ))}
                  </div>
                </div>

                {/* Selection overlay */}
                {selected === template.id && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Template info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{template.title}</h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  {selected === template.id && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
                
                <p className="text-slate-400 text-sm mb-3">{template.desc}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(template.id)
                    }}
                    className={`flex-1 mr-2 py-2 rounded-lg font-medium transition-colors ${
                      selected === template.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {selected === template.id ? 'Selected ✓' : 'Select'}
                  </button>
                  
                  <button className="px-3 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors bg-slate-700 hover:bg-slate-600 rounded-lg">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected template summary */}
      {selected && (
        <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Selected Template</h3>
              <p className="text-slate-400">
                {templates.find(t => t.id === selected)?.title} - {templates.find(t => t.id === selected)?.desc}
              </p>
            </div>
            <div className="text-emerald-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
