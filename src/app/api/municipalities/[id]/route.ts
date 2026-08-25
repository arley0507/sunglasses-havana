import { NextResponse } from 'next/server'
import { db, ensureSchema } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema()
  const { id } = await params
  const body = await request.json()
  const municipality = await db.municipality.update({ where: { id }, data: body })
  return NextResponse.json({ municipality })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema()
  const { id } = await params
  await db.municipality.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
