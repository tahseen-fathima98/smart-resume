'use client'
import React, { useState, useEffect } from 'react'
import ResumePreview from '../components/ResumePreview'
import SkillAnalyzer from '../components/SkillAnalyzer'
import AISuggestionPanel from '../components/AISuggestionPanel'
import TemplateSelector from '../components/TemplateSelector'
import FileUpload from '../components/FileUpload'
import WizardLayout from '../components/WizardLayout'
import ProgressBar from '../components/ProgressBar'

export type Skill = {
  name: string
  level: number
}

export type Experience = {
  company: string
  role: string
  date: string
  details?: string
}

type WizardStep = 'upload' | 'template' | 'editor' | 'skills' | 'ai-enhance' | 'preview'

const wizardSteps = [
  {
    id: 'upload',
    title: 'Upload',
    description: 'Upload existing resume or start fresh',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  },
  {
    id: 'template',
    title: 'Template',
    description: 'Choose your design',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  },
  {
    id: 'editor',
    title: 'Edit Info',
    description: 'Add your details',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Analyze abilities',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  },
  {
    id: 'ai-enhance',
    title: 'AI Enhance',
    description: 'AI improvements',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Final result',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  }
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Resume data state
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    summary: '',
    experiences: [] as Experience[],
    skills: [] as Skill[]
  })

  const updateProfile = (patch: Partial<typeof profile>) => {
    setProfile(prev => ({...prev, ...patch}))
  }

  const getCurrentStepIndex = () => wizardSteps.findIndex(step => step.id === currentStep)

  // Debug: Log current step to console
  console.log('Current wizard step:', currentStep)
  console.log('Current step index:', getCurrentStepIndex())
  
  // Add effect to track step changes
  useEffect(() => {
    console.log('Step changed to:', currentStep)
  }, [currentStep])

  const nextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (!completedSteps.includes(currentIndex)) {
      setCompletedSteps(prev => [...prev, currentIndex])
    }
    
    const nextIndex = currentIndex + 1
    if (nextIndex < wizardSteps.length) {
      setCurrentStep(wizardSteps[nextIndex].id as WizardStep)
    }
  }

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex()
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(wizardSteps[prevIndex].id as WizardStep)
    }
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setProfile({
      name: 'Uploaded User',
      title: 'Professional',
      summary: 'Experienced professional with uploaded resume',
      experiences: [
        { 
          company: 'Previous Company', 
          role: 'Professional Role', 
          date: '2022 - Present',
          details: 'Extracted from uploaded resume.'
        }
      ],
      skills: [
        { name: 'Extracted Skill 1', level: 80 },
        { name: 'Extracted Skill 2', level: 75 }
      ]
    })
    nextStep()
  }

  const handleSkipUpload = () => {
    setProfile({
      name: '',
      title: '',
      summary: '',
      experiences: [],
      skills: []
    })
    nextStep()
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'template':
        return selectedTemplate !== ''
      case 'editor':
        return profile.name !== '' && profile.title !== '' && profile.summary !== ''
      case 'skills':
        return profile.skills.length > 0
      default:
        return true
    }
  }

  const renderStepContent = () => {
    console.log('Rendering step content for:', currentStep)
    
    if (currentStep === 'upload') {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-8">📁 UPLOAD STEP</h1>
          <FileUpload 
            onFileSelect={handleFileUpload}
            onSkip={handleSkipUpload}
          />
        </div>
      )
    }

    if (currentStep === 'template') {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-8">🎨 TEMPLATE STEP</h1>
          <TemplateSelector 
            onTemplateSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />
        </div>
      )
    }

    if (currentStep === 'editor') {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-8">✏️ EDITOR STEP</h1>
          <p className="text-slate-400 text-lg">Edit your resume information here.</p>
        </div>
      )
    }

    if (currentStep === 'skills') {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-8">🚀 SKILLS STEP</h1>
          <p className="text-slate-400 text-lg">Add and manage your skills.</p>
        </div>
      )
    }

    if (currentStep === 'ai-enhance') {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-8">🤖 AI ENHANCE STEP</h1>
          <p className="text-slate-400 text-lg">Let AI enhance your resume.</p>
        </div>
      )
    }

    if (currentStep === 'preview') {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-8">👁️ PREVIEW STEP</h1>
          <p className="text-slate-400 text-lg">Review your final resume.</p>
        </div>
      )
    }

    return <div className="text-center py-20 text-white">Step not found: {currentStep}</div>
  }

  return (
    <div className="wizard-app">
      <WizardLayout
        onNext={currentStep !== 'preview' ? nextStep : undefined}
        onPrev={getCurrentStepIndex() > 0 ? prevStep : undefined}
        showNext={currentStep !== 'preview'}
        showPrev={getCurrentStepIndex() > 0}
        isNextDisabled={!isStepValid()}
        nextLabel={
          currentStep === 'ai-enhance' ? 'Finish & Preview' : 
          currentStep === 'preview' ? 'Download Resume' : 'Next Step'
        }
        nextVariant={currentStep === 'ai-enhance' ? 'success' : 'primary'}
      >
        {/* Progress Bar */}
        <ProgressBar 
          steps={wizardSteps}
          currentStep={getCurrentStepIndex()}
          completedSteps={completedSteps}
        />

        {/* Current Step Debug Info */}
        <div className="bg-red-500 text-white p-4 text-center mb-4 rounded">
          <strong>DEBUG: Current Step = {currentStep} (Index: {getCurrentStepIndex()})</strong>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {renderStepContent()}
        </div>
      </WizardLayout>
    </div>
  )
}