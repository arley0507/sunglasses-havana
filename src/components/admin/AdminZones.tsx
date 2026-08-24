'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Municipality, Neighborhood } from '@/lib/types'

export default function AdminZones() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [priceEdits, setPriceEdits] = useState<Record<string, { price: string; saving: boolean }>>({})
  const savingRef = useRef<Record<string, boolean>>({})

  const load = async () => {
    try {
      const res = await fetch(`/api/municipalities?all=1&t=${Date.now()}`, { cache: 'no-store' })
      const d = await res.json()
      setMunicipalities(d.municipalities || [])
    } catch { toast.error('No se pudieron cargar') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const startEdit = (n: Neighborhood) => setPriceEdits(p => ({ ...p, [n.id]: { price: n.price === null ? '' : String(n.price), saving: false } }))
  const cancelEdit = (id: string) => setPriceEdits(p => { const c = { ...p }; delete c[id]; return c })

  const savePrice = async (n: Neighborhood) => {
    if (savingRef.current[n.id]) return
    const edit = priceEdits[n.id]; if (!edit) return
    savingRef.current[n.id] = true
    setPriceEdits(p => ({ ...p, [n.id]: { ...edit, saving: true } }))
    try {
      const newPrice = edit.price === '' ? null : Number(edit.price)
      const res = await fetch(`/api/neighborhoods/${n.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: newPrice, active: newPrice !== null ? true : n.active }) })
      if (!res.ok) throw new Error()
      toast.success('Precio guardado')
      cancelEdit(n.id)
      load()
    } catch { toast.error('No se pudo guardar'); setPriceEdits(p => ({ ...p, [n.id]: { ...edit, saving: false } })) }
    finally { savingRef.current[n.id] = false }
  }

  const toggleActive = async (n: Neighborhood) => {
    try { await fetch(`/api/neighborhoods/${n.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !n.active }) }); load() }
    catch { toast.error('No se pudo actualizar') }
  }

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Cargando...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628]">Mensajería</h1>
      <p className="text-sm text-gray-500">{municipalities.length} municipios · Ponle precio a los barrios donde haces entregas.</p>
      <div className="space-y-2">
        {municipalities.map(m => (
          <div key={m.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setExpandedId(expandedId === m.id ? null : m.id)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
              <span className="font-bold text-[#0A1628] text-sm">{m.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{m.neighborhoods?.length || 0} barrios</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedId === m.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedId === m.id && (
              <div className="border-t border-gray-100 p-2 space-y-1">
                {m.neighborhoods?.map(n => {
                  const edit = priceEdits[n.id]
                  return (
                    <div key={n.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                      <span className="flex-1 text-sm text-gray-700">{n.name}</span>
                      {edit ? (
                        <>
                          <input type="number" value={edit.price} onChange={e => setPriceEdits(p => ({ ...p, [n.id]: { ...edit, price: e.target.value } }))}
                            onKeyDown={e => { if (e.key === 'Enter') savePrice(n); if (e.key === 'Escape') cancelEdit(n.id) }}
                            className="w-20 h-8 px-2 rounded border border-gray-200 text-xs text-right" placeholder="—" autoFocus />
                          <button onClick={() => savePrice(n)} disabled={edit.saving} className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-[#0A1628] text-white disabled:opacity-50"><Check className="h-3.5 w-3.5" /></button>
                          <button onClick={() => cancelEdit(n.id)} className="h-7 w-7 inline-flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"><X className="h-3.5 w-3.5" /></button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-[#0A1628] w-20 text-right">{n.price !== null ? `$${Math.round(n.price)}` : '—'}</span>
                          <button onClick={() => startEdit(n)} className="text-xs font-bold text-blue-600 hover:underline">Precio</button>
                          <button onClick={() => toggleActive(n)} className={`text-xs font-bold ${n.active ? 'text-green-600' : 'text-gray-400'}`}>{n.active ? 'Activo' : 'Inactivo'}</button>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
