'use client'
import React, { useState, useEffect, useRef } from 'react'
import ResumePreview from '../components/ResumePreview'
import SkillAnalyzer from '../components/SkillAnalyzer'
import AISuggestionPanel from '../components/AISuggestionPanel'
import TemplateSelector from '../components/TemplateSelector'
import FileUpload from '../components/FileUpload'
import WizardLayout from '../components/WizardLayout'
import ProgressBar from '../components/ProgressBar'
import type { ParsedResume } from '../lib/resumeParser'

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

export type Education = {
  school: string
  degree: string
  date: string
}

export type Contact = {
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

type WizardStep = 'upload' | 'template' | 'editor' | 'skills' | 'ai-enhance' | 'preview'

const wizardSteps = [
  { id: 'upload', title: 'Upload', description: 'Upload an existing resume or start fresh' },
  { id: 'template', title: 'Template', description: 'Choose your design' },
  { id: 'editor', title: 'Details', description: 'Add your information' },
  { id: 'skills', title: 'Skills', description: 'List your abilities' },
  { id: 'ai-enhance', title: 'AI Enhance', description: 'Get improvement suggestions' },
  { id: 'preview', title: 'Preview', description: 'Review and export' }
]

const emptyContact: Contact = { email: '', phone: '', location: '', linkedin: '', website: '' }

const emptyProfile = {
  name: '',
  title: '',
  summary: '',
  contact: emptyContact,
  experiences: [] as Experience[],
  education: [] as Education[],
  skills: [] as Skill[]
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional')
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  const [profile, setProfile] = useState(emptyProfile)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasLoaded = useRef(false)

  const updateProfile = (patch: Partial<typeof profile>) => {
    setProfile(prev => ({ ...prev, ...patch }))
  }

  // Load any previously saved resume for this browser session
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/resumes')
        const data = await res.json()
        if (!cancelled && data.resume) {
          const { data: saved, id } = data.resume
          setProfile({
            name: saved.name || '',
            title: saved.title || '',
            summary: saved.summary || '',
            contact: { ...emptyContact, ...saved.contact },
            experiences: saved.experiences || [],
            education: saved.education || [],
            skills: saved.skills || []
          })
          setSelectedTemplate(saved.template || 'professional')
          setResumeId(id)
        }
      } catch {
        // no saved resume, ignore
      } finally {
        if (!cancelled) {
          hasLoaded.current = true
          setLoadingInitial(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Autosave profile + template whenever they change (debounced)
  useEffect(() => {
    if (!hasLoaded.current) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)

    setSaveStatus('saving')
    saveTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/resumes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: resumeId,
            data: { ...profile, template: selectedTemplate }
          })
        })
        const data = await res.json()
        if (res.ok && data.resume) {
          setResumeId(data.resume.id)
          setSaveStatus('saved')
        } else {
          setSaveStatus('error')
        }
      } catch {
        setSaveStatus('error')
      }
    }, 800)

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, selectedTemplate])

  const currentStepIndex = wizardSteps.findIndex(step => step.id === currentStep)

  const nextStep = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps(prev => [...prev, currentStepIndex])
    }
    const nextIndex = currentStepIndex + 1
    if (nextIndex < wizardSteps.length) {
      setCurrentStep(wizardSteps[nextIndex].id as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(wizardSteps[prevIndex].id as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleParsedResume = (parsed: ParsedResume) => {
    setProfile(prev => ({
      ...prev,
      name: parsed.name,
      title: parsed.title,
      summary: parsed.summary,
      experiences: parsed.experiences,
      skills: parsed.skills
    }))
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

  const handleShare = async () => {
    setShareLoading(true)
    setShareError(null)
    try {
      let currentId = resumeId
      if (!currentId) {
        const saveRes = await fetch('/api/resumes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { ...profile, template: selectedTemplate } })
        })
        const saveData = await saveRes.json()
        if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save resume')
        currentId = saveData.resume.id
        setResumeId(currentId)
      }

      const res = await fetch('/api/resumes/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create share link')

      setShareUrl(`${window.location.origin}/shared/${data.shareId}`)
    } catch (err: any) {
      setShareError(err.message || 'Something went wrong')
    } finally {
      setShareLoading(false)
    }
  }

  const copyShareUrl = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      // clipboard not available; user can copy manually
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg)' }}>
        <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: 3 }} />
      </div>
    )
  }

  return (
    <div>
      <div className="fixed right-4 top-4 z-40 no-print">
        <SaveStatusPill status={saveStatus} />
      </div>

      <WizardLayout
        onNext={currentStep !== 'preview' ? nextStep : undefined}
        onPrev={currentStepIndex > 0 ? prevStep : undefined}
        showNext={currentStep !== 'preview'}
        showPrev={currentStepIndex > 0}
        isNextDisabled={!isStepValid()}
        nextLabel={currentStep === 'ai-enhance' ? 'Finish & preview' : 'Next step'}
        nextVariant={currentStep === 'ai-enhance' ? 'success' : 'primary'}
      >
        <ProgressBar steps={wizardSteps} currentStep={currentStepIndex} completedSteps={completedSteps} />

        <div className="fade-in">
          {currentStep === 'upload' && (
            <FileUpload onParsed={handleParsedResume} onSkip={nextStep} />
          )}

          {currentStep === 'template' && (
            <TemplatePicker
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
              onPreview={setPreviewTemplate}
              previewTemplate={previewTemplate}
              onClosePreview={() => setPreviewTemplate(null)}
              profile={profile}
            />
          )}

          {currentStep === 'editor' && (
            <EditorStep profile={profile} updateProfile={updateProfile} template={selectedTemplate} />
          )}

          {currentStep === 'skills' && (
            <SkillAnalyzer skills={profile.skills} onChange={skills => updateProfile({ skills })} />
          )}

          {currentStep === 'ai-enhance' && (
            <AISuggestionPanel profile={profile} onApplySuggestion={patch => updateProfile(patch)} />
          )}

          {currentStep === 'preview' && (
            <PreviewStep
              profile={profile}
              template={selectedTemplate}
              shareUrl={shareUrl}
              shareLoading={shareLoading}
              shareError={shareError}
              copySuccess={copySuccess}
              onShare={handleShare}
              onCopy={copyShareUrl}
            />
          )}
        </div>
      </WizardLayout>
    </div>
  )
}

