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
    <section id={`c-${category.slug}`} className="scroll-mt-16 mb-2">
      <div className="px-4 pt-2 pb-2">
        <h2 className="category-label line-clamp-1 text-[#0A1628] text-lg font-bold">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
            {category.description}
          </p>
        )}
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
          <span>{products.length} elementos</span>
        </div>
      </div>
      {products.length > 0 ? (
        <div className="px-4 grid grid-cols-2 gap-x-3 gap-y-1">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} config={config} />
          ))}
        </div>
      ) : (
        <div className="mx-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-400">
          Próximamente más modelos en esta categoría
        </div>
      )}
    </section>
  )
}
