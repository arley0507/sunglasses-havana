'use client'

import { useEffect, useState, useCallback } from 'react'
import { Save, Upload, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { SiteConfig } from '@/lib/types'

export default function AdminConfig({ config: initialConfig }: { config: SiteConfig | null }) {
  const [form, setForm] = useState<SiteConfig | null>(initialConfig)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [dirty, setDirty] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/config', { cache: 'no-store' })
      const d = await res.json()
      if (d.config) { setForm(d.config); setDirty(false) }
    } catch { toast.error('No se pudo cargar') }
  }

  useEffect(() => { load() }, [])

  const update = useCallback(<K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => {
    setForm(f => f ? { ...f, [k]: v } : f)
    setDirty(true)
  }, [])

  const handleUpload = async (file: File, field: 'heroImage' | 'logoImage') => {
    const setUp = field === 'heroImage' ? setUploading : setLogoUploading
    setUp(true)
    try {
      if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB.'); return }
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      update(field, data.url)
      toast.success('Imagen subida. Toca "Guardar cambios" para aplicarla.')
    } catch { toast.error('No se pudo subir') }
    finally { setUp(false) }
  }

  const save = async () => {
    if (!form || !dirty) return
    setSaving(true)
    try {
      const res = await fetch('/api/config/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.config) setForm(data.config)
      setDirty(false)
      toast.success('¡Cambios guardados con éxito!')
    } catch { toast.error('No se pudieron guardar') }
    finally { setSaving(false) }
  }

  if (!form) return <div className="text-gray-400 text-sm">Cargando...</div>

  return (
    <div className="space-y-4 pb-16">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628]">Configuración</h1>

      {/* Hero image */}
      <Section title="Imagen del Hero (portada)">
        <div className="mt-2">
          {form.heroImage ? (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
              <img src={`/api/files${form.heroImage}`} alt="Hero" className="w-full h-full object-cover" />
              <button onClick={() => update('heroImage', '')} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center"><X className="h-3 w-3" /></button>
            </div>
          ) : (
            <div className="w-full h-32 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">Imagen por defecto</div>
          )}
          <label className="mt-2 inline-flex items-center gap-2 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-[#0A1628] text-sm font-semibold px-3 py-2 rounded-lg">
            <Upload className="h-4 w-4" />{form.heroImage ? 'Cambiar' : 'Subir'} imagen del hero
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'heroImage') }} disabled={uploading} />
          </label>
          {uploading && <p className="text-xs text-blue-500 mt-1">Subiendo...</p>}
        </div>
      </Section>

      {/* Logo image */}
      <Section title="Logo del negocio">
        <div className="mt-2">
          {form.logoImage ? (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
              <img src={`/api/files${form.logoImage}`} alt="Logo" className="w-full h-full object-contain" />
              <button onClick={() => update('logoImage', '')} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center"><X className="h-3 w-3" /></button>
            </div>
          ) : (
            <div className="w-full h-32 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">Logo por defecto</div>
          )}
          <label className="mt-2 inline-flex items-center gap-2 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-[#0A1628] text-sm font-semibold px-3 py-2 rounded-lg">
            <Upload className="h-4 w-4" />{form.logoImage ? 'Cambiar' : 'Subir'} logo
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'logoImage') }} disabled={logoUploading} />
          </label>
          {logoUploading && <p className="text-xs text-blue-500 mt-1">Subiendo...</p>}
        </div>
      </Section>

      {/* WhatsApp */}
      <Section title="WhatsApp y teléfono">
        <div className="space-y-3 mt-2">
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Número de WhatsApp</label><Input value={form.whatsappNumber} onChange={e => update('whatsappNumber', e.target.value)} /></div>
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Teléfono (mostrar)</label><Input value={form.phoneDisplay} onChange={e => update('phoneDisplay', e.target.value)} /></div>
        </div>
      </Section>

      {/* Business */}
      <Section title="Identidad del negocio">
        <div className="space-y-3 mt-2">
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Nombre</label><Input value={form.businessName} onChange={e => update('businessName', e.target.value)} /></div>
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Eslogan</label><Input value={form.tagline} onChange={e => update('tagline', e.target.value)} /></div>
        </div>
      </Section>

      {/* Address */}
      <Section title="Dirección y horarios">
        <div className="space-y-3 mt-2">
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Dirección</label><Input value={form.contactAddress} onChange={e => update('contactAddress', e.target.value)} /></div>
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Horarios</label><Textarea value={form.contactHours} onChange={e => update('contactHours', e.target.value)} rows={3} /></div>
        </div>
      </Section>

      {/* Location */}
      <Section title="Ubicación (mapa)">
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-3 gap-2">
            <div><label className="text-xs font-bold text-[#0A1628] block mb-1">Latitud</label><Input type="number" step="0.0001" value={form.mapLat} onChange={e => update('mapLat', parseFloat(e.target.value) || 0)} /></div>
            <div><label className="text-xs font-bold text-[#0A1628] block mb-1">Longitud</label><Input type="number" step="0.0001" value={form.mapLng} onChange={e => update('mapLng', parseFloat(e.target.value) || 0)} /></div>
            <div><label className="text-xs font-bold text-[#0A1628] block mb-1">Zoom</label><Input type="number" min="1" max="19" value={form.mapZoom} onChange={e => update('mapZoom', Math.min(19, Math.max(1, parseInt(e.target.value) || 13)))} /></div>
          </div>
          <iframe src={`https://www.openstreetmap.org/export/embed.html?bbox=${form.mapLng - 0.01}%2C${form.mapLat - 0.01}%2C${form.mapLng + 0.01}%2C${form.mapLat + 0.01}&layer=mapnik&marker=${form.mapLat}%2C${form.mapLng}&zoom=${form.mapZoom}`} className="w-full h-64 rounded-lg border-0" loading="lazy" title="Mapa" />
        </div>
      </Section>

      {/* Social */}
      <Section title="Redes sociales">
        <div className="space-y-3 mt-2">
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Instagram URL</label><Input value={form.instagramUrl} onChange={e => update('instagramUrl', e.target.value)} placeholder="https://instagram.com/..." /></div>
          <div><label className="text-sm font-bold text-[#0A1628] block mb-1">Facebook URL</label><Input value={form.facebookUrl} onChange={e => update('facebookUrl', e.target.value)} placeholder="https://facebook.com/..." /></div>
        </div>
      </Section>

      {/* Sticky bottom save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {dirty ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Cambios sin guardar
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Todo guardado</span>
            )}
          </div>
          <button onClick={save} disabled={saving || !dirty}
            className={`rounded-full font-bold transition-all px-6 h-10 ${dirty ? 'bg-[#0A1628] hover:bg-[#1a3a6a] text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {saving ? 'Guardando...' : (<span className="flex items-center gap-1.5"><Save className="h-4 w-4" />Guardar cambios</span>)}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">{title}</h2>
      {children}
    </section>
  )
}
