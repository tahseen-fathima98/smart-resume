'use client'
import React from 'react'

interface WizardStep {
  id: string
  title: string
  description: string
}

interface ProgressBarProps {
  steps: WizardStep[]
  currentStep: number
  completedSteps: number[]
}

export default function ProgressBar({ steps, currentStep, completedSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center overflow-x-auto pb-1">
        {steps.map((step, index) => {
          const isDone = completedSteps.includes(index)
          const isCurrent = index === currentStep
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    background: isCurrent ? 'var(--accent)' : isDone ? 'var(--accent-soft)' : 'var(--bg-muted)',
                    color: isCurrent ? '#fff' : isDone ? 'var(--accent-text)' : 'var(--text-faint)',
                    border: isCurrent ? '1px solid transparent' : '1px solid var(--border)'
                  }}
                >
                  {isDone ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className="hidden text-[11px] font-medium sm:block"
                  style={{ color: isCurrent ? 'var(--text)' : 'var(--text-faint)' }}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="mx-1.5 h-px flex-1 sm:mx-2"
                  style={{ background: isDone ? 'var(--accent)' : 'var(--border)', minWidth: '1.25rem' }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
          Step {currentStep + 1} of {steps.length}
        </p>
        <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--text)' }}>
          {steps[currentStep]?.title}
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
          {steps[currentStep]?.description}
        </p>
      </div>
    </div>
  )
}
