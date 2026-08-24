'use client'

import { useState, useEffect, useRef } from 'react'
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

function SkeletonCards() {
  return (
    <div className="px-4 grid grid-cols-2 gap-x-3 gap-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mb-4">
          <div className="rounded-lg bg-gray-100 w-full animate-pulse" style={{ paddingTop: '100%' }} />
          <div className="mt-2 space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            <div className="h-7 bg-gray-100 rounded-full animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
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
  const [hydrated, setHydrated] = useState(false)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mark as hydrated after first render (SSR content is already there,
    // this enables any client-side enhancements)
    setHydrated(true)
  }, [])

  const cfg = config || defaultConfig
  const heroImage = cfg.heroImage ? `/api/files${cfg.heroImage}` : '/sunglasses/cover.webp'
  const logoUrl = cfg.logoImage ? `/api/files${cfg.logoImage}` : ''

  const handleViewChange = (v: 'catalog' | 'contact') => {
    setView(v)
    if (v === 'contact') {
      // Scroll to top of contact section
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen flex flex-col shadow-sm">
        <SiteHeader view={view} onViewChange={handleViewChange} logoUrl={logoUrl} />
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
                {/* Show skeleton while not hydrated, real content after */}
                {!hydrated ? (
                  <div className="py-4">
                    <div className="px-4 pt-2 pb-2">
                      <div className="h-5 bg-gray-100 rounded animate-pulse w-32" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-48 mt-2" />
                    </div>
                    <SkeletonCards />
                  </div>
                ) : (
                  categories.map(category => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      products={productsByCategory.get(category.id) ?? []}
                      config={cfg}
                    />
                  ))
                )}
              </div>
            </>
          ) : (
            <div ref={contactRef}>
              <ContactView config={cfg} />
            </div>
          )}
        </main>
        <SiteFooter config={cfg} />
        <CartDrawer config={cfg} />
      </div>
    </div>
  )
}
