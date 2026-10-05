'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ResumePreview from '../../../components/ResumePreview'
import type { ResumeData } from '../../../lib/resumeStore'

export default function SharedResumePage() {
  const params = useParams<{ shareId: string }>()
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/resumes/shared/${params.shareId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Resume not found')
        setResume(data.resume.data)
      } catch (err: any) {
        setError(err.message || 'Failed to load resume')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.shareId])

  return (
    <div className="min-h-screen px-3 py-10 sm:px-4 sm:py-14" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Shared resume</h1>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: 3 }} />
          </div>
        )}

        {error && (
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        {resume && (
          <ResumePreview
            name={resume.name}
            title={resume.title}
            summary={resume.summary}
            contact={resume.contact}
            experiences={resume.experiences}
            education={resume.education}
            skills={resume.skills}
            template={resume.template}
          />
        )}
      </div>
    </div>
  )
}
