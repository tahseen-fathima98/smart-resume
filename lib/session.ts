import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

const SESSION_COOKIE = 'sr_session'

export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(SESSION_COOKIE)?.value
  if (existing) return existing

  const sessionId = uuidv4()
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/'
  })
  return sessionId
}
