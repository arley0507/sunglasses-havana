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
      {/* Category header — clean like elyerromenu */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[#0A1628] text-lg font-bold tracking-tight">
          {category.name}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">{products.length} elementos</p>
      </div>
      {/* Product grid */}
      {products.length > 0 ? (
        <div className="px-4 grid grid-cols-2 gap-x-3 gap-y-2 pb-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} config={config} />
          ))}
        </div>
      ) : (
        <div className="mx-4 my-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-400">
          Próximamente más modelos
        </div>
      )}
      {/* Separator line between categories */}
      <div className="h-2 bg-gray-50" />
    </section>
  )
}
