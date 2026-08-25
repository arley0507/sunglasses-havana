'use client'

import { useState } from 'react'
import type { CatalogProduct } from '@/lib/catalog-data'
import { OrderModal } from './OrderModal'
import type { SiteConfig } from '@/lib/types'

export function ProductCard({ product, config }: { product: CatalogProduct; config?: SiteConfig | null }) {
  const [orderOpen, setOrderOpen] = useState(false)
  const [showDesc, setShowDesc] = useState(false)

  return (
    <>
      <div className="mb-3">
        <button onClick={() => setOrderOpen(true)} className="block w-full text-left relative" aria-label={`Pedir ${product.name}`}>
          <div className="rounded-lg bg-gray-100 w-full relative overflow-hidden border border-gray-100" style={{ paddingTop: '100%' }}>
            <img src={product.imageSmall} alt={product.name} loading="lazy" decoding="async"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover" />
            {product.note && (
              <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex items-end transition-opacity duration-300 ${showDesc ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white text-xs leading-snug">{product.note}</p>
              </div>
            )}
            {product.trending && <span className="absolute top-1.5 left-1.5 z-10 inline-flex items-center bg-blue-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Popular</span>}
          </div>
        </button>
        <button onClick={() => setOrderOpen(true)} className="block w-full text-left mt-1.5 overflow-hidden min-h-[2.5em]">
          <div className="line-clamp-2 text-[#0A1628] font-semibold text-xs leading-tight">{product.name}</div>
        </button>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[#0A1628] font-bold text-sm">{product.price.toFixed(2)} <span className="text-xs font-medium text-gray-500">USD</span></span>
          {product.note && <button onClick={() => setShowDesc(!showDesc)} className="text-blue-500 text-[10px] font-semibold hover:underline">{showDesc ? 'Ocultar' : 'Info'}</button>}
        </div>
        <button onClick={() => setOrderOpen(true)} className="mt-1.5 w-full inline-flex items-center justify-center bg-[#0A1628] hover:bg-[#1a3a6a] active:scale-95 transition-all text-white text-[11px] font-bold py-1.5 rounded-full">Pedir</button>
      </div>
      {orderOpen && <OrderModal product={product} config={config} onClose={() => setOrderOpen(false)} />}
    </>
  )
}
