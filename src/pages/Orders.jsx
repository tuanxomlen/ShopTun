import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatVnd } from '../utils.js'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('sa_orders') || '[]')
      setOrders(all.reverse())
    } catch {
      setOrders([])
    }
  }, [])

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>Bạn chưa có đơn hàng nào.</p>
        <Link to="/" className="btn-primary">Mua sắm ngay</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Đơn hàng của tôi ({orders.length})</h1>
      <div className="order-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-card-head">
              <span className="order-id">Mã đơn: {o.id}</span>
              <span className="order-status">Đang xử lý</span>
            </div>
            <div className="order-card-body">
              {o.items.map((item) => (
                <div className="summary-row" key={item.key || item.id}>
                  <span className="order-product"><img src={item.imageUrl} alt={item.name} />{item.name} x{item.qty}</span>
                  <span>{formatVnd(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="order-card-foot">
              <span>Giao tới: {o.customer.address}, {o.customer.city}</span>
              <span className="price">{formatVnd(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
