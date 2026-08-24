import type { CatalogCategory, CatalogProduct } from '@/lib/catalog-data'
import { whatsappNumber } from '@/lib/catalog-data'
import { blurData } from '@/lib/blurhash'
import { Package, MessageCircle, ArrowRight } from 'lucide-react'
import { ProductCard } from './ProductCard'

export function CategorySection({
  category,
  products,
}: {
  category: CatalogCategory
  products: CatalogProduct[]
}) {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola, quisiera ver el catálogo completo de "${category.name}". ¿Qué modelos tienen disponibles?`
  )}`

  return (
    <section id={`c-${category.slug}`} className="scroll-mt-32">
      {/* Banner */}
      <div className="relative w-full h-32 sm:h-40 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-[#F4ECDD]">
        <img
          src={category.image}
          alt={category.name}
          width={1200}
          height={400}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundColor: '#F4ECDD',
            backgroundImage: `url(${blurData(category.blurKey)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F1812]/85 via-[#1F1812]/55 to-[#1F1812]/15" />
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center text-white">
          <h2 className="text-lg sm:text-2xl font-extrabold drop-shadow-sm">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-xs sm:text-sm text-white/90 line-clamp-2 max-w-md drop-shadow-sm mt-1">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-xs font-bold flex-wrap">
            <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Package className="h-3 w-3" />
              {products.length > 0
                ? `${products.length} / ${category.count} elementos`
                : `${category.count} elementos disponibles`}
            </span>
            {category.price > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#E5533C] px-2 py-0.5 rounded-full">
                desde ${category.price} USD
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product grid or empty state */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pb-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#E8DCC8] bg-white/60 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0 h-14 w-14 rounded-full bg-[#FFF1E0] flex items-center justify-center">
            <MessageCircle className="h-7 w-7 text-[#E5533C]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-[#2A1A14] text-sm sm:text-base">
              Catálogo completo bajo pedido
            </p>
            <p className="text-xs sm:text-sm text-[#8A6F5A] mt-0.5">
              Tenemos {category.count} modelos en esta categoría. Escríbenos por WhatsApp
              para enviarte fotos actualizadas y disponibilidad.
            </p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1FB855] active:scale-95 transition-all text-white text-sm font-bold px-4 py-2.5 rounded-full"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </section>
  )
}
