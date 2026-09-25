import { Link, useLocation, Navigate } from 'react-router-dom'
import { formatVnd } from '../utils.js'

export default function OrderSuccess() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) return <Navigate to="/" replace />

  return (
    <div className="order-success">
      <div className="success-icon">✅</div>
      <h1>Đặt hàng thành công!</h1>
      <p className="order-id">Mã đơn hàng: <b>{order.id}</b></p>

      <div className="order-box">
        <h2>Giao đến</h2>
        <p>{order.customer.fullName} — {order.customer.phone}</p>
        <p>{order.customer.address}, {order.customer.city}</p>
        <p>Thanh toán: {order.customer.payment === 'cod' ? 'Khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</p>

        <h2>Sản phẩm</h2>
        {order.items.map((item) => (
          <div className="summary-row" key={item.key || item.id}>
            <span className="order-product"><img src={item.imageUrl} alt={item.name} />{item.name} x{item.qty}</span>
            <span>{formatVnd(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="summary-row">
          <span>Tạm tính</span>
          <span>{formatVnd(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="summary-row discount">
            <span>Giảm giá ({order.voucherCode})</span>
            <span>-{formatVnd(order.discount)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Tổng cộng</span>
          <span>{formatVnd(order.total)}</span>
        </div>
      </div>

      <Link to="/" className="btn-primary">Về trang chủ</Link>
    </div>
  )
}
