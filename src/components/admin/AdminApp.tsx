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

  useEffect(() => {
    // Check auth on mount by reading document.cookie
    // This persists across page reloads because we set the cookie via document.cookie
    const checkAuth = () => {
      const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, ...v] = c.trim().split('=')
        acc[k] = v.join('=')
        return acc
      }, {} as Record<string, string>)

      if (cookies[COOKIE_NAME] === TOKEN) {
        setAuthed(true)
        // Load config
        fetch('/api/config', { credentials: 'include' })
          .then(r => r.json())
          .then(d => { if (d.config) setConfig(d.config) })
          .catch(() => {})
      } else {
        // Also try server-side check (in case cookie was set by server)
        fetch('/api/auth/me')
          .then(r => r.json())
          .then(d => {
            if (d.authenticated) {
              // Server has the cookie, set it client-side too for future reloads
              document.cookie = `${COOKIE_NAME}=${TOKEN}; path=/; max-age=${60 * 60 * 24 * 365 * 10}; SameSite=Lax`
              setAuthed(true)
              fetch('/api/config', { credentials: 'include' })
                .then(r => r.json())
                .then(d => { if (d.config) setConfig(d.config) })
                .catch(() => {})
            } else {
              setAuthed(false)
            }
          })
          .catch(() => setAuthed(false))
      }
    }
    checkAuth()
  }, [])

  const handleLogin = () => {
    // Set cookie client-side so it persists across reloads
    document.cookie = `${COOKIE_NAME}=${TOKEN}; path=/; max-age=${60 * 60 * 24 * 365 * 10}; SameSite=Lax`
    setAuthed(true)
    // Load config
    fetch('/api/config', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.config) setConfig(d.config) })
      .catch(() => {})
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
