'use client'
import React from 'react'

interface WizardLayoutProps {
  children: React.ReactNode
  onNext?: () => void
  onPrev?: () => void
  nextLabel?: string
  prevLabel?: string
  showNext?: boolean
  showPrev?: boolean
  isNextDisabled?: boolean
  nextVariant?: 'primary' | 'success'
}

export default function WizardLayout({ 
  children, 
  onNext, 
  onPrev, 
  nextLabel = 'Next Step',
  prevLabel = 'Previous',
  showNext = true,
  showPrev = true,
  isNextDisabled = false,
  nextVariant = 'primary'
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="w-full border-b border-white/10 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">SF</div>
            <div>
              <h1 className="text-lg font-semibold text-white">Smart Resume Builder</h1>
              <p className="text-xs text-slate-400">TypeScript · Next.js · Tailwind · HF AI</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-slate-400">
            AI-Powered Resume Creation
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="min-h-[calc(100vh-200px)]">
          {children}
        </div>

        {/* Navigation Footer */}
        <footer className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-white/20 p-6 mt-8 -mx-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              {showPrev && onPrev ? (
                <button
                  onClick={onPrev}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {prevLabel}
                </button>
              ) : (
                <div></div>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              {showNext && onNext && (
                <button
                  onClick={onNext}
                  disabled={isNextDisabled}
                  className={`
                    px-8 py-3 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl
                    ${nextVariant === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50'
                      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50'
                    }
                    text-white disabled:text-slate-400 disabled:cursor-not-allowed
                    ${isNextDisabled ? 'opacity-50' : 'hover:scale-105'}
                  `}
                >
                  {nextLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}