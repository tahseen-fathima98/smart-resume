'use client'
import React from 'react'

interface WizardStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface ProgressBarProps {
  steps: WizardStep[]
  currentStep: number
  completedSteps: number[]
}

export default function ProgressBar({ steps, currentStep, completedSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-12">      
      {/* Step Pills */}
      <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8 overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${index === currentStep 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                : completedSteps.includes(index)
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-slate-400'
              }
              ${index <= currentStep ? 'opacity-100' : 'opacity-50'}
            `}
          >
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${index === currentStep 
                ? 'bg-white/20' 
                : completedSteps.includes(index)
                  ? 'bg-emerald-500'
                  : 'bg-white/10'
              }
            `}>
              {completedSteps.includes(index) ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="hidden sm:inline">{step.title}</span>
          </div>
        ))}
      </div>
      
      {/* Current Step Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Step {currentStep + 1}
        </h2>
        <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
          {steps[currentStep]?.title}
        </h3>
        <p className="text-slate-300">
          {steps[currentStep]?.description}
        </p>
      </div>
    </div>
  )
}