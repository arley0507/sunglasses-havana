'use client'

import { useState, useEffect, useRef } from 'react'
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

function HeroSkeleton() {
  return (
    <div className="w-full bg-gray-200 animate-pulse" style={{ aspectRatio: '1024/751' }} />
  )
}

function TabsSkeleton() {
  return (
    <div className="bg-white w-full px-4 py-2.5 flex gap-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80px' }} />
      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '120px' }} />
      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80px' }} />
      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80px' }} />
    </div>
  )
}

function SkeletonCards() {
  return (
    <div className="px-4 grid grid-cols-2 gap-x-3 gap-y-4 pt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mb-4">
          <div className="rounded-lg bg-gray-200 w-full animate-pulse" style={{ paddingTop: '100%' }} />
          <div className="mt-2 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '75%' }} />
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '50%' }} />
            <div className="h-7 bg-gray-200 rounded-full animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function FullSkeleton() {
  return (
    <>
      <TabsSkeleton />
      <div className="px-4 pt-2 pb-2">
        <div className="h-5 bg-gray-200 rounded animate-pulse" style={{ width: '120px' }} />
        <div className="h-3 bg-gray-200 rounded animate-pulse mt-2" style={{ width: '180px' }} />
      </div>
      <SkeletonCards />
    </>
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
  const [loaded, setLoaded] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const cfg = config || defaultConfig
  const heroImage = cfg.heroImage ? `/api/files${cfg.heroImage}` : '/sunglasses/cover.webp'
  const logoUrl = cfg.logoImage ? `/api/files${cfg.logoImage}` : ''

  const handleViewChange = (v: 'catalog' | 'contact') => {
    setView(v)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen flex flex-col shadow-sm">
        <SiteHeader view={view} onViewChange={handleViewChange} logoUrl={logoUrl} />
        <main className="pt-14 flex-1 flex flex-col">
          {/* Hero — show skeleton until image loads */}
          <section className="bg-[#0A1628]">
            <div className="relative w-full overflow-hidden">
              {!heroLoaded && (
                <div className="w-full bg-gray-200 animate-pulse" style={{ aspectRatio: '1024/751' }} />
              )}
              <img
                src={heroImage}
                alt="Sunglasses Havana"
                fetchPriority="high"
                onLoad={() => setHeroLoaded(true)}
                className="w-full h-auto block"
                style={{ opacity: heroLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
              />
            </div>
          </section>

          {view === 'catalog' ? (
            <>
              {!loaded ? (
                <FullSkeleton />
              ) : (
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
              )}
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
