import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Wishlist() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">♡</span>
        <p>Bạn chưa lưu sản phẩm yêu thích nào.</p>
        <Link to="/" className="btn-primary">Khám phá sản phẩm</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Sản phẩm yêu thích ({items.length})</h1>
      <div className="grid">
        {items.map((p) => <ProductCard product={p} key={p.id} />)}
      </div>
    </div>
  )
}
