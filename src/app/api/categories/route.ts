import { NextResponse } from 'next/server'
import { db, ensureSchema, ensureSeeded } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await ensureSchema(); await ensureSeeded()
    const categories = await db.category.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { products: true } } } })
    return NextResponse.json({ categories })
  } catch { return NextResponse.json({ categories: [] }) }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  try {
    const { name, slug, description, image } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    const maxOrder = await db.category.aggregate({ _max: { sortOrder: true } })
    const category = await db.category.create({
      data: { name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''), description: description||'', image: image||'', sortOrder: (maxOrder._max.sortOrder ?? -1)+1 }
    })
    return NextResponse.json({ category })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
