import { createContext, useContext, useState, useEffect } from 'react'
import { useStore } from './StoreContext.jsx'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { products } = useStore()
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa_wishlist') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('sa_wishlist', JSON.stringify(ids))
  }, [ids])

  const isWished = (id) => ids.includes(Number(id))

  const toggleWish = (id) => {
    id = Number(id)
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }

  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <WishlistContext.Provider value={{ ids, items, isWished, toggleWish }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
