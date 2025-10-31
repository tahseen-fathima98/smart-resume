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

export default function Home(){
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

  // Track step changes for progress
  useEffect(() => {
    // Step tracking for progress updates
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
    // Here you would typically parse the file and populate profile data
    // For now, we'll set some sample data
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
    // Set empty profile for new resume
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
    if (currentStep === 'upload') {
      return (
        <div>
          <FileUpload 
            onFileSelect={handleFileUpload}
            onSkip={handleSkipUpload}
          />
        </div>
      )
    }

    if (currentStep === 'template') {
      return (
        <div>
          <TemplateSelector 
            onTemplateSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />
        </div>
      )
    }

    if (currentStep === 'editor') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form inputs */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">First Name *</label>
                <input 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm" 
                  value={profile.name.split(' ')[0] || ''}
                  placeholder="Enter your first name"
                  onChange={(e) => {
                    const lastName = profile.name.split(' ').slice(1).join(' ')
                    updateProfile({name: e.target.value + (lastName ? ' ' + lastName : '')})
                  }} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Last Name *</label>
                <input 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm" 
                  value={profile.name.split(' ').slice(1).join(' ') || ''}
                  placeholder="Enter your last name"
                  onChange={(e) => {
                    const firstName = profile.name.split(' ')[0] || ''
                    updateProfile({name: firstName + (e.target.value ? ' ' + e.target.value : '')})
                  }} 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Professional Title *</label>
              <input 
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm" 
                value={profile.title}
                placeholder="e.g., Frontend Developer"
                onChange={(e) => updateProfile({title: e.target.value})} 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Professional Summary *</label>
              <textarea 
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm resize-none" 
                rows={4}
                value={profile.summary}
                placeholder="Write a brief professional summary highlighting your key skills and experience..."
                onChange={(e) => updateProfile({summary: e.target.value})} 
                required
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h3>
              <ResumePreview 
                name={profile.name || 'Your Name'}
                title={profile.title || 'Your Title'}
                summary={profile.summary || 'Your summary will appear here...'}
                experiences={profile.experiences}
                skills={profile.skills}
              />
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 'skills') {
      return (
        <div>
          <SkillAnalyzer skills={profile.skills} />
        </div>
      )
    }

    if (currentStep === 'ai-enhance') {
      return (
        <div>
          <AISuggestionPanel 
            profile={profile} 
            onApplySuggestion={(patch: Partial<typeof profile>) => updateProfile(patch)} 
          />
        </div>
      )
    }

    if (currentStep === 'preview') {
      return (
        <div className="space-y-8">
          {/* Download Options */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 border border-white/20 hover:border-white/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Link
            </button>
          </div>

          {/* Final Preview */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <ResumePreview 
              name={profile.name}
              title={profile.title}
              summary={profile.summary}
              experiences={profile.experiences}
              skills={profile.skills}
            />
          </div>
        </div>
      )
    }

    return <div className="text-center py-20 text-white">Step not found: {currentStep}</div>
  }

  return (
    <div className="wizard-app">
      {/* Progress Bar - Outside Glass Card */}
      <div className="relative z-10 pt-4 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <ProgressBar 
              steps={wizardSteps}
              currentStep={getCurrentStepIndex()}
              completedSteps={completedSteps}
            />
          </div>
        </div>
      </div>

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
        {/* Step Content */}
        <div className="step-content">
          {renderStepContent()}
        </div>
      </WizardLayout>
    </div>
  )
}