import type { Experience, Skill } from './resumeStore'

export type ParsedResume = {
  name: string
  title: string
  summary: string
  experiences: Experience[]
  skills: Skill[]
}

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
  'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
  'HTML', 'CSS', 'Tailwind', 'SASS', 'Redux', 'GraphQL', 'REST', 'SQL', 'PostgreSQL', 'MySQL',
  'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'CI/CD', 'Jenkins',
  'Terraform', 'Linux', 'Agile', 'Scrum', 'Figma', 'Photoshop', 'Excel', 'Communication',
  'Leadership', 'Project Management', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'PyTorch'
]

const SECTION_HEADERS = {
  summary: /^(summary|profile|objective|about)\b/i,
  experience: /^(experience|work experience|employment|professional experience)\b/i,
  skills: /^(skills|technical skills|core competencies)\b/i,
  education: /^(education|academic)\b/i
}

function splitLines(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
}

function detectSections(lines: string[]) {
  const sections: Record<string, string[]> = { header: [], summary: [], experience: [], skills: [], education: [], other: [] }
  let current = 'header'

  for (const line of lines) {
    let matched = false
    for (const [key, regex] of Object.entries(SECTION_HEADERS)) {
      if (regex.test(line) && line.length < 40) {
        current = key
        matched = true
        break
      }
    }
    if (!matched) {
      sections[current].push(line)
    }
  }
  return sections
}

function guessNameAndTitle(headerLines: string[]): { name: string; title: string } {
  const name = headerLines[0] || ''
  const title = headerLines.find((l, i) => i > 0 && l.length < 60 && !/@|http|\d{3}/.test(l)) || ''
  return { name, title }
}

function extractSkills(skillLines: string[], fullText: string): Skill[] {
  const found = new Set<string>()

  const joined = skillLines.join(', ')
  joined.split(/[,•|\n]/).forEach(part => {
    const trimmed = part.trim()
    if (trimmed && trimmed.length < 30 && trimmed.length > 1) {
      found.add(trimmed)
    }
  })

  COMMON_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(fullText)) {
      found.add(skill)
    }
  })

  return Array.from(found)
    .slice(0, 12)
    .map(name => ({ name, level: 65 + Math.floor(Math.random() * 30) }))
}

function extractExperiences(experienceLines: string[]): Experience[] {
  const experiences: Experience[] = []
  const dateRegex = /(\b\d{4}\b.*?(present|\b\d{4}\b))/i

  let current: Experience | null = null
  for (const line of experienceLines) {
    const dateMatch = line.match(dateRegex)
    if (dateMatch) {
      if (current) experiences.push(current)
      const rest = line.replace(dateMatch[0], '').replace(/[-–—|]+$/, '').replace(/^[-–—|]+/, '').trim()
      const parts = rest.split(/ at | @ |,/i).map(s => s.trim()).filter(Boolean)
      current = {
        role: parts[0] || rest || 'Role',
        company: parts[1] || '',
        date: dateMatch[0].trim(),
        details: ''
      }
    } else if (current) {
      current.details = current.details ? `${current.details} ${line}` : line
    }
  }
  if (current) experiences.push(current)

  return experiences.slice(0, 6)
}

export function parseResumeText(text: string): ParsedResume {
  const lines = splitLines(text)
  const sections = detectSections(lines)
  const { name, title } = guessNameAndTitle(sections.header)

  return {
    name: name || '',
    title: title || '',
    summary: sections.summary.join(' ').slice(0, 500) || '',
    experiences: extractExperiences(sections.experience),
    skills: extractSkills(sections.skills, text)
  }
}

export async function extractTextFromFile(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase()

  if (mimeType === 'application/pdf' || ext === 'pdf') {
    const pdfParse = (await import('pdf-parse')).default
    const result = await pdfParse(buffer)
    return result.text
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  return buffer.toString('utf-8')
}
