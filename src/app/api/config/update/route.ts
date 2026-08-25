import { NextRequest, NextResponse } from 'next/server'
import { db, ensureSchema, ensureSeeded } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const allowed = ['whatsappNumber','phoneDisplay','businessName','tagline','heroImage','logoImage','contactAddress','contactHours','deliveryNote','mapLat','mapLng','mapZoom','instagramUrl','facebookUrl','primaryColor','footerColor','orderMessageTemplate','cartMessageTemplate']

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  try {
    const body = await req.json()
    const data: Record<string, unknown> = {}
    for (const k of allowed) { if (body[k] !== undefined) data[k] = body[k] }
    const config = await db.siteConfig.upsert({ where: { id: 'singleton' }, update: data, create: { id: 'singleton', ...data } })
    return NextResponse.json({ config })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
