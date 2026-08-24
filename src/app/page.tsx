import { db } from '@/lib/db'
import { imageUrl } from '@/lib/image-url'
import { business as staticBusiness } from '@/lib/catalog-data'
import type { SiteConfig, Product, Category } from '@/lib/types'
import HomeClient from '@/components/site/HomeClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type CatalogProduct = {
  id: string; slug: string; name: string; note: string; price: number
  image: string; imageSmall: string; trending: boolean; categoryId: string
}

function toCatalogProduct(p: Product): CatalogProduct {
  return {
    id: p.id, slug: p.slug || p.id, name: p.name,
    note: p.note || p.description || '',
    price: p.price,
    image: imageUrl(p.imageUrl) || '',
    imageSmall: imageUrl(p.imageSmall || p.imageUrl),
    trending: p.trending || p.featured || false,
    categoryId: p.categoryId,
  }
}

export default async function Home() {
  // Fetch all data server-side (no caching)
  const [products, categories, config] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.siteConfig.findUnique({ where: { id: 'singleton' } }),
  ])

  const siteConfig: SiteConfig | null = config ? {
    ...config,
    heroImage: config.heroImage || '',
    logoImage: config.logoImage || '',
  } as SiteConfig : null

  const catalogProducts = products.map(toCatalogProduct)
  const activeCategories = categories
    .filter(c => products.some(p => p.categoryId === c.id))
    .map((c, i) => ({ ...c, sortOrder: i }))

  // Group by category
  const productsByCategory = new Map<string, CatalogProduct[]>()
  for (const p of catalogProducts) {
    const list = productsByCategory.get(p.categoryId) ?? []
    list.push(p)
    productsByCategory.set(p.categoryId, list)
  }

  return (
    <HomeClient
      categories={activeCategories as any}
      productsByCategory={productsByCategory as any}
      config={siteConfig}
    />
  )
}
