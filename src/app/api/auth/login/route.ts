import { NextRequest, NextResponse } from 'next/server'
import { login, makeSessionToken, SESSION_COOKIE } from '@/lib/auth'
import { ensureSchema, ensureSeeded } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    await ensureSchema(); await ensureSeeded()
    const ok = await login(username, password)
    if (!ok) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    const token = await makeSessionToken()
    const res = NextResponse.json({ success: true })
    // Use SameSite=None to ensure cross-serverless-function cookie sending on Vercel
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: false, // Make it readable by JS too
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
