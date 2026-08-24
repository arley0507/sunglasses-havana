import { NextResponse } from 'next/server'
import { db, ensureSchema } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema()
  const { name, price, municipalityId, active } = await request.json()
  if (!name || !municipalityId) return NextResponse.json({ error: 'Name and municipality required' }, { status: 400 })
  const neighborhood = await db.neighborhood.create({ data: { name, price: price!==undefined?(price===''?null:Number(price)):null, municipalityId, active: active!==false } })
  return NextResponse.json({ neighborhood })
}
