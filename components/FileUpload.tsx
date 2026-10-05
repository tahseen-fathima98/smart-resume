'use client'
import React, { useCallback, useState } from 'react'
import type { ParsedResume } from '../lib/resumeParser'

interface FileUploadProps {
  onParsed: (parsed: ParsedResume) => void
  onSkip: () => void
}

export default function FileUpload({ onParsed, onSkip }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const pickFile = (file: File) => {
    setError(null)
    setSelectedFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      pickFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      pickFile(e.target.files[0])
    }
  }

  const processFile = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process file')
      }

      onParsed(data.parsed)
    } catch (err: any) {
      setError(err.message || 'Something went wrong while processing your file')
    } finally {
      setLoading(false)
    }
  }

  const dropzoneBorder = dragActive
    ? 'var(--accent)'
    : selectedFile
      ? 'var(--success)'
      : 'var(--border-strong)'

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        Upload your current resume to get started, or create a new one from scratch.
      </p>

      <div
        className="relative rounded-xl px-6 py-12 text-center transition-colors"
        style={{
          border: `1.5px dashed ${dropzoneBorder}`,
          background: dragActive ? 'var(--accent-soft)' : 'var(--bg-muted)'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          id="file-upload"
          disabled={loading}
        />

        {selectedFile ? (
          <div className="space-y-2">
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="break-all font-medium" style={{ color: 'var(--text)' }}>{selectedFile.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'var(--bg-raised)', color: 'var(--text-faint)', border: '1px solid var(--border)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: 'var(--text)' }}>Drag & drop your resume</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>or click to browse files</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>PDF, DOCX or TXT — up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg px-4 py-3 text-sm" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {selectedFile ? (
          <button onClick={processFile} disabled={loading} className="btn btn-primary flex-1">
            {loading && <span className="spinner" />}
            {loading ? 'Processing…' : 'Process resume'}
          </button>
        ) : (
          <label htmlFor="file-upload" className="btn btn-primary flex-1 cursor-pointer">
            Choose file
          </label>
        )}
        <button onClick={onSkip} disabled={loading} className="btn btn-outline flex-1">
          Start from scratch
        </button>
      </div>

      <p className="mt-6 text-xs leading-relaxed" style={{ color: 'var(--text-faint)' }}>
        We extract text from your file and use heuristics to detect your name, summary, experience and
        skills. Parsing isn&apos;t perfect — review and edit the results in the next steps.
      </p>
    </div>
  )
}
