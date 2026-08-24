'use client'

import { useState } from 'react'
import { Package, FolderTree, Settings, ExternalLink, LogOut, MapPin } from 'lucide-react'
import AdminProducts from './AdminProducts'
import AdminCategories from './AdminCategories'
import AdminConfig from './AdminConfig'
import AdminZones from './AdminZones'
import type { SiteConfig } from '@/lib/types'

type Tab = 'products' | 'categories' | 'zones' | 'config'

export default function AdminShell({ config, onLogout }: { config: SiteConfig | null; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('products')
  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'products', label: 'Productos', icon: <Package className="h-4 w-4" /> },
    { key: 'categories', label: 'Categorías', icon: <FolderTree className="h-4 w-4" /> },
    { key: 'zones', label: 'Mensajería', icon: <MapPin className="h-4 w-4" /> },
    { key: 'config', label: 'Configuración', icon: <Settings className="h-4 w-4" /> },
  ]
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:flex w-56 bg-[#0A1628] text-white flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/sunglasses/logo-s.webp" alt="Logo" className="h-10 w-10 rounded-lg object-cover ring-2 ring-blue-400/40" />
            <div>
              <p className="text-sm font-bold text-white">{config?.businessName || 'Sunglasses Havana'}</p>
              <p className="text-xs text-blue-300">Panel admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((it) => (
            <button key={it.key} onClick={() => setTab(it.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === it.key ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/10'}`}>
              {it.icon}{it.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-blue-100 hover:bg-white/10 transition-colors">
            <ExternalLink className="h-4 w-4" />Ver sitio
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-colors">
            <LogOut className="h-4 w-4" />Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0A1628] px-2 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((it) => (
          <button key={it.key} onClick={() => setTab(it.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${tab === it.key ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/10'}`}>
            {it.icon}{it.label}
          </button>
        ))}
        <button onClick={onLogout} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors">
          <LogOut className="h-3.5 w-3.5" />Salir
        </button>
      </div>
      <main className="flex-1 mt-12 md:mt-0 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-5xl mx-auto pb-20">
          {tab === 'products' && <AdminProducts />}
          {tab === 'categories' && <AdminCategories />}
          {tab === 'zones' && <AdminZones />}
          {tab === 'config' && <AdminConfig config={config} />}
        </div>
      </main>
    </div>
  )
}
