import { NextResponse } from 'next/server'
import { getResumeByShareId } from '../../../../../lib/resumeStore'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params
  const record = await getResumeByShareId(shareId)

  if (!record) {
    return NextResponse.json({ error: 'Shared resume not found' }, { status: 404 })
  }

  return NextResponse.json({ resume: record })
}
