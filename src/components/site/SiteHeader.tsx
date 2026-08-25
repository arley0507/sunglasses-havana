'use client'

import { business } from '@/lib/catalog-data'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { useEffect, useState } from 'react'

type View = 'catalog' | 'contact'

export function SiteHeader({
  view,
  onViewChange,
  logoUrl,
}: {
  view: View
  onViewChange: (v: View) => void
  logoUrl?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(0)
  const cartMode = useCart((s) => s.cartMode)
  const cartCount = useCart((s) => s.getCount())
  const openCart = useCart((s) => s.openCart)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (mounted) setCount(cartCount)
  }, [cartCount, mounted])

  const logo = logoUrl || business.logoSmall

  return (
    <>
      <section className="bg-[#0A1628] fixed w-full max-w-lg top-0 z-30 flex h-14 left-1/2 -translate-x-1/2 shadow-md">
        <div className="flex px-3 py-2 items-center w-full">
          {/* Logo + title together */}
          <div className="flex-none flex items-center gap-1.5">
            <img
              src={logo}
              alt={business.name}
              width={36}
              height={36}
              loading="eager"
              fetchPriority="high"
              className="rounded-full w-9 h-9 object-cover ring-1 ring-white/20 flex-shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-green-400 text-[9px] font-bold uppercase tracking-wide flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Abierto
              </span>
              <span className="text-white font-medium text-xs uppercase tracking-wide">
                {business.name}
              </span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Navigation */}
          <nav className="flex-none flex items-center gap-1">
            <button
              onClick={() => onViewChange('catalog')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                view === 'catalog' ? 'bg-white text-[#0A1628]' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onViewChange('contact')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                view === 'contact' ? 'bg-white text-[#0A1628]' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Contacto
            </button>
          </nav>
        </div>
      </section>

      {mounted && cartMode && count > 0 && (
        <button
          data-cart-button
          onClick={openCart}
          className="fixed top-16 right-3 z-40 h-12 w-12 rounded-full bg-[#0A1628] text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          style={{ left: 'auto' }}
          aria-label={`Carrito con ${count} items`}
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E5533C] text-white text-[10px] font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1 ring-2 ring-white">
              {count}
            </span>
          )}
        </button>
      )}
    </>
  )
}
