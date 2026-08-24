import { business, whatsappNumber } from '@/lib/catalog-data'
import { blurData } from '@/lib/blurhash'
import { Star, MapPin, Clock, Truck, Store, MessageCircle, Phone } from 'lucide-react'

export function SiteHeader() {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, quisiera información sobre las gafas.`
  )}`

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DCC8]">
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="flex items-center gap-3 py-2.5 sm:py-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={business.logoSmall}
              alt={business.name}
              width={44}
              height={44}
              loading="eager"
              fetchPriority="high"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-[#E5533C]/30"
              style={{
                backgroundColor: '#EFE6D6',
                backgroundImage: `url(${blurData(business.blurKeyLogo)})`,
                backgroundSize: 'cover',
              }}
            />
          </div>

          {/* Name + rating */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-[#2A1A14] text-sm sm:text-base truncate">
                {business.name}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-[#8A6F5A] bg-[#FFF1E0] px-1.5 py-0.5 rounded-full">
                <Star className="h-2.5 w-2.5 fill-[#D97706] text-[#D97706]" />
                {business.rating.toFixed(1)}
              </span>
              <span className="hidden md:inline text-[10px] font-semibold text-[#8A6F5A]">
                ({business.ratingCount} reseña)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#8A6F5A] mt-0.5">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{business.county}</span>
              <span className="text-[#D4C5B0]">·</span>
              <span className="font-bold text-[#2A1A14]">{business.currency}</span>
              <span className="text-[#D4C5B0]">·</span>
              <span>{business.priceRange}</span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1FB855] active:scale-95 transition-all text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Pedir ahora</span>
            <span className="sm:hidden">Pedir</span>
          </a>
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-2 pb-2 sm:pb-2.5 overflow-x-auto no-scrollbar -mx-1 px-1">
          <StatusChip icon="delivery" active={business.delivery} label="Domicilio" sublabel="Disponible ahora" />
          <StatusChip icon="pickup" active={business.pickup} label="Recogida" sublabel="Disponible ahora" />
          <StatusChip
            icon="clock"
            active
            label="Horario"
            sublabel="Abierto · cerrado 12–3pm"
          />
          <a
            href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white border border-[#E8DCC8] text-[#2A1A14] text-[10px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-full"
          >
            <Phone className="h-3 w-3 text-[#E5533C]" />
            {business.phone}
          </a>
        </div>
      </div>
    </header>
  )
}

function StatusChip({
  icon,
  active,
  label,
  sublabel,
}: {
  icon: 'delivery' | 'pickup' | 'clock'
  active: boolean
  label: string
  sublabel: string
}) {
  const Icon = icon === 'delivery' ? Truck : icon === 'pickup' ? Store : Clock
  return (
    <div className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white border border-[#E8DCC8] text-[#2A1A14] text-[10px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-full">
      <Icon className="h-3 w-3 text-[#E5533C]" />
      <span className="font-bold">{label}</span>
      <span className="hidden sm:inline text-[#8A6F5A] font-normal">·</span>
      <span className="hidden sm:inline text-[#8A6F5A] font-normal">{sublabel}</span>
      {active && (
        <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#22C55E] ring-2 ring-[#22C55E]/20" />
      )}
    </div>
  )
}
