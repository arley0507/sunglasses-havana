'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Category } from '@/lib/types'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)

  const load = async () => {
    try {
      const res = await fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' })
      const d = await res.json()
      setCategories(d.categories || [])
    } catch { toast.error('No se pudieron cargar') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!newName.trim()) return
    try {
      const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) })
      if (!res.ok) throw new Error()
      toast.success('Categoría creada')
      setNewName('')
      load()
    } catch { toast.error('No se pudo crear') }
  }

  const saveEdit = async () => {
    if (!editing || !editing.name.trim()) return
    try {
      const res = await fetch(`/api/categories/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editing.name.trim() }) })
      if (!res.ok) throw new Error()
      toast.success('Categoría actualizada')
      setEditing(null)
      load()
    } catch { toast.error('No se pudo actualizar') }
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Los productos pasarán a inactivos.')) return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Categoría eliminada')
      load()
    } catch { toast.error('No se pudo eliminar') }
  }

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Cargando...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628]">Categorías</h1>
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && create()}
          placeholder="Nombre de nueva categoría" className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30" />
        <button onClick={create} className="bg-[#0A1628] hover:bg-[#1a3a6a] text-white text-sm font-bold px-4 rounded-lg">Crear</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map(c => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            {editing?.id === c.id ? (
              <>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="flex-1 h-8 px-2 rounded border border-gray-200 text-sm" autoFocus />
                <button onClick={saveEdit} className="ml-2 text-xs font-bold text-blue-600">Guardar</button>
                <button onClick={() => setEditing(null)} className="ml-2 text-xs font-bold text-gray-400">Cancelar</button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-bold text-[#0A1628] text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-400">Orden {c.sortOrder}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ id: c.id, name: c.name })} className="text-xs font-bold text-[#0A1628] hover:underline">Editar</button>
                  <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-500 hover:underline ml-2">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
