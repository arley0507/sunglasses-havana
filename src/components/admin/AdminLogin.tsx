'use client'

import { useState, FormEvent } from 'react'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

export function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Credenciales inválidas' }))
        setError(data.error || 'Error al iniciar sesión')
        return
      }
      onLoggedIn()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <img src="/sunglasses/logo-s.webp" alt="Logo" className="h-16 w-16 rounded-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-center text-[#0A1628] mb-1">Panel Admin</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Sunglasses Havana</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0A1628] mb-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" autoFocus required
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-[#0A1628] text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0A1628] mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-[#0A1628] text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full h-11 bg-[#0A1628] hover:bg-[#1a3a6a] active:scale-95 transition-all text-white font-bold rounded-lg disabled:opacity-50">
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
        <a href="/" className="block mt-4 text-center text-sm text-[#0A1628] hover:underline font-semibold">← Volver al sitio</a>
      </div>
    </div>
  )
}
