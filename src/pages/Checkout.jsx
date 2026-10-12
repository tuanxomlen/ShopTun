import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatVnd } from '../utils.js'

export default function Checkout() {
  const { vouchers } = useStore()
  const applyVoucher = (code, total) => {
    const v = vouchers[code?.trim().toUpperCase()]
    if (!v || v.active === false) return { ok: false, message: 'Mã giảm giá không hợp lệ.' }
    if (v.minTotal && total < v.minTotal) {
      return { ok: false, message: `Đơn hàng cần tối thiểu ${v.minTotal.toLocaleString('vi-VN')}₫ để dùng mã này.` }
    }
    const discount = v.type === 'percent' ? Math.round(total * (v.value / 100)) : v.value
    return { ok: true, code: code.trim().toUpperCase(), label: v.label, discount: Math.min(discount, total) }
  }

  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    payment: 'cod',
  })
  const [voucherInput, setVoucherInput] = useState('')
  const [voucher, setVoucher] = useState(null)
  const [voucherError, setVoucherError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleApplyVoucher = () => {
    const result = applyVoucher(voucherInput, totalPrice)
    if (!result.ok) { setVoucherError(result.message); setVoucher(null); return }
    setVoucherError('')
    setVoucher(result)
  }

  const finalTotal = Math.max(0, totalPrice - (voucher?.discount || 0))

  const onSubmit = (e) => {
    e.preventDefault()

    const order = {
      id: 'DH' + Date.now(),
      items,
      subtotal: totalPrice,
      discount: voucher?.discount || 0,
      voucherCode: voucher?.code || null,
      total: finalTotal,
      customer: form,
      userEmail: user?.email || null,
      userName: user?.name || form.fullName,
      status: 'Đang xử lý',
      createdAt: new Date().toISOString(),
    }

    try {
      const orders = JSON.parse(localStorage.getItem('sa_orders') || '[]')
      orders.push(order)
      localStorage.setItem('sa_orders', JSON.stringify(orders))
    } catch { /* ignore storage errors */ }

    clearCart()
    navigate('/order-success', { state: { order } })
  }

  if (items.length === 0) {
    return <p className="empty-state">Giỏ hàng trống, không có gì để thanh toán.</p>
  }

  return (
    <div className="checkout">
      <h1 className="page-title">Thanh toán</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={onSubmit} id="checkout-form">
          <h2>Thông tin giao hàng</h2>

          <label>Họ tên người nhận</label>
          <input name="fullName" required value={form.fullName} onChange={onChange} />

          <label>Số điện thoại</label>
          <input name="phone" required pattern="[0-9]{9,11}" value={form.phone} onChange={onChange} />

          <label>Tỉnh / Thành phố</label>
          <input name="city" required value={form.city} onChange={onChange} />

          <label>Địa chỉ cụ thể</label>
          <input name="address" required placeholder="Số nhà, tên đường, phường/xã..." value={form.address} onChange={onChange} />

          <h2>Phương thức thanh toán</h2>
          <label className="radio-row">
            <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={onChange} />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label className="radio-row">
            <input type="radio" name="payment" value="transfer" checked={form.payment === 'transfer'} onChange={onChange} />
            Chuyển khoản ngân hàng
          </label>
        </form>

        <div className="order-summary">
          <h2>Đơn hàng</h2>
          {items.map((item) => (
            <div className="summary-row" key={item.key}>
              <span className="order-product"><img src={item.imageUrl} alt={item.name} />{item.name} x{item.qty}</span>
              <span>{formatVnd(item.price * item.qty)}</span>
            </div>
          ))}

          <div className="voucher-row">
            <input
              type="text"
              placeholder="Mã giảm giá (vd: SALE10)"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
            />
            <button type="button" className="btn-outline small" onClick={handleApplyVoucher}>Áp dụng</button>
          </div>
          {voucherError && <p className="form-error small">{voucherError}</p>}
          {voucher && <p className="voucher-applied">✓ Đã áp dụng "{voucher.code}" — {voucher.label}</p>}

          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatVnd(totalPrice)}</span>
          </div>
          {voucher && (
            <div className="summary-row discount">
              <span>Giảm giá</span>
              <span>-{formatVnd(voucher.discount)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Tổng cộng</span>
            <span>{formatVnd(finalTotal)}</span>
          </div>
          <button type="submit" form="checkout-form" className="btn-primary full">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  )
}
