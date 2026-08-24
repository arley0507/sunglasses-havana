import { NextResponse } from 'next/server'
import { db, ensureSchema, ensureSeeded } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const all = searchParams.get('all') === '1'
  const authed = await isAuthenticated()
  try {
    await ensureSchema(); await ensureSeeded()
    if (authed && all) {
      const municipalities = await db.municipality.findMany({ include: { neighborhoods: { orderBy: { name: 'asc' } } }, orderBy: { sortOrder: 'asc' } })
      return NextResponse.json({ municipalities })
    }
    const municipalities = await db.municipality.findMany({
      where: { neighborhoods: { some: { price: { not: null }, active: true } } },
      include: { neighborhoods: { where: { price: { not: null }, active: true }, orderBy: { name: 'asc' } } },
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json({ municipalities })
  } catch { return NextResponse.json({ municipalities: [] }) }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSchema(); await ensureSeeded()
  const { name } = await request.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const maxOrder = await db.municipality.aggregate({ _max: { sortOrder: true } })
  const municipality = await db.municipality.create({ data: { name, sortOrder: (maxOrder._max.sortOrder ?? -1)+1 } })
  return NextResponse.json({ municipality })
}
