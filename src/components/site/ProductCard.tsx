'use client'

import { useState } from 'react'
import type { CatalogProduct } from '@/lib/catalog-data'
import { whatsappNumber } from '@/lib/catalog-data'
import { blurData } from '@/lib/blurhash'
import { Flame, MessageCircle, Plus } from 'lucide-react'

export function ProductCard({ product }: { product: CatalogProduct }) {
  const [loaded, setLoaded] = useState(false)

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola, quisiera pedir: ${product.name} (${product.price.toFixed(2)} USD). ¿Está disponible?`
  )}`

  return (
    <article className="group bg-white rounded-2xl border border-[#E8DCC8] shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all">
      {/* Image */}
      <div className="relative aspect-square bg-[#F4ECDD] overflow-hidden">
        <img
          src={product.imageSmall}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-105 transition-transform`}
          style={{
            backgroundColor: '#F4ECDD',
            backgroundImage: loaded ? undefined : `url(${blurData(product.blurKey)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {product.trending && (
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[#E5533C] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
            <Flame className="h-3 w-3 fill-current" /> Popular
          </div>
        )}
        <div className="absolute top-2 right-2 inline-flex items-center justify-center bg-white/95 backdrop-blur-sm text-[#2A1A14] text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          ${product.price.toFixed(2)} <span className="text-[#8A6F5A] font-semibold ml-0.5">USD</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#2A1A14] text-sm sm:text-base leading-tight line-clamp-2 min-h-[2.4em]">
          {product.name}
        </h3>
        {product.note && (
          <p className="text-[#8A6F5A] mt-1 text-[11px] sm:text-xs line-clamp-2 leading-snug min-h-[2.6em]">
            {product.note}
          </p>
        )}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-2.5"
          aria-label={`Pedir ${product.name} por WhatsApp`}
        >
          <span className="w-full inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1FB855] active:scale-95 transition-all text-white text-xs sm:text-sm font-bold py-2 rounded-full">
            <MessageCircle className="h-3.5 w-3.5" />
            Pedir por WhatsApp
          </span>
        </a>
      </div>
    </article>
  )
}
