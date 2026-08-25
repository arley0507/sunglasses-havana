import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: segments } = await params
    const filePath = segments.join('/')
    if (!filePath.startsWith('uploads/') && !filePath.startsWith('products/')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (filePath.startsWith('uploads/')) {
      const filename = filePath.split('/').pop() || ''
      const id = filename.split('.')[0]
      if (id.length >= 10) {
        try {
          const uploaded = await db.uploadedImage.findUnique({ where: { id } })
          if (uploaded) return new NextResponse(Buffer.from(uploaded.data), { headers: { 'Content-Type': uploaded.mimeType, 'Cache-Control': 'public, max-age=31536000, immutable' } })
        } catch {}
      }
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }) }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Solo imágenes' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Máx 5MB' }, { status: 400 })
    const rawBuffer = Buffer.from(await file.arrayBuffer())
    let compressedBuffer: Buffer
    try {
      const sharp = (await import('sharp')).default
      compressedBuffer = await sharp(rawBuffer).resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
    } catch { compressedBuffer = rawBuffer }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    const filename = `${id}.webp`
    await db.uploadedImage.create({ data: { id, filename, mimeType: 'image/webp', size: compressedBuffer.length, data: compressedBuffer } })
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch { return NextResponse.json({ error: 'Upload failed' }, { status: 500 }) }
}
