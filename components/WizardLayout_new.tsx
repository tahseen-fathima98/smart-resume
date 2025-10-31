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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
              SR
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Smart Resume Builder</h1>
              <p className="text-sm text-slate-300">AI-Powered Resume Creation</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-300 hover:text-white transition-colors">Contact Us</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Content Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8 md:p-12">
              {children}
              
              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
                <div className="flex-1">
                  {showPrev && onPrev ? (
                    <button
                      onClick={onPrev}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 border border-white/10 hover:border-white/20"
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
                        px-8 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg
                        ${nextVariant === 'success'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        }
                        text-white disabled:opacity-50 disabled:cursor-not-allowed
                        ${!isNextDisabled ? 'hover:scale-105 hover:shadow-xl' : ''}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}