import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaSeeded: boolean | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-seed on first access (for Vercel serverless cold starts)
export async function ensureSeeded() {
  if (globalForPrisma.prismaSeeded) return
  globalForPrisma.prismaSeeded = true
  try {
    const count = await db.product.count()
    if (count > 0) return
    // Only seed if DB is completely empty — admin user
    const existingUser = await db.user.findUnique({ where: { username: 'admin' } })
    if (!existingUser) {
      await db.user.create({ data: { username: 'admin', password: 'admin123' } })
    }
    // Create default config
    const config = await db.siteConfig.findUnique({ where: { id: 'singleton' } })
    if (!config) {
      await db.siteConfig.create({ data: { id: 'singleton' } })
    }
  } catch { /* ignore */ }
}

// Ensure schema exists (best-effort for Vercel serverless)
export async function ensureSchema() {
  try {
    await db.product.count()
  } catch { /* ignore — schema should be pushed via prisma db push */ }
}
