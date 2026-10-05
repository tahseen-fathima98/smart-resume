import { NextResponse } from 'next/server'
import { getOrCreateSessionId } from '../../../../lib/session'
import { createShareLink } from '../../../../lib/resumeStore'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const sessionId = await getOrCreateSessionId()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing resume id' }, { status: 400 })
    }

    const shareId = await createShareLink(id, sessionId)
    return NextResponse.json({ shareId })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create share link: ' + String(err) }, { status: 500 })
  }
}
