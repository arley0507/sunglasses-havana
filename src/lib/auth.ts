import { cookies } from 'next/headers'
import { db } from './db'
import { NextRequest } from 'next/server'

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
    httpOnly: false, sameSite: 'none', path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10,
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

export function isAuthenticatedFromRequest(req: NextRequest): boolean {
  const cookieHeader = req.headers.get('cookie') || ''
  const cookieMap: Record<string, string> = {}
  cookieHeader.split(';').forEach(c => {
    const [k, ...v] = c.trim().split('=')
    if (k) cookieMap[k] = v.join('=')
  })
  return cookieMap[SESSION_COOKIE] === VALID_TOKEN
}
