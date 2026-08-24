'use client'

import { useState, useEffect, useCallback } from 'react'
import { categories as staticCategories, products as staticProducts } from '@/lib/catalog-data'
import { SiteHeader } from '@/components/site/SiteHeader'
import { CategoryTabs } from '@/components/site/CategoryTabs'
import { CategorySection } from '@/components/site/CategorySection'
import { SiteFooter } from '@/components/site/SiteFooter'
import { CartDrawer } from '@/components/site/CartDrawer'
import { ContactView } from '@/components/site/ContactView'
import type { SiteConfig, Product, Category } from '@/lib/types'
import { imageUrl } from '@/lib/image-url'

const defaultConfig: SiteConfig | null = {
  id: 'singleton', whatsappNumber: '5363185747', phoneDisplay: '+5363185747',
  businessName: 'Sunglasses Havana', tagline: 'Gafas de sol y ópticas en La Habana',
  heroImage: '', logoImage: '',
  contactAddress: 'Desagüe / Franco y Oquendo # 165. Centro Habana.',
  contactHours: 'En cualquier horario excepto de 12 del mediodía a 3 pm.',
  deliveryNote: 'Debe contactarnos y enviarnos su dirección exacta porque el mensajero cobra por km.',
  mapLat: 23.127889, mapLng: -82.371722, mapZoom: 14,
  instagramUrl: '', facebookUrl: '',
  primaryColor: '#E5533C', footerColor: '#0A1628',
  orderMessageTemplate: '', cartMessageTemplate: '', updatedAt: '',
}

type CatalogProduct = {
  id: string; slug: string; name: string; note: string; price: number
  image: string; imageSmall: string; trending: boolean; categoryId: string; blurKey: string
}

function toCatalogProduct(p: Product): CatalogProduct {
  return {
    id: p.id, slug: p.slug || p.id, name: p.name, note: p.note || p.description || '',
    price: p.price, image: imageUrl(p.imageUrl) || p.imageSmall || '',
    imageSmall: imageUrl(p.imageSmall || p.imageUrl),
    trending: p.trending || p.featured || false, categoryId: p.categoryId, blurKey: p.slug || p.id,
  }
}

export default function Home() {
  const [view, setView] = useState<'catalog' | 'contact'>('catalog')
  const [config, setConfig] = useState<SiteConfig | null>(defaultConfig)
  const [dynamicProducts, setDynamicProducts] = useState<Product[] | null>(null)
  const [dynamicCategories, setDynamicCategories] = useState<Category[] | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [configRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/config').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
      ])
      if (configRes.config) setConfig({ ...defaultConfig, ...configRes.config })
      if (productsRes.products) setDynamicProducts(productsRes.products)
      if (categoriesRes.categories) setDynamicCategories(categoriesRes.categories)
    } catch {}
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const heroImage = config?.heroImage ? imageUrl(config.heroImage) : '/sunglasses/cover.webp'
  const logoUrl = config?.logoImage ? imageUrl(config.logoImage) : ''

  const allProducts = (dynamicProducts || staticProducts) as any[]
  const allCategories = (dynamicCategories || staticCategories) as any[]

  const activeCategories = allCategories
    .filter((c: any) => allProducts.filter((p: any) => p.categoryId === c.id && p.active !== false).length > 0)
    .map((c: any, i: number) => ({ ...c, sortOrder: i }))

  const productsByCategory = new Map<string, CatalogProduct[]>()
  for (const p of allProducts) {
    if (p.active === false) continue
    const cp = dynamicProducts ? toCatalogProduct(p as Product) : {
      id: p.id, slug: p.slug, name: p.name, note: p.note, price: p.price,
      image: p.image, imageSmall: p.imageSmall, trending: p.trending, categoryId: p.categoryId, blurKey: p.slug || p.id,
    }
    const list = productsByCategory.get(p.categoryId) ?? []
    list.push(cp)
    productsByCategory.set(p.categoryId, list)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen flex flex-col shadow-sm">
        <SiteHeader view={view} onViewChange={setView} logoUrl={logoUrl} />
        <main className="pt-14 flex-1 flex flex-col">
          <section className="bg-[#0A1628]">
            <div className="relative w-full overflow-hidden">
              <img src={heroImage} alt="Sunglasses Havana" fetchPriority="high" className="w-full h-auto block" />
            </div>
          </section>
          {view === 'catalog' ? (
            <>
              <CategoryTabs categories={activeCategories} />
              <div className="flex flex-col">
                {activeCategories.map((category: any) => (
                  <CategorySection key={category.id} category={category} products={productsByCategory.get(category.id) ?? []} config={config} />
                ))}
              </div>
            </>
          ) : (
            <ContactView config={config} />
          )}
        </main>
        <SiteFooter config={config} />
        <CartDrawer config={config} />
      </div>
    </div>
  )
}
