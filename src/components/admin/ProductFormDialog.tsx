'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import type { Product, Category } from '@/lib/types'
import { useBackButtonModal } from '@/lib/use-back-button'
import { imageUrl as buildImageUrl } from '@/lib/image-url'

export default function ProductFormDialog({ product, categories, onClose, onSaved }: {
  product: Product | null; categories: Category[]; onClose: () => void; onSaved: () => void
}) {
  const isEdit = !!product
  useBackButtonModal(true, onClose)
  const [name, setName] = useState(product?.name || '')
  const [note, setNote] = useState(product?.note || product?.description || '')
  const [price, setPrice] = useState(product ? String(product.price) : '0')
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || '')
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '')
  const [trending, setTrending] = useState(product?.trending || product?.featured || false)
  const [active, setActive] = useState(product?.active ?? true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB.'); return }
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      setImageUrl(data.url)
      toast.success('Imagen subida correctamente')
    } catch { toast.error('No se pudo subir la imagen') }
    finally { setUploading(false) }
  }

  const submit = async () => {
    if (!name.trim() || !categoryId) { toast.error('Completa el nombre y la categoría'); return }
    setSaving(true)
    try {
      const body = { name: name.trim(), description: note.trim(), note: note.trim(), price: Number(price) || 0, categoryId, imageUrl, imageSmall: imageUrl, featured: trending, trending, active }
      const res = isEdit
        ? await fetch(`/api/products/${product!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.error || 'Save failed') }
      toast.success(isEdit ? 'Producto actualizado con éxito' : 'Producto creado con éxito')
      await new Promise(r => setTimeout(r, 300))
      onSaved()
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Error al guardar') }
    finally { setSaving(false) }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-5 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-[#0A1628]">{isEdit ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          <p className="text-xs text-gray-500 -mt-1">Completa los datos del producto.</p>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-bold text-[#0A1628] block mb-1.5">Imagen del producto</label>
            {imageUrl ? (
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={buildImageUrl(imageUrl)} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 h-7 w-7 inline-flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="Quitar imagen"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="w-full h-28 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 text-sm">Sin imagen</div>
            )}
            <label className="mt-2 inline-flex items-center gap-2 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-[#0A1628] text-sm font-semibold px-3 py-2 rounded-lg transition-colors">
              <Upload className="h-4 w-4" />{imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} disabled={uploading} />
            </label>
            {uploading && <p className="text-xs text-blue-500 mt-1">Subiendo...</p>}
          </div>
          <div>
            <label className="text-sm font-bold text-[#0A1628] block mb-1.5">Nombre *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Gafas Vintage Black" />
          </div>
          <div>
            <label className="text-sm font-bold text-[#0A1628] block mb-1.5">Descripción</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Descripción del producto..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-[#0A1628] block mb-1.5">Precio (USD)</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10" min="0" step="0.01" />
            </div>
            <div>
              <label className="text-sm font-bold text-[#0A1628] block mb-1.5">Categoría *</label>
              <div className="relative">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/30">
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><Switch checked={trending} onCheckedChange={setTrending} /><span className="text-sm font-semibold text-[#0A1628]">Destacado</span></div>
            <div className="flex items-center gap-2"><Switch checked={active} onCheckedChange={setActive} /><span className="text-sm font-semibold text-[#0A1628]">Activo</span></div>
          </div>
          <button onClick={submit} disabled={saving || uploading || !name.trim() || !categoryId}
            className={`w-full h-11 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${(saving || uploading || !name.trim() || !categoryId) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0A1628] hover:bg-[#1a3a6a] text-white active:scale-95'}`}>
            {saving ? 'Guardando...' : uploading ? 'Subiendo imagen...' : (isEdit ? 'Guardar cambios' : 'Crear producto')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
