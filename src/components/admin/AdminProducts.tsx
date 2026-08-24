'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { Product, Category } from '@/lib/types'
import ProductFormDialog from './ProductFormDialog'
import { imageUrl } from '@/lib/image-url'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const loadAll = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const [p, c] = await Promise.all([
        fetch(`/api/products?all=1&t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()),
        fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()),
      ])
      setProducts(p.products || [])
      setCategories(c.categories || [])
    } catch { toast.error('No se pudo cargar') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll(true) }, [])

  const filtered = useMemo(() => {
    let list = products
    if (filterCat !== 'all') list = list.filter(p => p.categoryId === filterCat)
    const q = search.trim().toLowerCase()
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    return list
  }, [products, filterCat, search])

  const toggleActive = async (p: Product) => {
    const prev = products
    setProducts(arr => arr.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !p.active }) })
      if (!res.ok) throw new Error()
    } catch { setProducts(prev); toast.error('No se pudo actualizar') }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      const res = await fetch(`/api/products/${deleting.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Producto eliminado')
      setDeleting(null)
      loadAll(false)
    } catch { toast.error('No se pudo eliminar') }
  }

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Cargando productos...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628]">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} productos en el catálogo</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 bg-[#0A1628] hover:bg-[#1a3a6a] text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors">
          <Plus className="h-4 w-4" /> Nuevo producto
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9" />
        </div>
        <div className="relative">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="h-10 pl-3 pr-9 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/30">
            <option value="all">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex gap-3">
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {p.imageUrl && <img src={imageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#0A1628] text-sm line-clamp-1">{p.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">{p.description || p.note}</p>
              <p className="text-[#0A1628] font-bold text-sm mt-0.5">${p.price.toFixed(2)} USD</p>
              <p className="text-xs text-gray-400">{categories.find(c => c.id === p.categoryId)?.name || '—'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                <span className="text-xs text-gray-500">{p.active ? 'Activo' : 'Inactivo'}</span>
                <button onClick={() => setEditing(p)} className="ml-auto h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-[#0A1628]"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setDeleting(p)} className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-red-50 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No se encontraron productos</div>}

      {(creating || editing) && (
        <ProductFormDialog product={editing} categories={categories}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={() => { setCreating(false); setEditing(null); loadAll(false) }} />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeleting(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0A1628]">¿Eliminar producto?</h2>
            <p className="text-sm text-gray-500 mt-1">Se eliminará "{deleting.name}" permanentemente.</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDeleting(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 h-10 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
