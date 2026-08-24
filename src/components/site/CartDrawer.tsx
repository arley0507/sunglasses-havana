'use client'

import { useEffect, useState, useMemo } from 'react'
import { X, Trash2, Plus, Minus, Send, MapPin, ChevronDown, ShoppingBag, MessageSquare } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { useBackButtonModal } from '@/lib/use-back-button'
import { imageUrl } from '@/lib/image-url'
import type { Municipality, SiteConfig } from '@/lib/types'

const fmtPrice = (n: number) => `$${n.toFixed(2)} USD`
const fmtCUP = (n: number) => `$${Math.round(n)} CUP`

type Config = Pick<SiteConfig, 'whatsappNumber' | 'phoneDisplay' | 'businessName' | 'cartMessageTemplate'> | null

export function CartDrawer({ config }: { config: Config }) {
  const [mounted, setMounted] = useState(false)
  const isOpen = useCart(s => s.isOpen)
  const closeCart = useCart(s => s.closeCart)
  const items = useCart(s => s.items)
  const removeItem = useCart(s => s.removeItem)
  const updateQty = useCart(s => s.updateQty)
  const clearCart = useCart(s => s.clearCart)
  const disableCartMode = useCart(s => s.disableCartMode)

  useEffect(() => setMounted(true), [])
  useBackButtonModal(isOpen, closeCart)

  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [municipalityId, setMunicipalityId] = useState('')
  const [neighborhoodId, setNeighborhoodId] = useState('')
  const [streets, setStreets] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && municipalities.length === 0) {
      fetch('/api/municipalities').then(r => r.json()).then(d => { setMunicipalities(d.municipalities || []); setLoading(false) }).catch(() => setLoading(false))
    }
  }, [isOpen, municipalities.length])

  const selectedMunicipality = municipalities.find(m => m.id === municipalityId)
  const selectedNeighborhood = selectedMunicipality?.neighborhoods?.find(n => n.id === neighborhoodId) || null
  const deliveryPrice = selectedNeighborhood?.price ?? 0

  const subtotal = useMemo(() => items.reduce((s, it) => { const a = it.addons.reduce((x, y) => x + y.price, 0); return s + (it.price + a) * it.qty }, 0), [items])
  const total = subtotal + deliveryPrice
  const whatsapp = config?.whatsappNumber || '5363185747'

  const sendOrder = (method: 'whatsapp' | 'sms') => {
    if (!municipalityId || !neighborhoodId) { alert('Selecciona municipio y barrio'); return }
    if (!streets.trim()) { alert('Ingresa las calles'); return }
    if (items.length === 0) return
    let msg = `Pedido múltiple - ${config?.businessName || 'Sunglasses Havana'}\n\n${items.length} producto(s):\n\n`
    items.forEach((it, i) => { const a = it.addons.reduce((x, y) => x + y.price, 0); msg += `${i+1}. ${it.name}\n   Cantidad: ${it.qty}\n   Subtotal: ${fmtPrice((it.price + a) * it.qty)}\n\n` })
    msg += `Subtotal: ${fmtPrice(subtotal)}\nMensajería: ${fmtCUP(deliveryPrice)}\nTotal: ${fmtPrice(subtotal)} + ${fmtCUP(deliveryPrice)}\n\nDirección:\n${selectedNeighborhood!.name}, ${selectedMunicipality!.name} - ${streets.trim()}`
    const text = encodeURIComponent(msg)
    if (method === 'whatsapp') window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank')
    else { const p = config?.phoneDisplay || ''; window.open(`sms:${p.replace(/[^\d+]/g,'')}?body=${text}`, '_blank') }
    clearCart(); closeCart(); disableCartMode()
  }

  if (!mounted || !isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={closeCart} aria-hidden />
      <div className="fixed top-16 right-1 left-1 sm:left-auto sm:w-[460px] z-50 max-h-[88vh] flex flex-col bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden"
        style={{ transformOrigin: 'top right', animation: 'cart-pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0A1628] to-[#1a3a6a] text-white flex-shrink-0">
          <div className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-blue-300" /><h2 className="text-base font-bold">Tu carrito</h2>
            {items.length > 0 && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">{items.reduce((s, it) => s + it.qty, 0)}</span>}</div>
          <button onClick={closeCart} className="p-1 rounded-full hover:bg-white/20 transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-blue-50/50 min-h-0">
          {items.length === 0 ? (
            <div className="text-center py-12"><ShoppingBag className="h-10 w-10 mx-auto text-blue-200 mb-2" /><p className="text-blue-900 text-sm font-semibold">Tu carrito está vacío</p><p className="text-blue-400 text-xs mt-1">Agrega productos desde el catálogo</p></div>
          ) : items.map((it, index) => {
            const a = it.addons.reduce((s, x) => s + x.price, 0); const up = it.price + a
            return (
              <div key={index} className="bg-white rounded-xl border border-blue-100 p-2.5 flex gap-2.5 shadow-sm">
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-blue-50 flex-shrink-0">{it.imageUrl && <img src={imageUrl(it.imageUrl)} alt={it.name} className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#0A1628] text-xs leading-tight line-clamp-1">{it.name}</h4>
                  {it.addons.length > 0 && <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">+ {it.addons.map(a => a.name).join(', ')}</p>}
                  <p className="text-black font-bold text-xs mt-0.5">{fmtPrice(up * it.qty)}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="inline-flex items-center gap-1 bg-blue-50 rounded-full px-0.5 py-0.5">
                      <button onClick={() => updateQty(index, Math.max(1, it.qty - 1))} disabled={it.qty <= 1} className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-white border border-blue-200 text-[#0A1628] hover:bg-blue-50 disabled:opacity-40"><Minus className="h-2.5 w-2.5" /></button>
                      <span className="w-5 text-center font-bold text-xs text-[#0A1628]">{it.qty}</span>
                      <button onClick={() => updateQty(index, it.qty + 1)} className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-white border border-blue-200 text-[#0A1628] hover:bg-blue-50"><Plus className="h-2.5 w-2.5" /></button>
                    </div>
                    <button onClick={() => removeItem(index)} className="h-6 w-6 inline-flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {items.length > 0 && (
          <div className="border-t border-blue-100 bg-white p-3 space-y-2 flex-shrink-0 max-h-[45%] overflow-y-auto custom-scrollbar">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A1628]"><MapPin className="h-3.5 w-3.5 text-blue-600" /> Dirección de entrega</div>
              <div className="relative"><select value={municipalityId} onChange={e => { setMunicipalityId(e.target.value); setNeighborhoodId('') }} disabled={loading} className="w-full h-8 pl-2 pr-7 rounded-lg border border-blue-200 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/30 disabled:opacity-50">
                <option value="">{loading ? 'Cargando...' : 'Selecciona municipio'}</option>
                {municipalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-400 pointer-events-none" /></div>
              <div className="relative"><select value={neighborhoodId} onChange={e => setNeighborhoodId(e.target.value)} disabled={!municipalityId} className="w-full h-8 pl-2 pr-7 rounded-lg border border-blue-200 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/30 disabled:opacity-50">
                <option value="">{!municipalityId ? 'Primero el municipio' : 'Selecciona barrio'}</option>
                {selectedMunicipality?.neighborhoods?.map(n => <option key={n.id} value={n.id}>{n.name} — {n.price ? fmtCUP(n.price) : 'Gratis'}</option>)}
              </select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-400 pointer-events-none" /></div>
              <input value={streets} onChange={e => setStreets(e.target.value)} placeholder="Calle, número, apartamento..." disabled={!neighborhoodId} className="w-full h-8 px-2 rounded-lg border border-blue-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/30 disabled:opacity-50" />
            </div>
            <div className="space-y-0.5 pt-1.5 border-t border-blue-100">
              <div className="flex justify-between text-xs"><span className="text-gray-600">Subtotal</span><span className="font-semibold text-[#0A1628]">{fmtPrice(subtotal)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-600">Mensajería</span><span className="font-semibold text-[#0A1628]">{selectedNeighborhood ? fmtCUP(deliveryPrice) : '—'}</span></div>
              <div className="flex justify-between pt-0.5"><span className="font-bold text-[#0A1628] text-sm">Total</span><span className="font-extrabold text-black text-base">{selectedNeighborhood ? `${fmtPrice(subtotal)} + ${fmtCUP(deliveryPrice)}` : fmtPrice(subtotal)}</span></div>
            </div>
            <button onClick={() => sendOrder('whatsapp')} className="w-full bg-[#25D366] hover:bg-[#1FB855] text-white h-9 rounded-lg font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs"><Send className="h-3.5 w-3.5" /> WhatsApp</button>
            <button onClick={() => sendOrder('sms')} className="w-full bg-white border border-gray-800 text-black hover:bg-gray-50 h-9 rounded-lg font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs"><MessageSquare className="h-3.5 w-3.5" /> SMS</button>
          </div>
        )}
      </div>
    </>
  )
}
