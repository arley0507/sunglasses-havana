'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string; slug: string; name: string; description: string; note: string
  price: number; imageUrl: string; qty: number
  addons: Array<{ id: string; name: string; price: number }>
}

type CartState = {
  items: CartItem[]; cartMode: boolean; isOpen: boolean
  enableCartMode: () => void; disableCartMode: () => void
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (index: number) => void; updateQty: (index: number, qty: number) => void
  clearCart: () => void; openCart: () => void; closeCart: () => void
  getCount: () => number; getSubtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], cartMode: false, isOpen: false,
      enableCartMode: () => set({ cartMode: true }),
      disableCartMode: () => set({ cartMode: false, items: [], isOpen: false }),
      addItem: (item, qty = 1) => {
        const items = get().items
        const existingIdx = items.findIndex(it => it.productId === item.productId && it.addons.length === item.addons.length && it.addons.every(a => item.addons.some(b => b.id === a.id)))
        if (existingIdx >= 0) { const n = [...items]; n[existingIdx].qty += qty; set({ items: n }) }
        else { set({ items: [...items, { ...item, qty }] }) }
      },
      removeItem: (index) => set({ items: get().items.filter((_, i) => i !== index) }),
      updateQty: (index, qty) => { const n = [...get().items]; if (n[index]) { n[index].qty = Math.max(1, qty); set({ items: n }) } },
      clearCart: () => set({ items: [] }), openCart: () => set({ isOpen: true }), closeCart: () => set({ isOpen: false }),
      getCount: () => get().items.reduce((s, it) => s + it.qty, 0),
      getSubtotal: () => get().items.reduce((s, it) => s + (it.price + it.addons.reduce((a, b) => a + b.price, 0)) * it.qty, 0),
    }),
    { name: 'sunglasses-cart-v1', partialize: (s) => ({ items: s.items, cartMode: s.cartMode }) }
  )
)
