import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatVnd } from '../utils.js'

export default function Cart() {
  const { items, setQty, removeFromCart, totalPrice, totalQty } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🛒</span>
        <p>Giỏ hàng của bạn đang trống.</p>
        <Link to="/" className="btn-primary">Mua sắm ngay</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Giỏ hàng ({totalQty} sản phẩm)</h1>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.key}>
            <img className="cart-image" src={item.imageUrl} alt={item.name} />
            <div className="cart-info">
              <h3>{item.name}</h3>
              {(item.variantColor || item.variantSize) && (
                <p className="variant-hint">
                  {item.variantColor ? `Màu: ${item.variantColor}` : ''}{item.variantColor && item.variantSize ? ' · ' : ''}{item.variantSize ? `Size: ${item.variantSize}` : ''}
                </p>
              )}
              <p className="price">{formatVnd(item.price)}</p>
            </div>
            <div className="qty-row">
              <button onClick={() => setQty(item.key, item.qty - 1)}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => setQty(item.key, item.qty + 1)}>+</button>
            </div>
            <div className="cart-subtotal">{formatVnd(item.price * item.qty)}</div>
            <button className="remove-btn" onClick={() => removeFromCart(item.key)}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Tổng cộng</span>
        <span className="price big">{formatVnd(totalPrice)}</span>
      </div>

      <div className="action-row">
        <Link to="/" className="btn-outline">Tiếp tục mua sắm</Link>
        <button className="btn-primary" onClick={() => navigate('/checkout')}>
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  )
}
