'use client'
import React from 'react'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'

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
  prevLabel = 'Back',
  showNext = true,
  showPrev = true,
  isNextDisabled = false,
  nextVariant = 'primary'
}: WizardLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Smart Resume
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:sawa.seido08@gmail.com"
              className="hidden text-sm sm:inline"
              style={{ color: 'var(--text-muted)' }}
            >
              Contact
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="surface p-4 sm:p-8 md:p-10" style={{ boxShadow: 'var(--shadow-sm)' }}>
          {children}

          <div
            className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 pt-6 sm:flex-row sm:items-center"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {showPrev && onPrev ? (
              <button onClick={onPrev} className="btn btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {prevLabel}
              </button>
            ) : (
              <span />
            )}

            {showNext && onNext && (
              <button
                onClick={onNext}
                disabled={isNextDisabled}
                className={`btn ${nextVariant === 'success' ? 'btn-success' : 'btn-primary'}`}
              >
                {nextLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
