import { NextResponse } from 'next/server'
import { db, ensureSchema, ensureSeeded } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await ensureSchema(); await ensureSeeded()
    let config = await db.siteConfig.findUnique({ where: { id: 'singleton' } })
    if (!config) config = await db.siteConfig.create({ data: { id: 'singleton' } })
    return NextResponse.json({ config })
  } catch {
    return NextResponse.json({ config: { id:'singleton', whatsappNumber:'5363185747', phoneDisplay:'+5363185747', businessName:'Sunglasses Havana', tagline:'', heroImage:'', logoImage:'', contactAddress:'', contactHours:'', deliveryNote:'', mapLat:23.127889, mapLng:-82.371722, mapZoom:14, instagramUrl:'', facebookUrl:'', primaryColor:'#E5533C', footerColor:'#0A1628', orderMessageTemplate:'', cartMessageTemplate:'', updatedAt:'' } })
  }
}
