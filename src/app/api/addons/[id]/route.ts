import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function PUT() { return NextResponse.json({ error: 'Not implemented' }, { status: 501 }) }
export async function DELETE() { return NextResponse.json({ error: 'Not implemented' }, { status: 501 }) }
