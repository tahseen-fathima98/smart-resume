import { NextResponse } from 'next/server'
import { extractTextFromFile, parseResumeText } from '../../../lib/resumeParser'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 })
    }

    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt']
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const text = await extractTextFromFile(buffer, file.type, file.name)

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: 'Could not extract text from this file. Try a different format or fill in details manually.' }, { status: 422 })
    }

    const parsed = parseResumeText(text)

    return NextResponse.json({ parsed })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process file: ' + String(err) }, { status: 500 })
  }
}
