import { NextRequest, NextResponse } from 'next/server'
import { login, setSessionCookie, makeSessionToken } from '@/lib/auth'
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
    await setSessionCookie(token)
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Login failed' }, { status: 500 }) }
}
