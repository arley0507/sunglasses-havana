'use client'

import { useEffect, useState } from 'react'
import { AdminLogin } from './AdminLogin'
import AdminShell from './AdminShell'
import type { SiteConfig } from '@/lib/types'

const TOKEN = 'sunglasses-havana-admin-session-valid'
const COOKIE_NAME = 'sunglasses_admin_session'

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [config, setConfig] = useState<SiteConfig | null>(null)

  // Check auth on mount
  useEffect(() => {
    // First check if we have the cookie set via document.cookie
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [k, ...v] = c.trim().split('=')
      acc[k] = v.join('=')
      return acc
    }, {} as Record<string, string>)

    if (cookies[COOKIE_NAME] === TOKEN) {
      setAuthed(true)
    } else {
      setAuthed(false)
    }
  }, [])

  // Load config when authed
  useEffect(() => {
    if (authed === true) {
      fetch('/api/config', { credentials: 'include' })
        .then(r => r.json())
        .then(d => { if (d.config) setConfig(d.config) })
        .catch(() => {})
    }
  }, [authed])

  const handleLogin = () => {
    // Set cookie via document.cookie (client-side, persists across reloads)
    document.cookie = `${COOKIE_NAME}=${TOKEN}; path=/; max-age=${60 * 60 * 24 * 365 * 10}; SameSite=Lax`
    setAuthed(true)
  }

  const logout = async () => {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
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

  if (!authed) return <AdminLogin onLoggedIn={handleLogin} />
  return <AdminShell config={config} onLogout={logout} />
}
