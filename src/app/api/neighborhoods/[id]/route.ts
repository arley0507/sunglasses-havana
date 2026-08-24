import { NextResponse } from 'next/server'
import { db, ensureSchema } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema()
  const { id } = await params
  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (body.name !== undefined) data.name = body.name
  if (body.price !== undefined) data.price = body.price === null || body.price === '' ? null : Number(body.price)
  if (data.price !== null && data.price !== undefined) data.active = true
  if (body.active !== undefined) data.active = Boolean(body.active)
  const neighborhood = await db.neighborhood.update({ where: { id }, data })
  return NextResponse.json({ neighborhood })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema()
  const { id } = await params
  await db.neighborhood.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
