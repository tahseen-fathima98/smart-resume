'use client'
import React, { useState } from 'react'

const templates = [
  {
    id: 'professional',
    title: 'Professional',
    desc: 'Centered header, single column — the safe choice for corporate roles.',
    category: 'Corporate'
  },
  {
    id: 'modern',
    title: 'Modern',
    desc: 'Color header with a sidebar for skills. Good all-rounder.',
    category: 'Creative'
  },
  {
    id: 'executive',
    title: 'Executive',
    desc: 'Bold uppercase name and wide spacing for senior-level roles.',
    category: 'Executive'
  },
  {
    id: 'minimalist',
    title: 'Minimalist',
    desc: 'Grayscale, tight and content-first. Nothing but the words.',
    category: 'Simple'
  },
  {
    id: 'creative',
    title: 'Creative',
    desc: 'Full-height color sidebar with pill-style skills.',
    category: 'Creative'
  },
  {
    id: 'tech',
    title: 'Tech',
    desc: 'Monospace accents and tag-style skills for engineering roles.',
    category: 'Technology'
  }
] as const

const categories = ['All', 'Corporate', 'Creative', 'Executive', 'Simple', 'Technology']

function Thumb({ id }: { id: string }) {
  const bar = 'h-1.5 rounded-sm bg-gray-300'
  const line = 'h-1 rounded-sm bg-gray-200'

  if (id === 'modern') {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white text-[6px]">
        <div className="bg-emerald-600 px-2 py-2">
          <div className="h-1.5 w-14 rounded-sm bg-white/90" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-1 p-2">
          <div className="col-span-2 space-y-1">
            <div className={line + ' w-full'} />
            <div className={line + ' w-4/5'} />
          </div>
          <div className="space-y-1">
            <div className={bar + ' w-full'} style={{ background: '#059669' }} />
            <div className={bar + ' w-2/3'} style={{ background: '#059669' }} />
          </div>
        </div>
      </div>
    )
  }

  if (id === 'creative') {
    return (
      <div className="flex h-full w-full overflow-hidden rounded bg-white">
        <div className="w-1/3 space-y-1 bg-purple-600 p-2">
          <div className="h-1.5 w-full rounded-sm bg-white/90" />
          <div className="h-1 w-2/3 rounded-sm bg-white/50" />
        </div>
        <div className="flex-1 space-y-1 p-2">
          <div className={line + ' w-full'} />
          <div className={line + ' w-4/5'} />
          <div className={line + ' w-3/5'} />
        </div>
      </div>
    )
  }

  if (id === 'executive') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded bg-white p-3">
        <div className="h-1.5 w-1/2 rounded-sm bg-gray-800" />
        <div className="h-3 w-8 bg-gray-900" style={{ height: 2 }} />
        <div className="mt-1 w-full space-y-1">
          <div className={line + ' w-full'} />
          <div className={line + ' w-5/6 mx-auto'} />
        </div>
      </div>
    )
  }

  if (id === 'minimalist') {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-1 rounded bg-white p-3">
        <div className="h-1.5 w-1/3 rounded-sm bg-gray-900" />
        <div className="mt-2 space-y-1">
          <div className={line + ' w-full'} />
          <div className={line + ' w-3/4'} />
        </div>
      </div>
    )
  }

  if (id === 'tech') {
    return (
      <div className="flex h-full w-full flex-col gap-1.5 rounded bg-white p-3">
        <div className="h-1.5 w-1/2 rounded-sm bg-gray-900" />
        <div className="h-1 w-1/3 rounded-sm bg-indigo-400" />
        <div className="mt-1 space-y-1 border-l-2 border-indigo-200 pl-1.5">
          <div className={line + ' w-full'} />
          <div className={line + ' w-2/3'} />
        </div>
        <div className="mt-1 flex gap-1">
          <div className="h-2 w-4 rounded-sm border border-gray-300" />
          <div className="h-2 w-4 rounded-sm border border-gray-300" />
        </div>
      </div>
    )
  }

  // professional (default)
  return (
    <div className="flex h-full w-full flex-col items-center gap-1.5 rounded bg-white p-3">
      <div className="h-1.5 w-1/2 rounded-sm bg-gray-800" />
      <div className="h-1 w-1/3 rounded-sm bg-gray-300" />
      <div className="mt-1 w-full space-y-1 border-t border-gray-200 pt-1.5">
        <div className={line + ' w-full'} />
        <div className={line + ' w-4/5'} />
      </div>
    </div>
  )
}

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void
  selectedTemplate?: string
  onPreview?: (templateId: string) => void
}

export default function TemplateSelector({ onTemplateSelect, selectedTemplate, onPreview }: TemplateSelectorProps) {
  const [filter, setFilter] = useState('All')
  const selected = selectedTemplate || 'professional'

  const visible = filter === 'All' ? templates : templates.filter(t => t.category === filter)

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={
              filter === category
                ? { background: 'var(--accent)', color: '#fff' }
                : { background: 'var(--bg-muted)', color: 'var(--text-muted)' }
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(template => {
          const isSelected = selected === template.id
          return (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className="cursor-pointer overflow-hidden rounded-xl transition-colors"
              style={{
                border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                background: 'var(--bg-raised)'
              }}
            >
              <div className="h-32 p-3" style={{ background: 'var(--bg-muted)' }}>
                <Thumb id={template.id} />
              </div>
              <div className="p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{template.title}</h3>
                  {isSelected && <span className="badge badge-accent">Selected</span>}
                </div>
                <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{template.desc}</p>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onPreview?.(template.id)
                  }}
                  className="btn btn-ghost w-full !py-1.5 text-xs"
                >
                  Preview
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
