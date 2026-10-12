import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products as seedProducts } from '../data/products.js'
import { vouchers as seedVouchers } from '../data/vouchers.js'

const StoreContext = createContext(null)

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => readJson('sa_products', seedProducts))
  const [vouchers, setVouchers] = useState(() => readJson('sa_vouchers', seedVouchers))

  useEffect(() => {
    localStorage.setItem('sa_products', JSON.stringify(products))
    window.dispatchEvent(new CustomEvent('shoptun-products-updated'))
  }, [products])

  useEffect(() => {
    localStorage.setItem('sa_vouchers', JSON.stringify(vouchers))
    window.dispatchEvent(new CustomEvent('shoptun-vouchers-updated'))
  }, [vouchers])

  useEffect(() => {
    const syncProducts = () => setProducts(readJson('sa_products', seedProducts))
    const syncVouchers = () => setVouchers(readJson('sa_vouchers', seedVouchers))
    window.addEventListener('storage', syncProducts)
    window.addEventListener('shoptun-products-updated', syncProducts)
    window.addEventListener('storage', syncVouchers)
    window.addEventListener('shoptun-vouchers-updated', syncVouchers)
    return () => {
      window.removeEventListener('storage', syncProducts)
      window.removeEventListener('shoptun-products-updated', syncProducts)
      window.removeEventListener('storage', syncVouchers)
      window.removeEventListener('shoptun-vouchers-updated', syncVouchers)
    }
  }, [])

  const value = useMemo(() => ({
    products,
    vouchers,
    setProducts,
    setVouchers,
    resetStore: () => {
      setProducts(seedProducts)
      setVouchers(seedVouchers)
    },
  }), [products, vouchers])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
