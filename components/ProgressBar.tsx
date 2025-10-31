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
    <div className="w-full bg-slate-800/50 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Resume Builder Progress</h2>
        <span className="text-sm text-slate-400">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300
                ${completedSteps.includes(index) 
                  ? 'bg-emerald-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' 
                    : 'bg-slate-700 text-slate-400'
                }
              `}>
                {completedSteps.includes(index) ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  index <= currentStep ? 'text-white' : 'text-slate-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-20">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-700 -z-10">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Current step info */}
      <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="text-blue-400">
            {steps[currentStep]?.icon}
          </div>
          <div>
            <h3 className="font-medium text-white">{steps[currentStep]?.title}</h3>
            <p className="text-sm text-slate-400">{steps[currentStep]?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}