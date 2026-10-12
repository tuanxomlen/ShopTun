import { createContext, useContext, useState, useEffect } from 'react'
import { useStore } from './StoreContext.jsx'

const CartContext = createContext(null)

// Cart is keyed by "productId::color::size" so the same product with
// different variants shows as separate lines.
const lineKey = (id, opt = {}) => `${id}::${opt.color || ''}::${opt.size || ''}`
// (opt.color/opt.size are the variant choices passed in from the product page)

export function CartProvider({ children }) {
  const { products } = useStore()
  const [lines, setLines] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa_cart_v2') || '{}') }
    catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem('sa_cart_v2', JSON.stringify(lines))
  }, [lines])

  const addToCart = (id, qty = 1, opt = {}) => {
    const key = lineKey(id, opt)
    setLines((cur) => {
      const existing = cur[key]
      return {
        ...cur,
        [key]: {
          id: Number(id),
          variantColor: opt.color || '',
          variantSize: opt.size || '',
          qty: (existing?.qty || 0) + qty,
        },
      }
    })
  }

  const setQty = (key, qty) => {
    setLines((cur) => {
      const next = { ...cur }
      if (qty <= 0) delete next[key]
      else next[key] = { ...next[key], qty }
      return next
    })
  }

  const removeFromCart = (key) => {
    setLines((cur) => {
      const next = { ...cur }
      delete next[key]
      return next
    })
  }

  const clearCart = () => setLines({})

  const items = Object.entries(lines)
    .map(([key, line]) => {
      const product = products.find((p) => p.id === line.id)
      return product ? { ...product, ...line, key } : null
    })
    .filter(Boolean)

  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, setQty, removeFromCart, clearCart, totalQty, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
