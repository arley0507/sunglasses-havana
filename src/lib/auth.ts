import { cookies } from 'next/headers'
import { db } from './db'

export const SESSION_COOKIE = 'sunglasses_admin_session'
const VALID_TOKEN = 'sunglasses-havana-admin-session-valid'

export async function login(username: string, password: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { username } })
  if (!user) return false
  return user.password === password
}

export async function setSessionCookie(token: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10, secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function makeSessionToken(): Promise<string> {
  return VALID_TOKEN
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  return token === VALID_TOKEN
}
