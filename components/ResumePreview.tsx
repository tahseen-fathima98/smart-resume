'use client'
import React, { useRef } from 'react'
import { Skill, Experience, Education, Contact } from '../app/page'
import { useReactToPrint } from 'react-to-print'

type Props = {
  name: string
  title: string
  summary: string
  contact?: Contact
  experiences: Experience[]
  education?: Education[]
  skills: Skill[]
  template?: string
  showPrintButton?: boolean
}

export type TemplateId = 'professional' | 'modern' | 'executive' | 'minimalist' | 'creative' | 'tech'

const SECTION_LABEL = 'text-[11px] font-bold uppercase tracking-[0.12em] mb-3'

function SkillBars({ skills, barColor, labelClass }: { skills: Skill[]; barColor: string; labelClass?: string }) {
  return (
    <div className="space-y-2.5">
      {skills.map((skill, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className={labelClass || 'font-medium text-gray-700'}>{skill.name}</span>
            <span className="text-gray-400">{skill.level}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200">
            <div className="h-1.5 rounded-full" style={{ width: `${skill.level}%`, background: barColor }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillPills({ skills, bg, text }: { skills: Skill[]; bg: string; text: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill, i) => (
        <span
          key={i}
          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{ background: bg, color: text }}
        >
          {skill.name}
        </span>
      ))}
    </div>
  )
}

function SkillTags({ skills }: { skills: Skill[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill, i) => (
        <span
          key={i}
          className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 font-mono text-[11px] text-gray-700"
        >
          {skill.name}
        </span>
      ))}
    </div>
  )
}

function contactParts(contact?: Contact): string[] {
  if (!contact) return []
  return [contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean)
}

function ContactLine({ contact, className }: { contact?: Contact; className?: string }) {
  const parts = contactParts(contact)
  if (parts.length === 0) return null
  return <p className={className || 'text-xs text-gray-500'}>{parts.join('  ·  ')}</p>
}