function SaveStatusPill({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null
  const copy = { saving: 'Saving…', saved: 'Saved', error: 'Save failed' }[status]
  const className = status === 'error' ? 'badge-danger' : status === 'saved' ? 'badge-success' : 'badge'
  return (
    <span className={`badge ${className}`}>
      {status === 'saving' && <span className="spinner" style={{ width: '0.7rem', height: '0.7rem', borderWidth: 2 }} />}
      {copy}
    </span>
  )
}

function TemplatePicker({
  selected,
  onSelect,
  onPreview,
  previewTemplate,
  onClosePreview,
  profile
}: {
  selected: string
  onSelect: (id: string) => void
  onPreview: (id: string) => void
  previewTemplate: string | null
  onClosePreview: () => void
  profile: typeof emptyProfile
}) {
  return (
    <div>
      <TemplateSelector onTemplateSelect={onSelect} selectedTemplate={selected} onPreview={onPreview} />

      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={onClosePreview}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={onClosePreview} className="btn btn-outline !bg-white">Close</button>
            </div>
            <ResumePreview
              name={profile.name || 'Your Name'}
              title={profile.title || 'Your Title'}
              summary={profile.summary || 'A short professional summary will appear here.'}
              contact={profile.contact}
              experiences={
                profile.experiences.length
                  ? profile.experiences
                  : [{ company: 'Company Inc.', role: 'Your Role', date: '2022 - Present', details: 'Key achievements and responsibilities.' }]
              }
              education={profile.education}
              skills={profile.skills.length ? profile.skills : [{ name: 'Skill', level: 80 }]}
              template={previewTemplate}
              showPrintButton={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function EditorStep({
  profile,
  updateProfile,
  template
}: {
  profile: typeof emptyProfile
  updateProfile: (patch: Partial<typeof emptyProfile>) => void
  template: string
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label className="field-label">Full name *</label>
          <input
            className="input"
            value={profile.name}
            placeholder="Jane Doe"
            onChange={e => updateProfile({ name: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label">Professional title *</label>
          <input
            className="input"
            value={profile.title}
            placeholder="e.g. Frontend Developer"
            onChange={e => updateProfile({ title: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label">Professional summary *</label>
          <textarea
            className="textarea"
            rows={4}
            value={profile.summary}
            placeholder="A brief summary of your key skills and experience..."
            onChange={e => updateProfile({ summary: e.target.value })}
          />
        </div>

        <ContactEditor
          contact={profile.contact}
          onChange={contact => updateProfile({ contact })}
        />

        <ExperienceEditor
          experiences={profile.experiences}
          onChange={experiences => updateProfile({ experiences })}
        />

        <EducationEditor
          education={profile.education}
          onChange={education => updateProfile({ education })}
        />
      </div>

      <div className="lg:sticky lg:top-8">
        <div className="surface-muted p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text)' }}>Live preview</h3>
          <ResumePreview
            name={profile.name || 'Your Name'}
            title={profile.title || 'Your Title'}
            summary={profile.summary || 'Your summary will appear here...'}
            contact={profile.contact}
            experiences={profile.experiences}
            education={profile.education}
            skills={profile.skills}
            template={template}
            showPrintButton={false}
          />
        </div>
      </div>
    </div>
  )
}

function ContactEditor({ contact, onChange }: { contact: Contact; onChange: (c: Contact) => void }) {
  const set = (patch: Partial<Contact>) => onChange({ ...contact, ...patch })

  return (
    <div className="space-y-3">
      <label className="field-label !mb-0">Contact details</label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className="input"
          placeholder="Email"
          value={contact.email}
          onChange={e => set({ email: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone"
          value={contact.phone}
          onChange={e => set({ phone: e.target.value })}
        />
        <input
          className="input"
          placeholder="Location, e.g. Austin, TX"
          value={contact.location}
          onChange={e => set({ location: e.target.value })}
        />
        <input
          className="input"
          placeholder="LinkedIn URL"
          value={contact.linkedin}
          onChange={e => set({ linkedin: e.target.value })}
        />
        <input
          className="input sm:col-span-2"
          placeholder="Website / portfolio / GitHub"
          value={contact.website}
          onChange={e => set({ website: e.target.value })}
        />
      </div>
    </div>
  )
}

function EducationEditor({ education, onChange }: { education: Education[]; onChange: (edu: Education[]) => void }) {
  const add = () => onChange([...education, { school: '', degree: '', date: '' }])
  const update = (index: number, patch: Partial<Education>) => {
    onChange(education.map((e, i) => (i === index ? { ...e, ...patch } : e)))
  }
  const remove = (index: number) => onChange(education.filter((_, i) => i !== index))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="field-label !mb-0">Education</label>
        <button onClick={add} className="btn btn-ghost !px-2 !py-1 text-xs">+ Add</button>
      </div>

      {education.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No education added yet.</p>
      )}

      {education.map((edu, index) => (
        <div key={index} className="surface relative space-y-3 p-4">
          <button
            onClick={() => remove(index)}
            className="absolute right-3 top-3"
            style={{ color: 'var(--text-faint)' }}
            aria-label="Remove education"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="grid grid-cols-1 gap-3 pr-6 sm:grid-cols-2">
            <input
              className="input"
              placeholder="School"
              value={edu.school}
              onChange={e => update(index, { school: e.target.value })}
            />
            <input
              className="input"
              placeholder="Degree, e.g. B.S. Computer Science"
              value={edu.degree}
              onChange={e => update(index, { degree: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Date range, e.g. 2018 - 2022"
            value={edu.date}
            onChange={e => update(index, { date: e.target.value })}
          />
        </div>
      ))}
    </div>
  )
}

function PreviewStep({
  profile,
  template,
  shareUrl,
  shareLoading,
  shareError,
  copySuccess,
  onShare,
  onCopy
}: {
  profile: typeof emptyProfile
  template: string
  shareUrl: string | null
  shareLoading: boolean
  shareError: string | null
  copySuccess: boolean
  onShare: () => void
  onCopy: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => window.print()} className="btn btn-success">
          Download PDF
        </button>
        <button onClick={onShare} disabled={shareLoading} className="btn btn-outline">
          {shareLoading && <span className="spinner" />}
          Share link
        </button>
      </div>

      {shareError && (
        <div className="mx-auto max-w-lg rounded-lg p-4 text-sm" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          {shareError}
        </div>
      )}

      {shareUrl && (
        <div className="mx-auto max-w-lg rounded-lg p-4" style={{ background: 'var(--success-soft)' }}>
          <p className="mb-2 text-sm" style={{ color: 'var(--success)' }}>Your resume is shareable at:</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={shareUrl}
              className="input flex-1"
              onFocus={e => e.target.select()}
            />
            <button onClick={onCopy} className="btn btn-primary whitespace-nowrap">
              {copySuccess ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      )}

      <div className="surface-muted p-4 sm:p-6">
        <ResumePreview
          name={profile.name}
          title={profile.title}
          summary={profile.summary}
          contact={profile.contact}
          experiences={profile.experiences}
          education={profile.education}
          skills={profile.skills}
          template={template}
        />
      </div>
    </div>
  )
}

function ExperienceEditor({ experiences, onChange }: { experiences: Experience[]; onChange: (exps: Experience[]) => void }) {
  const addExperience = () => {
    onChange([...experiences, { company: '', role: '', date: '', details: '' }])
  }

  const updateExperience = (index: number, patch: Partial<Experience>) => {
    onChange(experiences.map((exp, i) => (i === index ? { ...exp, ...patch } : exp)))
  }

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="field-label !mb-0">Work experience</label>
        <button onClick={addExperience} className="btn btn-ghost !px-2 !py-1 text-xs">+ Add</button>
      </div>

      {experiences.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No experience added yet.</p>
      )}

      {experiences.map((exp, index) => (
        <div key={index} className="surface relative space-y-3 p-4">
          <button
            onClick={() => removeExperience(index)}
            className="absolute right-3 top-3"
            style={{ color: 'var(--text-faint)' }}
            aria-label="Remove experience"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="grid grid-cols-1 gap-3 pr-6 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Role"
              value={exp.role}
              onChange={e => updateExperience(index, { role: e.target.value })}
            />
            <input
              className="input"
              placeholder="Company"
              value={exp.company}
              onChange={e => updateExperience(index, { company: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Date range, e.g. 2022 - Present"
            value={exp.date}
            onChange={e => updateExperience(index, { date: e.target.value })}
          />
          <textarea
            className="textarea"
            rows={2}
            placeholder="Details / achievements"
            value={exp.details || ''}
            onChange={e => updateExperience(index, { details: e.target.value })}
          />
        </div>
      ))}
    </div>
  )
}
