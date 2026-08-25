'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, Send, MapPin, ChevronDown, ShoppingBag, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/cart-store'
import { useBackButtonModal } from '@/lib/use-back-button'
import { imageUrl } from '@/lib/image-url'
import { flyToCart } from '@/lib/fly-animation'
import { toast } from 'sonner'
import type { CatalogProduct } from '@/lib/catalog-data'
import { whatsappNumber } from '@/lib/catalog-data'
import type { SiteConfig, Municipality } from '@/lib/types'

const fmtPrice = (n: number) => `$${n.toFixed(2)} USD`
const fmtCUP = (n: number) => `$${Math.round(n)} CUP`

export function OrderModal({ product, config, onClose }: { product: CatalogProduct; config: SiteConfig | null; onClose: () => void }) {
  useBackButtonModal(true, onClose)
  const [qty, setQty] = useState(1)
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [municipalityId, setMunicipalityId] = useState('')
  const [neighborhoodId, setNeighborhoodId] = useState('')
  const [streets, setStreets] = useState('')
  const [zonesLoading, setZonesLoading] = useState(true)
  const cartMode = useCart(s => s.cartMode)
  const enableCartMode = useCart(s => s.enableCartMode)
  const addItemToCart = useCart(s => s.addItem)
  const productImageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    fetch('/api/municipalities').then(r => r.json()).then(d => { setMunicipalities(d.municipalities || []); setZonesLoading(false) }).catch(() => setZonesLoading(false))
  }, [])

  const selectedMunicipality = municipalities.find(m => m.id === municipalityId)
  const selectedNeighborhood = selectedMunicipality?.neighborhoods?.find(n => n.id === neighborhoodId) || null
  const deliveryPrice = selectedNeighborhood?.price ?? 0
  const subtotal = product.price * qty
  const whatsapp = config?.whatsappNumber || whatsappNumber

  const buildMessage = () => {
    const fullAddress = `${selectedNeighborhood!.name}, ${selectedMunicipality!.name} — ${streets.trim()}`
    return `*Nuevo pedido - ${config?.businessName || 'Sunglasses Havana'}*\n\n*Producto:* ${product.name}\n*Cantidad:* ${qty}\n*Precio unitario:* ${fmtPrice(product.price)}\n*Total:* ${selectedNeighborhood ? `${fmtPrice(subtotal)} + ${fmtCUP(deliveryPrice)}` : fmtPrice(subtotal)}\n\n*Dirección:* ${fullAddress}`
  }

  const submit = (method: 'whatsapp' | 'sms') => {
    if (!municipalityId || !neighborhoodId) { toast.error('Selecciona municipio y barrio'); return }
    if (!streets.trim()) { toast.error('Ingresa las calles'); return }
    const text = encodeURIComponent(buildMessage())
    if (method === 'whatsapp') { window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank'); toast.success('Pedido enviado por WhatsApp') }
    else { const p = config?.phoneDisplay || ''; window.open(`sms:${p.replace(/[^\d+]/g,'')}?body=${text}`, '_blank'); toast.success('Abriendo mensajes...') }
    onClose()
  }

  const addToCart = () => {
    const cartItem = { productId: product.id, slug: product.slug, name: product.name, description: product.note, note: product.note, price: product.price, imageUrl: product.imageSmall, qty, addons: [] as any[] }
    const imgEl = productImageRef.current || document.querySelector('[data-modal-product-image]') as HTMLElement | null
    const cartBtn = document.querySelector('[data-cart-button]') as HTMLElement | null
    if (imgEl && cartBtn) {
      flyToCart(imgEl, cartBtn, () => {
        addItemToCart(cartItem, qty)
        toast.success(`${product.name} agregado al carrito`, { duration: 2000 })
        onClose()
      })
    } else {
      addItemToCart(cartItem, qty)
      toast.success(`${product.name} agregado al carrito`, { duration: 2000 })
      onClose()
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-4 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl bg-white border-2 border-blue-100 gap-3">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 p-0">
          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-blue-50 flex-shrink-0">
            <img ref={productImageRef} data-modal-product-image src={imageUrl(product.imageSmall)} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm font-bold leading-tight text-[#0A1628] line-clamp-2">{product.name}</DialogTitle>
            {product.note && <p className="text-gray-600 text-xs mt-1 line-clamp-3">{product.note}</p>}
            <p className="text-black font-extrabold text-base whitespace-nowrap mt-1">{product.price.toFixed(2)} <span className="text-xs font-semibold">USD</span></p>
          </div>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#0A1628]">Cantidad</label>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 rounded-full p-0.5">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-blue-200 text-[#0A1628] disabled:opacity-40 hover:bg-blue-100 active:scale-95"><Minus className="h-3.5 w-3.5" /></button>
            <span className="w-8 text-center font-bold text-base text-[#0A1628]">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-blue-200 text-[#0A1628] hover:bg-blue-100 active:scale-95"><Plus className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        {!cartMode && (
          <div className="space-y-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#0A1628]"><MapPin className="h-4 w-4 text-blue-600" /> Dirección de entrega</div>
            <div className="relative"><select value={municipalityId} onChange={e => { setMunicipalityId(e.target.value); setNeighborhoodId('') }} disabled={zonesLoading} className="w-full h-9 pl-2.5 pr-8 rounded-lg border border-blue-200 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/30 disabled:opacity-50">
              <option value="">{zonesLoading ? 'Cargando...' : 'Selecciona municipio'}</option>
              {municipalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400 pointer-events-none" /></div>
            <div className="relative"><select value={neighborhoodId} onChange={e => setNeighborhoodId(e.target.value)} disabled={!municipalityId} className="w-full h-9 pl-2.5 pr-8 rounded-lg border border-blue-200 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/30 disabled:opacity-50">
              <option value="">{!municipalityId ? 'Primero el municipio' : 'Selecciona barrio'}</option>
              {selectedMunicipality?.neighborhoods?.map(n => <option key={n.id} value={n.id}>{n.name} — {fmtCUP(n.price ?? 0)}</option>)}
            </select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400 pointer-events-none" /></div>
            <Input value={streets} onChange={e => setStreets(e.target.value)} placeholder="Calle, número, apartamento..." disabled={!neighborhoodId} className="h-9 rounded-lg text-sm border-blue-200 focus:ring-blue-400/30" />
          </div>
        )}
        <div className="space-y-2 pt-2 border-t border-blue-100">
          {cartMode ? (
            <>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Subtotal ({qty} × {fmtPrice(product.price)})</span><span className="text-black font-semibold">{fmtPrice(subtotal)}</span></div>
              <button onClick={addToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 text-sm"><ShoppingBag className="h-4 w-4" /> Agregar al carrito</button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Subtotal ({qty} × {fmtPrice(product.price)})</span><span className="text-black font-semibold">{fmtPrice(subtotal)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Mensajería</span><span className="text-black font-semibold">{selectedNeighborhood ? fmtCUP(deliveryPrice) : '—'}</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-gray-600">Total</span><span className="text-black font-extrabold text-lg">{selectedNeighborhood ? `${fmtPrice(subtotal)} + ${fmtCUP(deliveryPrice)}` : fmtPrice(subtotal)}</span></div>
              <button onClick={() => submit('whatsapp')} className="w-full bg-[#25D366] hover:bg-[#1FB855] text-white h-10 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 text-sm"><Send className="h-4 w-4" /> Pedir por WhatsApp</button>
              <button onClick={() => submit('sms')} className="w-full bg-white border-2 border-gray-800 text-black hover:bg-gray-50 h-10 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 text-sm"><MessageSquare className="h-4 w-4" /> Enviar por SMS</button>
              <button onClick={() => {
              const imgEl = productImageRef.current
              const cartItem = { productId: product.id, slug: product.slug, name: product.name, description: product.note, note: product.note, price: product.price, imageUrl: product.imageSmall, qty, addons: [] as any[] }
              enableCartMode()
              onClose()
              window.scrollTo({ top: 0, behavior: 'smooth' })
              // Wait for cart button to appear, then fly product image to it
              setTimeout(() => {
                const cartBtn = document.querySelector('[data-cart-button]') as HTMLElement | null
                if (imgEl && cartBtn) {
                  flyToCart(imgEl, cartBtn, () => {
                    addItemToCart(cartItem, qty)
                    toast.success(product.name + ' agregado al carrito', { duration: 2000 })
                  })
                } else {
                  addItemToCart(cartItem, qty)
                  toast.success(product.name + ' agregado al carrito', { duration: 2000 })
                }
              }, 300)
            }} className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 border-2 border-gray-300 text-black hover:bg-gray-200 h-10 rounded-full font-bold text-xs"><ShoppingBag className="h-3.5 w-3.5" /> Hacer Varios Pedidos</button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
