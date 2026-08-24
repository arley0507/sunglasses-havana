'use client'

import { useState, useEffect } from 'react'
import { business } from '@/lib/catalog-data'
import { SiteHeader } from './SiteHeader'
import { CategoryTabs } from './CategoryTabs'
import { CategorySection } from './CategorySection'
import { SiteFooter } from './SiteFooter'
import { CartDrawer } from './CartDrawer'
import { ContactView } from './ContactView'
import type { SiteConfig } from '@/lib/types'

const defaultConfig: SiteConfig = {
  id: 'singleton', whatsappNumber: '5363185747', phoneDisplay: '+5363185747',
  businessName: 'Sunglasses Havana', tagline: 'Gafas de sol y ópticas en La Habana',
  heroImage: '', logoImage: '',
  contactAddress: 'Desagüe / Franco y Oquendo # 165. Centro Habana.',
  contactHours: 'En cualquier horario excepto de 12 del mediodía a 3 pm.',
  deliveryNote: '', mapLat: 23.127889, mapLng: -82.371722, mapZoom: 14,
  instagramUrl: '', facebookUrl: '', primaryColor: '#E5533C', footerColor: '#0A1628',
  orderMessageTemplate: '', cartMessageTemplate: '', updatedAt: '',
}

export default function HomeClient({
  categories,
  productsByCategory,
  config,
}: {
  categories: any[]
  productsByCategory: Map<string, any[]>
  config: SiteConfig | null
}) {
  const [view, setView] = useState<'catalog' | 'contact'>('catalog')
  const cfg = config || defaultConfig
  const heroImage = cfg.heroImage ? `/api/files${cfg.heroImage}` : '/sunglasses/cover.webp'
  const logoUrl = cfg.logoImage ? `/api/files${cfg.logoImage}` : ''

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen flex flex-col shadow-sm">
        <SiteHeader view={view} onViewChange={setView} logoUrl={logoUrl} />
        <main className="pt-14 flex-1 flex flex-col">
          {/* Hero */}
          <section className="bg-[#0A1628]">
            <div className="relative w-full overflow-hidden">
              <img src={heroImage} alt="Sunglasses Havana" fetchPriority="high" className="w-full h-auto block" />
            </div>
          </section>

          {view === 'catalog' ? (
            <>
              <CategoryTabs categories={categories} />
              <div className="flex flex-col">
                {categories.map(category => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    products={productsByCategory.get(category.id) ?? []}
                    config={cfg}
                  />
                ))}
              </div>
            </>
          ) : (
            <ContactView config={cfg} />
          )}
        </main>
        <SiteFooter config={cfg} />
        <CartDrawer config={cfg} />
      </div>
    </div>
  )
}
