import { business } from '@/lib/catalog-data'
import { blurData } from '@/lib/blurhash'
import { MapPin, Star } from 'lucide-react'

export function CoverHero() {
  return (
    <section className="relative">
      {/* Cover image */}
      <div className="relative w-full h-[42vh] min-h-[260px] max-h-[420px] overflow-hidden">
        <img
          src={business.coverMedium}
          alt={`${business.name} — portada`}
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundColor: '#1F1812',
            backgroundImage: `url(${blurData(business.blurKeyCover)})`,
            backgroundSize: 'cover',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1812]/85 via-[#1F1812]/35 to-[#1F1812]/15" />

        {/* Cover content */}
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="mx-auto max-w-6xl text-white">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-[#E5533C] text-white px-2 py-1 rounded-full uppercase tracking-wide">
                    Catálogo Digital
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold bg-white/15 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-[#FFD23F] text-[#FFD23F]" />
                    {business.rating.toFixed(1)}
                    <span className="opacity-70">({business.ratingCount})</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight drop-shadow-lg">
                  {business.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-white/90">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{business.county}</span>
                  <span className="opacity-50">·</span>
                  <span className="font-semibold">{business.currency} {business.priceRange}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
