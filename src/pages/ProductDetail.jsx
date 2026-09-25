import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { findProduct, discountPercent } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatVnd, formatSold } from '../utils.js'
import Stars from '../components/Stars.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isWished, toggleWish } = useWishlist()
  const { showToast } = useToast()
  const product = findProduct(id)

  const [color, setColor] = useState(product?.variants.colors[0])
  const [size, setSize] = useState(product?.variants.sizes[0])
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="empty-state">
        <p>Không tìm thấy sản phẩm.</p>
        <Link to="/">← Về trang chủ</Link>
      </div>
    )
  }

  const off = discountPercent(product)
  const wished = isWished(product.id)

  const handleAdd = () => {
    addToCart(product.id, qty, { color, size })
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    addToCart(product.id, qty, { color, size })
    navigate('/cart')
  }

  return (
    <div className="detail">
      <Link to="/" className="back-link">← Tiếp tục mua sắm</Link>

      <div className="detail-grid">
        <div className="detail-media" style={{ background: product.color }}>
          <img className="detail-image" src={product.imageUrl} alt={product.name} />
          {off > 0 && <span className="pcard-off">-{off}%</span>}
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>

          <div className="detail-meta">
            <Stars value={product.rating} />
            <span className="divider" />
            <span>{product.reviewCount.toLocaleString('vi-VN')} đánh giá</span>
            <span className="divider" />
            <span>Đã bán {formatSold(product.sold)}</span>
          </div>

          <div className="price-box">
            <span className="price big">{formatVnd(product.price)}</span>
            {off > 0 && (
              <>
                <span className="price-old">{formatVnd(product.originalPrice)}</span>
                <span className="pcard-off static">-{off}%</span>
              </>
            )}
          </div>

          {product.freeship && <p className="freeship-line">🚚 Miễn phí vận chuyển</p>}

          <div className="variant-block">
            <span className="variant-label">Màu sắc</span>
            <div className="variant-options">
              {product.variants.colors.map((c) => (
                <button key={c} className={c === color ? 'chip active' : 'chip'} onClick={() => setColor(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="variant-block">
            <span className="variant-label">Kích cỡ</span>
            <div className="variant-options">
              {product.variants.sizes.map((s) => (
                <button key={s} className={s === size ? 'chip active' : 'chip'} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="variant-block">
            <span className="variant-label">Số lượng</span>
            <div className="qty-row">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              <span className="stock-hint">{product.stock} sản phẩm có sẵn</span>
            </div>
          </div>

          <div className="action-row">
            <button className="btn-outline" onClick={handleAdd}>Thêm vào giỏ</button>
            <button className="btn-primary" onClick={handleBuyNow}>Mua ngay</button>
            <button
              className={`heart-btn standalone ${wished ? 'saved' : ''}`}
              onClick={() => toggleWish(product.id)}
              aria-label="Yêu thích"
            >
              {wished ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>

      <section className="detail-desc">
        <h2>Mô tả sản phẩm</h2>
        <p>{product.desc}</p>
      </section>

      <section className="detail-reviews">
        <h2>Đánh giá từ khách hàng ({product.reviewCount.toLocaleString('vi-VN')})</h2>
        <div className="review-list">
          {product.reviews.map((r, i) => (
            <div className="review-item" key={i}>
              <div className="review-head">
                <span className="review-author">{r.author}</span>
                <Stars value={r.rating} />
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
