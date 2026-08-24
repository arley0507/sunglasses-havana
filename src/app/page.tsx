import { categories, products } from '@/lib/catalog-data'
import { SiteHeader } from '@/components/site/SiteHeader'
import { CoverHero } from '@/components/site/CoverHero'
import { CategoryNav } from '@/components/site/CategoryNav'
import { CategorySection } from '@/components/site/CategorySection'
import { SiteFooter } from '@/components/site/SiteFooter'

export default function Home() {
  // Group products by category
  const productsByCategory = new Map<string, typeof products>()
  for (const p of products) {
    const list = productsByCategory.get(p.categoryId) ?? []
    list.push(p)
    productsByCategory.set(p.categoryId, list)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <SiteHeader />
      <CoverHero />
      <CategoryNav />

      {/* Catalog */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-3 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2A1A14]">
            Gafas de sol y ópticas en La Habana
          </h2>
          <p className="text-sm sm:text-base text-[#8A6F5A] mt-2">
            Catálogo completo de gafas para miopía fotocromáticas, gafas deportivas y de cerca.
            Aceptamos moneda nacional al cambio. Domicilio y recogida disponibles.
          </p>
        </section>

        {/* Category sections */}
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            products={productsByCategory.get(category.id) ?? []}
          />
        ))}

        {/* Contact CTA */}
        <section className="bg-gradient-to-br from-[#2A1A14] via-[#3A2A1E] to-[#2A1A14] rounded-3xl p-6 sm:p-10 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-sm text-white/80 max-w-md mx-auto mb-4">
            Contáctanos por WhatsApp y te ayudamos a encontrar las gafas ideales para ti.
            Manejamos pedidos por encargo.
          </p>
          <a
            href={`https://wa.me/5363185747?text=${encodeURIComponent(
              'Hola Sunglasses Havana, quisiera más información sobre sus gafas.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1FB855] transition-colors text-white font-bold px-6 py-3 rounded-full"
          >
            Contáctanos
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
