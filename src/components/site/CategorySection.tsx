import type { CatalogCategory, CatalogProduct } from '@/lib/catalog-data'
import { ProductCard } from './ProductCard'
import type { SiteConfig } from '@/lib/types'

export function CategorySection({
  category,
  products,
  config,
}: {
  category: CatalogCategory
  products: CatalogProduct[]
  config?: SiteConfig | null
}) {
  return (
    <section id={`c-${category.slug}`} className="scroll-mt-16">
      {/* Category header with visual emphasis */}
      <div className="px-4 pt-4 pb-2 bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-[#0A1628] ml-0">
        <h2 className="category-label line-clamp-1 text-[#0A1628] text-lg font-extrabold tracking-tight">
          {category.name}
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          {category.description && (
            <p className="text-xs text-gray-500 line-clamp-1 flex-1">
              {category.description}
            </p>
          )}
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
            {products.length} productos
          </span>
        </div>
      </div>
      {/* Product grid */}
      {products.length > 0 ? (
        <div className="px-4 grid grid-cols-2 gap-x-3 gap-y-2 pt-2 pb-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} config={config} />
          ))}
        </div>
      ) : (
        <div className="mx-4 my-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-400">
          Próximamente más modelos
        </div>
      )}
      {/* Separator between categories */}
      <div className="h-px bg-gray-100 mx-4" />
    </section>
  )
}
