import { NextResponse } from 'next/server'
import { getOrCreateSessionId } from '../../../lib/session'
import { getResumeBySession, upsertResume } from '../../../lib/resumeStore'

export const runtime = 'nodejs'

export async function GET() {
  const sessionId = await getOrCreateSessionId()
  const record = await getResumeBySession(sessionId)
  return NextResponse.json({ resume: record })
}

export async function PUT(request: Request) {
  try {
    const sessionId = await getOrCreateSessionId()
    const body = await request.json()
    const { id, data } = body

    if (!data) {
      return NextResponse.json({ error: 'Missing resume data' }, { status: 400 })
    }

    const record = await upsertResume(sessionId, data, id)
    return NextResponse.json({ resume: record })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save resume: ' + String(err) }, { status: 500 })
  }
}
