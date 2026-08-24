'use client'

import { Phone, Clock, MessageCircle, Instagram, Facebook, MapPin, Navigation, Send, MessageSquare } from 'lucide-react'
import { business as staticBusiness } from '@/lib/catalog-data'
import type { SiteConfig } from '@/lib/types'

export function ContactView({ config }: { config: SiteConfig | null }) {
  const phone = config?.phoneDisplay || staticBusiness.phone
  const address = config?.contactAddress || staticBusiness.address
  const hours = (config?.contactHours || staticBusiness.scheduleNote).split('\n').filter(Boolean)
  const whatsapp = config?.whatsappNumber || '5363185747'
  const instagram = config?.instagramUrl || ''
  const facebook = config?.facebookUrl || ''
  const businessName = config?.businessName || staticBusiness.name
  const mapLat = config?.mapLat ?? 23.127889
  const mapLng = config?.mapLng ?? -82.371722
  const mapZoom = config?.mapZoom ?? 14
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.01}%2C${mapLat - 0.01}%2C${mapLng + 0.01}%2C${mapLat + 0.01}&layer=mapnik&marker=${mapLat}%2C${mapLng}&zoom=${mapZoom}`
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const waLink = `https://wa.me/${whatsapp}`
  const smsLink = `sms:${cleanPhone}?body=${encodeURIComponent(`Hola ${businessName}, quisiera información.`)}`

  return (
    <div className="px-4 py-6 space-y-4 bg-gray-50">
      <div className="text-center mb-4"><h2 className="text-2xl font-bold text-[#0A1628]">Contáctanos</h2><p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">Haz tu pedido por WhatsApp o SMS.</p></div>
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0"><MessageCircle className="h-5 w-5 text-green-600" /></div>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-[#0A1628] text-base">Pide por WhatsApp</h3><p className="text-sm text-gray-500">La forma más rápida</p></div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-full"><Send className="h-3.5 w-3.5" /> Abrir</a>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><MessageSquare className="h-5 w-5 text-[#0A1628]" /></div>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-[#0A1628] text-base">Escribe por SMS</h3><p className="text-sm text-gray-500">{phone}</p></div>
          <a href={smsLink} className="inline-flex items-center gap-1.5 bg-[#0A1628] hover:bg-[#1a2a4a] text-white text-sm font-bold px-4 py-2.5 rounded-full"><MessageSquare className="h-3.5 w-3.5" /> SMS</a>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0"><Phone className="h-5 w-5 text-amber-600" /></div>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-[#0A1628] text-base">Llámanos</h3><p className="text-sm text-gray-500">{phone}</p></div>
          <a href={`tel:${cleanPhone}`} className="inline-flex items-center gap-1.5 bg-white border-2 border-[#0A1628] text-[#0A1628] hover:bg-gray-50 text-sm font-bold px-4 py-2.5 rounded-full"><Phone className="h-3.5 w-3.5" /> Llamar</a>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0"><Clock className="h-5 w-5 text-orange-600" /></div>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-[#0A1628] text-base">Horarios</h3><ul className="text-sm text-gray-500 mt-1 space-y-0.5">{hours.map((h, i) => <li key={i}>{h}</li>)}</ul></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2"><MapPin className="h-4 w-4 text-[#0A1628]" /><h3 className="text-sm font-bold text-[#0A1628]">Ubicación del local</h3></div>
        <div className="relative aspect-video bg-white overflow-hidden"><iframe src={mapEmbedUrl} className="w-full h-full border-0 absolute" style={{ height: 'calc(100% + 30px)', top: '-15px' }} loading="lazy" title="Mapa" /><div className="absolute bottom-0 left-0 right-0 h-6 bg-white pointer-events-none" /></div>
      </div>
      <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2a4a] rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3"><div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><MapPin className="h-5 w-5 text-blue-300" /></div><div className="flex-1"><h3 className="font-bold text-base">¿Dónde estamos?</h3><p className="text-white/80 text-sm mt-1">{address}</p></div></div>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-full"><Navigation className="h-4 w-4" /> Cómo llegar</a>
      </div>
      {(instagram || facebook) && (
        <div className="flex flex-col items-center gap-2 pt-2"><p className="text-sm text-gray-500">Síguenos en redes:</p><div className="flex gap-2">
          {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#0A1628] text-[#0A1628] text-sm font-semibold px-4 py-2 rounded-full"><Instagram className="h-4 w-4" /> Instagram</a>}
          {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#0A1628] text-[#0A1628] text-sm font-semibold px-4 py-2 rounded-full"><Facebook className="h-4 w-4" /> Facebook</a>}
        </div></div>
      )}
      <p className="text-center text-xs text-gray-400 pt-2 pb-4">{businessName} · Catálogo digital</p>
    </div>
  )
}
