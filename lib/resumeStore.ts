import { v4 as uuidv4 } from 'uuid'
import { getDb, persistDb } from './db'

export type Skill = { name: string; level: number }
export type Experience = { company: string; role: string; date: string; details?: string }
export type Education = { school: string; degree: string; date: string }
export type Contact = { email: string; phone: string; location: string; linkedin: string; website: string }

export type ResumeData = {
  name: string
  title: string
  summary: string
  contact?: Contact
  experiences: Experience[]
  education?: Education[]
  skills: Skill[]
  template: string
}

export type ResumeRecord = {
  id: string
  data: ResumeData
  shareId: string | null
  createdAt: string
  updatedAt: string
}

function rowToRecord(row: any): ResumeRecord {
  return {
    id: row.id,
    data: JSON.parse(row.data),
    shareId: row.share_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function getResumeBySession(sessionId: string): Promise<ResumeRecord | null> {
  const db = await getDb()
  const stmt = db.prepare('SELECT * FROM resumes WHERE session_id = ? ORDER BY updated_at DESC LIMIT 1')
  stmt.bind([sessionId])
  let record: ResumeRecord | null = null
  if (stmt.step()) {
    record = rowToRecord(stmt.getAsObject())
  }
  stmt.free()
  return record
}

export async function upsertResume(sessionId: string, data: ResumeData, existingId?: string): Promise<ResumeRecord> {
  const db = await getDb()
  const now = new Date().toISOString()

  if (existingId) {
    const checkStmt = db.prepare('SELECT id FROM resumes WHERE id = ? AND session_id = ?')
    checkStmt.bind([existingId, sessionId])
    const exists = checkStmt.step()
    checkStmt.free()

    if (exists) {
      db.run('UPDATE resumes SET data = ?, updated_at = ? WHERE id = ? AND session_id = ?', [
        JSON.stringify(data), now, existingId, sessionId
      ])
      persistDb(db)
      return (await getResumeById(existingId))!
    }
  }

  const id = uuidv4()
  db.run(
    'INSERT INTO resumes (id, session_id, data, share_id, created_at, updated_at) VALUES (?, ?, ?, NULL, ?, ?)',
    [id, sessionId, JSON.stringify(data), now, now]
  )
  persistDb(db)
  return (await getResumeById(id))!
}

export async function getResumeById(id: string): Promise<ResumeRecord | null> {
  const db = await getDb()
  const stmt = db.prepare('SELECT * FROM resumes WHERE id = ?')
  stmt.bind([id])
  let record: ResumeRecord | null = null
  if (stmt.step()) {
    record = rowToRecord(stmt.getAsObject())
  }
  stmt.free()
  return record
}

export async function getResumeByShareId(shareId: string): Promise<ResumeRecord | null> {
  const db = await getDb()
  const stmt = db.prepare('SELECT * FROM resumes WHERE share_id = ?')
  stmt.bind([shareId])
  let record: ResumeRecord | null = null
  if (stmt.step()) {
    record = rowToRecord(stmt.getAsObject())
  }
  stmt.free()
  return record
}

export async function createShareLink(id: string, sessionId: string): Promise<string> {
  const db = await getDb()
  const existing = await getResumeById(id)
  if (!existing) throw new Error('Resume not found')

  if (existing.shareId) {
    return existing.shareId
  }

  const shareId = uuidv4().slice(0, 8)
  db.run('UPDATE resumes SET share_id = ? WHERE id = ? AND session_id = ?', [shareId, id, sessionId])
  persistDb(db)
  return shareId
}
