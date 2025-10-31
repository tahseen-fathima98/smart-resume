'use client'
import React, { useCallback, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onSkip: () => void
}

export default function FileUpload({ onFileSelect, onSkip }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-slate-300">
          Upload your current resume to get started, or create a new one from scratch
        </p>
      </div>

      {/* File Upload Area */}
      <div className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 backdrop-blur-sm
        ${dragActive 
          ? 'border-purple-400 bg-purple-500/10' 
          : selectedFile 
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/10'
        }
      `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="space-y-6">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-400/20">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">File Selected!</h3>
                <p className="text-slate-400">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drag & Drop Your Resume
                </h3>
                <p className="text-slate-400 mb-4">
                  or click to browse your files
                </p>
                <p className="text-sm text-slate-500">
                  Supports: PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        {selectedFile ? (
          <button
            onClick={() => onFileSelect(selectedFile)}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Process Resume
          </button>
        ) : (
          <label
            htmlFor="file-upload"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Choose File
          </label>
        )}
        
        <button
          onClick={onSkip}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          Skip & Create New Resume
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-amber-300 font-medium">Privacy Note</p>
            <p className="text-xs text-amber-200/80 mt-1">
              Your resume data is processed locally and never stored on our servers. We respect your privacy and data security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}