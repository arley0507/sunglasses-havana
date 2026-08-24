import { business as staticBusiness } from '@/lib/catalog-data'
import type { SiteConfig } from '@/lib/types'
import { Phone, MessageCircle, MessageSquare, MapPin, Clock, Truck, Store, Instagram, Facebook } from 'lucide-react'

export function SiteFooter({ config }: { config: SiteConfig | null }) {
  const biz = {
    name: config?.businessName || staticBusiness.name,
    phone: config?.phoneDisplay || staticBusiness.phone,
    whatsappNumber: config?.whatsappNumber || '5363185747',
    address: config?.contactAddress || staticBusiness.address,
    hours: config?.contactHours || staticBusiness.scheduleNote,
    instagramUrl: config?.instagramUrl || '',
    facebookUrl: config?.facebookUrl || '',
  }
  const footerColor = config?.footerColor || '#0A1628'
  const cleanPhone = biz.phone.replace(/[^\d+]/g, '')

  const waLink = `https://wa.me/${biz.whatsappNumber}?text=${encodeURIComponent(`Hola ${biz.name}, quisiera hacer un pedido.`)}`
  const smsLink = `sms:${cleanPhone}?body=${encodeURIComponent(`Hola ${biz.name}, quisiera hacer un pedido.`)}`

  return (
    <footer className="flex-1 flex flex-col justify-end text-white" style={{ backgroundColor: footerColor }}>
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-3">{biz.name}</h2>
        <div className="space-y-2 text-sm text-white/80 mb-4">
          <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" /><span>{biz.address}</span></p>
          <p className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" /><span>{biz.hours}</span></p>
          <p className="flex items-start gap-2"><Truck className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" /><span>Entregamos a domicilio</span></p>
          <p className="flex items-start gap-2"><Store className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-300" /><span>Recogida disponible</span></p>
        </div>
        <div className="border-t border-white/10 pt-4">
          <h3 className="font-bold text-sm mb-3 text-white/95">Contactos</h3>
          <div className="space-y-2 text-sm">
            <a href={`tel:${cleanPhone}`} className="flex items-center gap-2 text-white/80 hover:text-white font-semibold"><Phone className="h-4 w-4 text-blue-300" />{biz.phone}</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-300 hover:text-green-200 font-semibold"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            <a href={smsLink} className="flex items-center gap-2 text-blue-300 hover:text-blue-200 font-semibold"><MessageSquare className="h-4 w-4" />SMS Móvil</a>
          </div>
          {(biz.instagramUrl || biz.facebookUrl) && (
            <div className="flex items-center gap-3 mt-4">
              {biz.instagramUrl && <a href={biz.instagramUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-blue-500 transition-colors"><Instagram className="h-4 w-4" /></a>}
              {biz.facebookUrl && <a href={biz.facebookUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-blue-500 transition-colors"><Facebook className="h-4 w-4" /></a>}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 border-t border-white/10 text-center">
        <p className="text-xs text-white/60">©{new Date().getFullYear()} {biz.name} · Catálogo digital</p>
        <p className="text-xs text-white/40 mt-1">Hecho con cariño en La Habana, Cuba</p>
      </div>
    </footer>
  )
}
