'use client'

import { useEffect, useState } from 'react'
import { AdminLogin } from './AdminLogin'
import AdminShell from './AdminShell'
import type { SiteConfig } from '@/lib/types'

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    // Check auth via API — cookies are sent automatically for same-origin
    let cancelled = false
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'same-origin' })
        const d = await res.json()
        if (!cancelled) setAuthed(d.authenticated === true)
      } catch {
        if (!cancelled) setAuthed(false)
      }
    }
    // Slight delay to ensure cookies are available after reload
    const timer = setTimeout(checkAuth, 200)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  useEffect(() => {
    if (authed === true) {
      fetch('/api/config', { credentials: 'same-origin' })
        .then(r => r.json())
        .then(d => { if (d.config) setConfig(d.config) })
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

  if (!authed) return <AdminLogin onLoggedIn={() => setAuthed(true)} />
  return <AdminShell config={config} onLogout={logout} />
}
