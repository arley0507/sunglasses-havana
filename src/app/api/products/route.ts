import { NextResponse } from 'next/server'
import { db, ensureSchema, ensureSeeded } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await ensureSchema()
    await ensureSeeded()
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === '1'
    const authed = await isAuthenticated()
    const where = authed && all ? {} : { active: true }
    const products = await db.product.findMany({
      where, include: { category: true, addons: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  try {
    const body = await request.json()
    const { name, slug, description, note, price, imageUrl, imageSmall, categoryId, featured, trending, active } = body
    if (!name || !categoryId) return NextResponse.json({ error: 'Name and category required' }, { status: 400 })
    const product = await db.product.create({
      data: {
        name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: description || '', note: note || '',
        price: Number(price) || 0, imageUrl: imageUrl || '', imageSmall: imageSmall || imageUrl || '',
        featured: Boolean(featured), trending: Boolean(trending), active: active !== false, categoryId,
      },
      include: { category: true, addons: true },
    })
    return NextResponse.json({ product })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
