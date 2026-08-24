'use client'

import { useEffect, useState } from 'react'
import { AdminLogin } from './AdminLogin'
import AdminShell from './AdminShell'
import type { SiteConfig } from '@/lib/types'

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    // Check auth on mount AND on every focus (when user returns to tab)
    const checkAuth = () => {
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((d) => {
          setAuthed(d.authenticated === true)
        })
        .catch(() => setAuthed(false))
    }
    checkAuth()
    // Re-check when window regains focus (handles reload + tab switch)
    window.addEventListener('focus', checkAuth)
    return () => window.removeEventListener('focus', checkAuth)
  }, [])

  useEffect(() => {
    if (authed) {
      fetch('/api/config')
        .then((r) => r.json())
        .then((d) => { if (d.config) setConfig(d.config) })
        .catch(() => {})
    }
  }, [authed])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthed(false)
    setConfig(null)
  }

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-white text-sm">Cargando...</div>
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onLoggedIn={() => setAuthed(true)} />
  }

  return <AdminShell config={config} onLogout={logout} />
}
