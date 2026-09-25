import { Link } from 'react-router-dom'
import Stars from './Stars.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { formatVnd, formatSold } from '../utils.js'
import { discountPercent } from '../data/products.js'

export default function ProductCard({ product }) {
  const { isWished, toggleWish } = useWishlist()
  const off = discountPercent(product)
  const wished = isWished(product.id)

  return (
    <Link to={`/product/${product.id}`} className="pcard">
      <div className="pcard-media" style={{ background: product.color }}>
        <img className="pcard-image" src={product.imageUrl} alt={product.name} loading="lazy" />
        {off > 0 && <span className="pcard-off">-{off}%</span>}
        <button
          className={`heart-btn ${wished ? 'saved' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWish(product.id) }}
          aria-label="Yêu thích"
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      <div className="pcard-body">
        <p className="pcard-name">{product.name}</p>
        <div className="pcard-price-row">
          <span className="price">{formatVnd(product.price)}</span>
          {off > 0 && <span className="price-old">{formatVnd(product.originalPrice)}</span>}
        </div>
        <div className="pcard-meta">
          <Stars value={product.rating} />
          <span className="sold">Đã bán {formatSold(product.sold)}</span>
        </div>
        {product.freeship && <span className="tag freeship">Freeship</span>}
      </div>
    </Link>
  )
}
