import { business, whatsappNumber } from '@/lib/catalog-data'
import { MapPin, Clock, Truck, Store, Phone, MessageCircle, Mail, Facebook, Instagram, Send, Youtube, Globe } from 'lucide-react'

export function SiteFooter() {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, quisiera hacer un pedido.`
  )}`

  return (
    <footer className="mt-auto bg-[#1F1812] text-[#FAF7F2]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Business info */}
          <div>
            <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#E5533C] rounded-full" />
              {business.name}
            </h3>
            <div className="space-y-2.5 text-sm text-[#D4C5B0]">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#E5533C]" />
                <span>{business.address}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#E5533C]" />
                <span>{business.scheduleNote}</span>
              </p>
              <p className="flex items-start gap-2">
                <Truck className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#E5533C]" />
                <span>{business.deliveryNote}</span>
              </p>
            </div>
          </div>

          {/* Service modes */}
          <div>
            <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#E5533C] rounded-full" />
              Servicio
            </h3>
            <ul className="space-y-2 text-sm text-[#D4C5B0]">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#22C55E]" />
                Entregamos a domicilio
              </li>
              <li className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#22C55E]" />
                Recogida disponible
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FFD23F]" />
                Cerramos de 12 del mediodía a 3 pm
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#FFD23F]" />
                Aceptamos moneda nacional al cambio
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#E5533C] rounded-full" />
              Contactos
            </h3>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-[#E5533C]" />
                {business.phone}
              </a>
              <a
                href={`tel:${business.phone2.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-[#E5533C]" />
                {business.phone2}
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1FB855] transition-colors text-white font-bold px-3 py-2 rounded-full mt-2"
              >
                <MessageCircle className="h-4 w-4" />
                Pedir por WhatsApp
              </a>
            </div>
            {/* Social row */}
            <div className="flex items-center gap-2 mt-4">
              <SocialIcon icon="facebook" />
              <SocialIcon icon="instagram" />
              <SocialIcon icon="telegram" />
              <SocialIcon icon="youtube" />
              <SocialIcon icon="mail" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs text-[#8A7A6A]">
          <p>© {new Date().getFullYear()} {business.name} · Catálogo digital</p>
          <span className="hidden sm:inline text-[#5A4A3A]">·</span>
          <p className="text-[#6A5A4A]">Hecho con cariño en La Habana, Cuba</p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon }: { icon: 'facebook' | 'instagram' | 'telegram' | 'youtube' | 'mail' }) {
  const Icon =
    icon === 'facebook' ? Facebook :
    icon === 'instagram' ? Instagram :
    icon === 'telegram' ? Send :
    icon === 'youtube' ? Youtube :
    Mail
  return (
    <span
      className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/5 text-[#D4C5B0]"
      aria-label={icon}
      role="img"
    >
      <Icon className="h-4 w-4" />
    </span>
  )
}
