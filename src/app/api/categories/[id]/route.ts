import { NextResponse } from 'next/server'
import { db, ensureSchema, ensureSeeded } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  try {
    const { id } = await params
    const body = await request.json()
    const category = await db.category.update({ where: { id }, data: body })
    return NextResponse.json({ category })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  try {
    const { id } = await params
    await db.product.updateMany({ where: { categoryId: id }, data: { active: false } })
    await db.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
