import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  const cookieMap: Record<string, string> = {}
  cookieHeader.split(';').forEach(c => {
    const [k, ...v] = c.trim().split('=')
    if (k) cookieMap[k] = v.join('=')
  })
  const token = cookieMap[SESSION_COOKIE]
  return NextResponse.json({ authenticated: token === 'sunglasses-havana-admin-session-valid' })
}