function EducationBlock({ education, labelClass, itemClass }: { education?: Education[]; labelClass: string; itemClass?: string }) {
  if (!education || education.length === 0) return null
  return (
    <section className="mb-6">
      <h2 className={labelClass}>Education</h2>
      <div className="space-y-2">
        {education.map((edu, i) => (
          <div key={i} className={itemClass || 'flex flex-wrap items-baseline justify-between gap-x-3 text-sm'}>
            <span className="font-medium text-gray-900">{edu.degree}{edu.degree && edu.school ? ', ' : ''}{edu.school}</span>
            <span className="text-xs text-gray-500">{edu.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ResumePreview({
  name,
  title,
  summary,
  contact,
  experiences,
  education,
  skills,
  template = 'professional',
  showPrintButton = true
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const id = (template as TemplateId) || 'professional'

  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: `${name || 'resume'}-resume`
  })

  const printButton = showPrintButton && (
    <div className="mb-4 flex justify-end no-print">
      <button onClick={handlePrint} className="btn btn-outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
        </svg>
        Print / save as PDF
      </button>
    </div>
  )

  return (
    <div className="w-full">
      {printButton}
      <div ref={ref} className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-white text-gray-900 shadow-xl print:rounded-none print:shadow-none">
        {renderTemplate(id, { name, title, summary, contact, experiences, education, skills })}
      </div>
    </div>
  )
}

type Data = {
  name: string
  title: string
  summary: string
  contact?: Contact
  experiences: Experience[]
  education?: Education[]
  skills: Skill[]
}

function renderTemplate(id: TemplateId, data: Data) {
  switch (id) {
    case 'modern':
      return <ModernTemplate {...data} />
    case 'executive':
      return <ExecutiveTemplate {...data} />
    case 'minimalist':
      return <MinimalistTemplate {...data} />
    case 'creative':
      return <CreativeTemplate {...data} />
    case 'tech':
      return <TechTemplate {...data} />
    default:
      return <ProfessionalTemplate {...data} />
  }
}

// Classic, centered, ATS-safe single column.
function ProfessionalTemplate({ name, title, summary, contact, experiences, education, skills }: Data) {
  return (
    <div className="p-8 sm:p-10">
      <header className="mb-8 border-b-2 border-gray-900 pb-6 text-center">
        <h1 className="font-serif text-3xl font-bold text-gray-900">{name || 'Your Name'}</h1>
        <p className="mt-1 text-base text-gray-600">{title || 'Professional Title'}</p>
        <ContactLine contact={contact} className="mt-2 text-xs text-gray-500" />
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className={SECTION_LABEL + ' text-gray-900'}>Summary</h2>
          <p className="leading-relaxed text-gray-700">{summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className={SECTION_LABEL + ' text-gray-900'}>Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold text-gray-900">
                    {exp.role} <span className="font-normal text-gray-500">· {exp.company}</span>
                  </h3>
                  <span className="text-xs text-gray-500">{exp.date}</span>
                </div>
                {exp.details && <p className="mt-1 text-sm leading-relaxed text-gray-700">{exp.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <EducationBlock education={education} labelClass={SECTION_LABEL + ' text-gray-900'} />

      {skills.length > 0 && (
        <section>
          <h2 className={SECTION_LABEL + ' text-gray-900'}>Skills</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <SkillBars skills={skills} barColor="#111827" />
          </div>
        </section>
      )}
    </div>
  )
}

// Left-aligned header, two-column sidebar for skills.
function ModernTemplate({ name, title, summary, contact, experiences, education, skills }: Data) {
  return (
    <div>
      <header className="bg-emerald-600 p-8 text-white">
        <h1 className="text-3xl font-bold">{name || 'Your Name'}</h1>
        <p className="mt-1 text-emerald-50">{title || 'Professional Title'}</p>
        <ContactLine contact={contact} className="mt-2 text-xs text-emerald-50/90" />
      </header>
      <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-3">
        <div className="sm:col-span-2">
          {summary && (
            <section className="mb-6">
              <h2 className={SECTION_LABEL + ' text-emerald-700'}>Summary</h2>
              <p className="leading-relaxed text-gray-700">{summary}</p>
            </section>
          )}
          {experiences.length > 0 && (
            <section>
              <h2 className={SECTION_LABEL + ' text-emerald-700'}>Experience</h2>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={i} className="border-l-2 border-emerald-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                    <p className="text-sm text-gray-600">{exp.company} · {exp.date}</p>
                    {exp.details && <p className="mt-1 text-sm leading-relaxed text-gray-700">{exp.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div>
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className={SECTION_LABEL + ' text-emerald-700'}>Skills</h2>
              <SkillBars skills={skills} barColor="#059669" />
            </div>
          )}
          {education && education.length > 0 && (
            <div>
              <h2 className={SECTION_LABEL + ' text-emerald-700'}>Education</h2>
              <div className="space-y-2.5">
                {education.map((edu, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.school}</p>
                    <p className="text-xs text-gray-400">{edu.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Bold uppercase name, generous whitespace, senior-level tone.
function ExecutiveTemplate({ name, title, summary, contact, experiences, education, skills }: Data) {
  return (
    <div className="p-8 sm:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-900">{name || 'Your Name'}</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">{title || 'Professional Title'}</p>
        <ContactLine contact={contact} className="mt-3 text-xs uppercase tracking-wide text-gray-400" />
        <div className="mt-6 h-[3px] w-16 bg-gray-900" />
      </header>

      {summary && (
        <section className="mb-8">
          <h2 className={SECTION_LABEL + ' text-gray-500'}>Profile</h2>
          <p className="text-[15px] leading-loose text-gray-700">{summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mb-8">
          <h2 className={SECTION_LABEL + ' text-gray-500'}>Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-base font-semibold text-gray-900">{exp.role}</h3>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{exp.date}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">{exp.company}</p>
                {exp.details && <p className="mt-2 text-sm leading-relaxed text-gray-700">{exp.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <EducationBlock education={education} labelClass={SECTION_LABEL + ' text-gray-500'} />

      {skills.length > 0 && (
        <section>
          <h2 className={SECTION_LABEL + ' text-gray-500'}>Core Strengths</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <SkillBars skills={skills} barColor="#1f2937" />
          </div>
        </section>
      )}
    </div>
  )
}

// Grayscale only, tight spacing, content-first.
function MinimalistTemplate({ name, title, summary, contact, experiences, education, skills }: Data) {
  const minimalLabel = 'mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400'
  return (
    <div className="p-8 sm:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{name || 'Your Name'}</h1>
        <p className="text-sm text-gray-500">{title || 'Professional Title'}</p>
        <ContactLine contact={contact} className="mt-1 text-xs text-gray-400" />
      </header>

      {summary && (
        <section className="mb-5">
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mb-5">
          <h2 className={minimalLabel}>Experience</h2>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i} className="text-sm">
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="font-medium text-gray-900">{exp.role}, {exp.company}</span>
                  <span className="text-gray-400">{exp.date}</span>
                </div>
                {exp.details && <p className="mt-0.5 text-gray-600">{exp.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className={minimalLabel}>Education</h2>
          <div className="space-y-1">
            {education.map((edu, i) => (
              <div key={i} className="flex flex-wrap justify-between gap-x-3 text-sm">
                <span className="text-gray-900">{edu.degree}, {edu.school}</span>
                <span className="text-gray-400">{edu.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className={minimalLabel}>Skills</h2>
          <p className="text-sm text-gray-700">{skills.map(s => s.name).join(' · ')}</p>
        </section>
      )}
    </div>
  )
}

// Full-height colored sidebar, rounded skill pills.
function CreativeTemplate({ name, title, summary, contact, experiences, education, skills }: Data) {
  const contactParts = [contact?.email, contact?.phone, contact?.location, contact?.linkedin, contact?.website].filter(Boolean)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3">
      <aside className="bg-purple-600 p-6 text-white sm:col-span-1">
        <h1 className="text-2xl font-bold leading-tight">{name || 'Your Name'}</h1>
        <p className="mt-1 text-sm text-purple-100">{title || 'Professional Title'}</p>
        {contactParts.length > 0 && (
          <div className="mt-4 space-y-0.5 text-xs text-purple-100/90">
            {contactParts.map((part, i) => <p key={i}>{part}</p>)}
          </div>
        )}
        {skills.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-purple-200">Skills</h2>
            <SkillPills skills={skills} bg="rgba(255,255,255,0.15)" text="#fff" />
          </div>
        )}
        {education && education.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-purple-200">Education</h2>
            <div className="space-y-2.5 text-xs">
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-purple-100/90">{edu.school}</p>
                  <p className="text-purple-100/70">{edu.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
      <div className="p-6 sm:col-span-2 sm:p-8">
        {summary && (
          <section className="mb-6">
            <h2 className={SECTION_LABEL + ' text-purple-700'}>About</h2>
            <p className="leading-relaxed text-gray-700">{summary}</p>
          </section>
        )}
        {experiences.length > 0 && (
          <section>
            <h2 className={SECTION_LABEL + ' text-purple-700'}>Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <p className="text-sm text-gray-600">{exp.company} · {exp.date}</p>
                  {exp.details && <p className="mt-1 text-sm leading-relaxed text-gray-700">{exp.details}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// Monospace accents, tag-style skills, left rule per role.
function TechTemplate({ name, title, summary, contact, experiences, education, skills }: Data) {
  const techLabel = SECTION_LABEL + ' font-mono text-indigo-600'
  return (
    <div className="p-8 sm:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{name || 'Your Name'}</h1>
        <p className="mt-1 font-mono text-sm text-indigo-600">{title || 'Professional Title'}</p>
        <ContactLine contact={contact} className="mt-2 font-mono text-xs text-gray-400" />
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className={techLabel}>// summary</h2>
          <p className="leading-relaxed text-gray-700">{summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className={techLabel}>// experience</h2>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="border-l-2 border-indigo-200 pl-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <span className="font-mono text-xs text-gray-400">{exp.date}</span>
                </div>
                <p className="text-sm text-gray-600">{exp.company}</p>
                {exp.details && <p className="mt-1 text-sm leading-relaxed text-gray-700">{exp.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className={techLabel}>// education</h2>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <span className="text-gray-900">{edu.degree}, {edu.school}</span>
                <span className="font-mono text-xs text-gray-400">{edu.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className={techLabel}>// skills</h2>
          <SkillTags skills={skills} />
        </section>
      )}
    </div>
  )
}
