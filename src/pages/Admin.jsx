import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/products.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatVnd } from '../utils.js'

const emptyProduct = {
  name: '', category: 'ao', price: 0, originalPrice: 0, stock: 0,
  imageUrl: '', emoji: '👕', desc: '', freeship: true
}

const emptyVoucher = {
  code: '', label: '', type: 'percent', value: 10, minTotal: 0, active: true
}

export default function Admin() {
  const { user } = useAuth()
  const { products, setProducts, vouchers, setVouchers } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderSearch, setOrderSearch] = useState('')
  const [notice, setNotice] = useState('')

  // Khi mở form thêm/sửa sản phẩm, hiển thị ảnh hiện tại của sản phẩm.
  useEffect(() => {
    setImagePreview(editingProduct?.imageUrl || '')
  }, [editingProduct])

  const users = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('sa_users') || '[]') } catch { return [] }
  }, [notice, tab])

  if (!user?.isAdmin) {
    return (
      <div className="admin-denied">
        <div className="admin-denied-card">
          <div className="admin-denied-icon">🔒</div>
          <h1>Không có quyền truy cập</h1>
          <p>Khu vực này chỉ dành cho tài khoản quản trị ShopTun.</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Đăng nhập admin</button>
        </div>
      </div>
    )
  }

  const showNotice = (message) => {
    setNotice(message)
    setTimeout(() => setNotice(''), 2200)
  }

  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  )

  const voucherList = Object.entries(vouchers).map(([code, data]) => ({ code, ...data }))

  const orders = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('sa_orders') || '[]').slice().reverse()
    } catch {
      return []
    }
  }, [notice, tab])

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.trim().toLowerCase()
    if (!q) return true
    return `${o.id} ${o.userEmail || ''} ${o.userName || ''} ${o.customer?.fullName || ''} ${o.customer?.phone || ''}`.toLowerCase().includes(q)
  })

  // Đọc ảnh từ máy và nén về JPEG để LocalStorage không bị đầy quá nhanh.
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showNotice('Vui lòng chọn file hình ảnh.')
      return
    }

    // Giới hạn file gốc 10MB để tránh trình duyệt bị quá tải.
    if (file.size > 10 * 1024 * 1024) {
      showNotice('Ảnh quá lớn. Vui lòng chọn ảnh dưới 10MB.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxSize = 1200
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.82)
        setImagePreview(compressed)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const saveProduct = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const imageUrl = imagePreview || form.get('imageUrl').trim()
    const data = {
      name: form.get('name').trim(),
      category: form.get('category'),
      price: Number(form.get('price')),
      originalPrice: Number(form.get('originalPrice')),
      stock: Number(form.get('stock')),
      imageUrl,
      emoji: form.get('emoji') || '🛍️',
      desc: form.get('desc').trim(),
      freeship: form.get('freeship') === 'on',
      color: '#eef5f5',
      rating: editingProduct?.rating ?? 5,
      reviewCount: editingProduct?.reviewCount ?? 0,
      sold: editingProduct?.sold ?? 0,
      variants: editingProduct?.variants ?? { colors: ['Đen', 'Trắng'], sizes: ['M', 'L', 'XL'] },
      reviews: editingProduct?.reviews ?? [],
    }

    if (!data.name || data.price < 0 || data.stock < 0) {
      showNotice('Vui lòng kiểm tra tên, giá và số lượng.')
      return
    }

    if (editingProduct?.id) {
      setProducts(products.map((p) => p.id === editingProduct.id ? { ...p, ...data } : p))
      showNotice('Đã cập nhật sản phẩm.')
    } else {
      const nextId = Math.max(0, ...products.map((p) => Number(p.id) || 0)) + 1
      setProducts([...products, { ...data, id: nextId }])
      showNotice('Đã thêm sản phẩm mới.')
    }
    setEditingProduct(null)
  }

  const deleteProduct = (id) => {
    if (!confirm('Xóa sản phẩm này khỏi ShopTun?')) return
    setProducts(products.filter((p) => p.id !== id))
    showNotice('Đã xóa sản phẩm.')
  }

  const quickUpdateStock = (id, delta) => {
    setProducts(products.map((p) => p.id === id
      ? { ...p, stock: Math.max(0, Number(p.stock || 0) + delta) }
      : p
    ))
  }

  const saveVoucher = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const code = form.get('code').trim().toUpperCase()
    const value = Number(form.get('value'))
    const minTotal = Number(form.get('minTotal') || 0)
    if (!code || value <= 0) {
      showNotice('Mã và giá trị voucher không hợp lệ.')
      return
    }

    const next = { ...vouchers }
    next[code] = {
      label: form.get('label').trim() || `Ưu đãi ${code}`,
      type: form.get('type'),
      value,
      ...(minTotal > 0 ? { minTotal } : {}),
      active: form.get('active') === 'on',
    }
    setVouchers(next)
    setEditingVoucher(null)
    showNotice('Đã lưu voucher.')
  }

  const deleteVoucher = (code) => {
    if (!confirm(`Xóa voucher ${code}?`)) return
    const next = { ...vouchers }
    delete next[code]
    setVouchers(next)
    showNotice('Đã xóa voucher.')
  }

  const toggleUserAdmin = (email) => {
    try {
      const all = JSON.parse(localStorage.getItem('sa_users') || '[]')
      const next = all.map((u) => u.email === email ? { ...u, isAdmin: !u.isAdmin } : u)
      localStorage.setItem('sa_users', JSON.stringify(next))
      showNotice('Đã cập nhật quyền user.')
    } catch {}
  }

  const deleteUser = (email) => {
    if (email === user.email) {
      showNotice('Không thể xóa tài khoản admin đang đăng nhập.')
      return
    }
    if (!confirm(`Xóa tài khoản ${email}?`)) return
    try {
      const all = JSON.parse(localStorage.getItem('sa_users') || '[]')
      localStorage.setItem('sa_users', JSON.stringify(all.filter((u) => u.email !== email)))
      showNotice('Đã xóa user.')
    } catch {}
  }

  const stats = {
    products: products.length,
    stock: products.reduce((s, p) => s + Number(p.stock || 0), 0),
    users: users.length,
    vouchers: voucherList.length,
    orders: orders.length,
  }

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <p className="admin-kicker">SHOP TUN ADMIN</p>
          <h1>Quản trị cửa hàng</h1>
          <p>Xin chào <strong>{user.name}</strong> — quản lý dữ liệu ShopTun tại đây.</p>
        </div>
        <button className="btn-outline" onClick={() => navigate('/')}>← Về cửa hàng</button>
      </div>

      {notice && <div className="admin-notice">✓ {notice}</div>}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {[
            ['dashboard', '📊', 'Tổng quan'],
            ['products', '📦', 'Sản phẩm'],
            ['users', '👥', 'Người dùng'],
            ['vouchers', '🎟️', 'Voucher'],
            ['orders', '🧾', 'Đơn hàng'],
          ].map(([key, icon, label]) => (
            <button key={key} className={tab === key ? 'admin-nav active' : 'admin-nav'} onClick={() => setTab(key)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </aside>

        <section className="admin-content">
          {tab === 'dashboard' && (
            <>
              <h2>Tổng quan</h2>
              <div className="admin-stat-grid">
                <div className="admin-stat"><span>📦</span><small>Sản phẩm</small><strong>{stats.products}</strong></div>
                <div className="admin-stat"><span>🏷️</span><small>Tồn kho</small><strong>{stats.stock}</strong></div>
                <div className="admin-stat"><span>👥</span><small>Người dùng</small><strong>{stats.users}</strong></div>
                <div className="admin-stat"><span>🎟️</span><small>Voucher</small><strong>{stats.vouchers}</strong></div>
                <div className="admin-stat"><span>🧾</span><small>Đơn hàng</small><strong>{stats.orders}</strong></div>
              </div>
              <div className="admin-info-box">
                <h3>Chức năng quản trị</h3>
                <p>• Thêm, sửa, xóa sản phẩm</p>
                <p>• Điều chỉnh giá bán, giá gốc và số lượng tồn kho</p>
                <p>• Quản lý tài khoản và quyền admin</p>
                <p>• Tạo, sửa, xóa và bật/tắt voucher</p>
                <p>• Dữ liệu demo được lưu trong LocalStorage của trình duyệt</p>
              </div>
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="admin-section-head">
                <div>
                  <h2>Danh sách sản phẩm</h2>
                  <p>{products.length} sản phẩm trong cửa hàng</p>
                </div>
                <button className="btn-primary" onClick={() => setEditingProduct(emptyProduct)}>+ Thêm sản phẩm</button>
              </div>
              <div className="admin-toolbar">
                <input placeholder="Tìm sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Đã bán</th><th>Thao tác</th></tr></thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td><div className="admin-product"><img src={p.imageUrl} alt="" /><div><strong>{p.name}</strong><small>ID: {p.id}</small></div></div></td>
                        <td>{categories.find((c) => c.id === p.category)?.name || p.category}</td>
                        <td><strong className="admin-price">{formatVnd(p.price)}</strong><small className="admin-old-price">{formatVnd(p.originalPrice)}</small></td>
                        <td>
                          <div className="stock-control">
                            <button onClick={() => quickUpdateStock(p.id, -1)}>−</button>
                            <strong>{p.stock}</strong>
                            <button onClick={() => quickUpdateStock(p.id, 1)}>+</button>
                          </div>
                        </td>
                        <td>{p.sold || 0}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-edit" onClick={() => setEditingProduct(p)}>Sửa</button>
                            <button className="admin-delete" onClick={() => deleteProduct(p.id)}>Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {editingProduct && (
                <div className="admin-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setEditingProduct(null)}>
                  <form className="admin-modal" onSubmit={saveProduct}>
                    <div className="modal-head"><h2>{editingProduct.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2><button type="button" onClick={() => setEditingProduct(null)}>×</button></div>
                    <div className="admin-form-grid">
                      <label>Tên sản phẩm<input name="name" required defaultValue={editingProduct.name} /></label>
                      <label>Danh mục<select name="category" defaultValue={editingProduct.category}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                      <label>Giá bán (₫)<input name="price" type="number" min="0" required defaultValue={editingProduct.price} /></label>
                      <label>Giá gốc (₫)<input name="originalPrice" type="number" min="0" required defaultValue={editingProduct.originalPrice} /></label>
                      <label>Số lượng<input name="stock" type="number" min="0" required defaultValue={editingProduct.stock} /></label>
                      <label>Emoji<input name="emoji" defaultValue={editingProduct.emoji || '🛍️'} /></label>
                      <label className="full-field">Link hình ảnh (tùy chọn)<input name="imageUrl" defaultValue={editingProduct.imageUrl?.startsWith('data:') ? '' : editingProduct.imageUrl} placeholder="https://..." /></label>
                      <div className="full-field admin-upload-box">
                        <span>Hoặc tải ảnh từ máy tính</span>
                        <input name="productImageFile" type="file" accept="image/*" onChange={handleImageUpload} />
                        {imagePreview ? (
                          <div className="admin-image-preview">
                            <img src={imagePreview} alt="Xem trước sản phẩm" />
                            <button type="button" className="admin-delete" onClick={() => setImagePreview('')}>Xóa ảnh</button>
                          </div>
                        ) : (
                          <small>Chọn JPG, PNG, WEBP... Ảnh sẽ được lưu cùng sản phẩm trong trình duyệt.</small>
                        )}
                      </div>
                      <label className="full-field">Mô tả<textarea name="desc" rows="4" defaultValue={editingProduct.desc} /></label>
                      <label className="check-field"><input name="freeship" type="checkbox" defaultChecked={editingProduct.freeship !== false} /> Miễn phí vận chuyển</label>
                    </div>
                    <div className="modal-actions"><button type="button" className="btn-outline" onClick={() => setEditingProduct(null)}>Hủy</button><button className="btn-primary">Lưu sản phẩm</button></div>
                  </form>
                </div>
              )}
            </>
          )}

          {tab === 'users' && (
            <>
              <div className="admin-section-head"><div><h2>Quản lý người dùng</h2><p>{users.length} tài khoản</p></div></div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Họ tên</th><th>Email</th><th>Quyền</th><th>Thao tác</th></tr></thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td><span className={u.isAdmin ? 'role-badge admin' : 'role-badge'}>{u.isAdmin ? 'ADMIN' : 'USER'}</span></td>
                        <td><div className="admin-actions">
                          <button className="admin-edit" onClick={() => toggleUserAdmin(u.email)}>{u.isAdmin ? 'Hạ quyền' : 'Cấp admin'}</button>
                          <button className="admin-delete" onClick={() => deleteUser(u.email)}>Xóa</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'vouchers' && (
            <>
              <div className="admin-section-head">
                <div><h2>Quản lý voucher</h2><p>{voucherList.length} mã giảm giá</p></div>
                <button className="btn-primary" onClick={() => setEditingVoucher(emptyVoucher)}>+ Thêm voucher</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Mã</th><th>Nội dung</th><th>Loại</th><th>Giá trị</th><th>Đơn tối thiểu</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                  <tbody>
                    {voucherList.map((v) => (
                      <tr key={v.code}>
                        <td><strong>{v.code}</strong></td><td>{v.label}</td>
                        <td>{v.type === 'percent' ? 'Phần trăm' : 'Tiền cố định'}</td>
                        <td>{v.type === 'percent' ? `${v.value}%` : formatVnd(v.value)}</td>
                        <td>{v.minTotal ? formatVnd(v.minTotal) : 'Không'}</td>
                        <td><span className={v.active !== false ? 'role-badge active' : 'role-badge'}>{v.active !== false ? 'Đang bật' : 'Tắt'}</span></td>
                        <td><div className="admin-actions"><button className="admin-edit" onClick={() => setEditingVoucher(v)}>Sửa</button><button className="admin-delete" onClick={() => deleteVoucher(v.code)}>Xóa</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {editingVoucher && (
                <div className="admin-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setEditingVoucher(null)}>
                  <form className="admin-modal" onSubmit={saveVoucher}>
                    <div className="modal-head"><h2>{editingVoucher.code ? 'Sửa voucher' : 'Thêm voucher'}</h2><button type="button" onClick={() => setEditingVoucher(null)}>×</button></div>
                    <div className="admin-form-grid">
                      <label>Mã voucher<input name="code" required defaultValue={editingVoucher.code} /></label>
                      <label>Loại<select name="type" defaultValue={editingVoucher.type}><option value="percent">Giảm theo %</option><option value="flat">Giảm tiền</option></select></label>
                      <label>Mô tả<input name="label" required defaultValue={editingVoucher.label} /></label>
                      <label>Giá trị<input name="value" type="number" min="1" required defaultValue={editingVoucher.value} /></label>
                      <label>Đơn tối thiểu<input name="minTotal" type="number" min="0" defaultValue={editingVoucher.minTotal || 0} /></label>
                      <label className="check-field"><input name="active" type="checkbox" defaultChecked={editingVoucher.active !== false} /> Đang hoạt động</label>
                    </div>
                    <div className="modal-actions"><button type="button" className="btn-outline" onClick={() => setEditingVoucher(null)}>Hủy</button><button className="btn-primary">Lưu voucher</button></div>
                  </form>
                </div>
              )}
            </>
          )}

          {tab === 'orders' && (
            <>
              <div className="admin-section-head">
                <div><h2>Quản lý đơn hàng</h2><p>{orders.length} đơn hàng trong hệ thống</p></div>
              </div>
              <div className="admin-toolbar">
                <input placeholder="Tìm mã đơn, tên, email hoặc số điện thoại..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} />
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th><th>Chi tiết</th></tr></thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan="7" className="admin-empty-cell">Chưa có đơn hàng phù hợp.</td></tr>
                    ) : filteredOrders.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong><small>{o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : ''}</small></td>
                        <td><strong>{o.customer?.fullName || o.userName || 'Khách'}</strong><small>{o.userEmail || 'Chưa lưu email'}</small></td>
                        <td>{o.items?.length || 0} sản phẩm</td>
                        <td><strong className="admin-price">{formatVnd(o.total)}</strong></td>
                        <td>{o.customer?.payment === 'transfer' ? 'Chuyển khoản' : 'COD'}</td>
                        <td><span className="role-badge active">{o.status || 'Đang xử lý'}</span></td>
                        <td><button className="admin-edit" onClick={() => setSelectedOrder(o)}>Xem chi tiết</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedOrder && (
                <div className="admin-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
                  <div className="admin-modal admin-order-modal">
                    <div className="modal-head">
                      <div><h2>Chi tiết đơn hàng</h2><small>{selectedOrder.id}</small></div>
                      <button type="button" onClick={() => setSelectedOrder(null)}>×</button>
                    </div>
                    <div className="admin-order-customer">
                      <h3>👤 Thông tin khách hàng</h3>
                      <div className="admin-order-grid">
                        <div><small>Họ tên</small><strong>{selectedOrder.customer?.fullName || selectedOrder.userName || '—'}</strong></div>
                        <div><small>Email</small><strong>{selectedOrder.userEmail || '—'}</strong></div>
                        <div><small>Số điện thoại</small><strong>{selectedOrder.customer?.phone || '—'}</strong></div>
                        <div><small>Thành phố</small><strong>{selectedOrder.customer?.city || '—'}</strong></div>
                        <div className="full-field"><small>Địa chỉ giao hàng</small><strong>{selectedOrder.customer?.address || '—'}</strong></div>
                      </div>
                    </div>

                    <h3>📦 Sản phẩm đã đặt</h3>
                    <div className="admin-order-items">
                      {(selectedOrder.items || []).map((item, index) => (
                        <div className="admin-order-item" key={item.key || item.id || index}>
                          <img src={item.imageUrl} alt={item.name} />
                          <div><strong>{item.name}</strong><small>SL: {item.qty} × {formatVnd(item.price)}</small></div>
                          <strong>{formatVnd(item.price * item.qty)}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="admin-order-summary">
                      <div><span>Tạm tính</span><strong>{formatVnd(selectedOrder.subtotal || 0)}</strong></div>
                      {selectedOrder.voucherCode && <div><span>Voucher ({selectedOrder.voucherCode})</span><strong>-{formatVnd(selectedOrder.discount || 0)}</strong></div>}
                      <div className="total"><span>Tổng thanh toán</span><strong>{formatVnd(selectedOrder.total || 0)}</strong></div>
                    </div>

                    <div className="admin-order-status">
                      <label>Trạng thái đơn hàng</label>
                      <select value={selectedOrder.status || 'Đang xử lý'} onChange={(e) => {
                        const status = e.target.value
                        const all = JSON.parse(localStorage.getItem('sa_orders') || '[]').map((o) => o.id === selectedOrder.id ? { ...o, status } : o)
                        localStorage.setItem('sa_orders', JSON.stringify(all))
                        setSelectedOrder({ ...selectedOrder, status })
                        showNotice('Đã cập nhật trạng thái đơn hàng.')
                      }}>
                        <option>Đang xử lý</option>
                        <option>Đã xác nhận</option>
                        <option>Đang giao</option>
                        <option>Đã giao</option>
                        <option>Đã hủy</option>
                      </select>
                    </div>

                    <div className="modal-actions"><button type="button" className="btn-outline" onClick={() => setSelectedOrder(null)}>Đóng</button></div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
