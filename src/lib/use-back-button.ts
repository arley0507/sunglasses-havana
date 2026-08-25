'use client'
import { useEffect } from 'react'

export function useBackButtonModal(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return
    window.history.pushState({ modal: true }, '')
    const handler = () => onClose()
    window.addEventListener('popstate', handler)
    return () => {
      window.removeEventListener('popstate', handler)
      if (window.history.state?.modal) window.history.back()
    }
  }, [active, onClose])
}
