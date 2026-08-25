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
    const data: Record<string, unknown> = {}
    for (const k of ['name','slug','description','note','price','imageUrl','imageSmall','categoryId','featured','trending','active']) {
      if (body[k] !== undefined) data[k] = body[k]
    }
    if (body.imageUrl !== undefined && body.imageSmall === undefined) data.imageSmall = body.imageUrl
    const product = await db.product.update({ where: { id }, data, include: { category: true, addons: true } })
    return NextResponse.json({ product })
  } catch { return NextResponse.json({ error: 'Failed to update' }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }) }
}
