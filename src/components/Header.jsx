import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { categories } from '../data/products.js'

export default function Header({ search, onSearch }) {
  const { user, logout } = useAuth()
  const { totalQty } = useCart()
  const { ids: wishIds } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState(search || '')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const submitSearch = (e) => {
    e.preventDefault()
    navigate('/')
    onSearch?.(query)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const navItems = [
    { to: '/', icon: '⌂', label: 'Trang chủ' },
    { to: '/sales', icon: '⚡', label: 'Sales' },
    { to: '/notifications', icon: '🔔', label: 'Thông báo' },
    { to: '/me', icon: '👤', label: 'Tôi' },
  ]

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <div className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span>Hotline hỗ trợ: 1900 6035</span>
          <span className="topbar-right">
            <Link to="/orders">Đơn hàng của tôi</Link>
            <span className="sep">|</span>
            <a href="#" onClick={(e) => e.preventDefault()}>Kênh người bán</a>
          </span>
        </div>
      </div>

      <div className="header-main">
        <Link to="/" className="brand" onClick={() => { setQuery(''); onSearch?.('') }}>
          Shop<span>tun</span>
        </Link>

        <form className="search-bar" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Tìm sản phẩm, thương hiệu và tên shop"
            value={query}
            onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value) }}
          />
          <button type="submit" aria-label="Tìm kiếm">🔍</button>
        </form>

        <div className="header-icons">
          <Link to="/wishlist" className="icon-link">
            <span className="icon">♡</span>
            {wishIds.length > 0 && <span className="badge">{wishIds.length}</span>}
            <span className="icon-label">Yêu thích</span>
          </Link>

          <Link to="/cart" className="icon-link">
            <span className="icon">🛒</span>
            {totalQty > 0 && <span className="badge">{totalQty}</span>}
            <span className="icon-label">Giỏ hàng</span>
          </Link>

          {user ? (
            <div className="user-menu">
              <button
                type="button"
                className="avatar avatar-button"
                aria-label="Mở menu tài khoản"
                aria-expanded={showUserMenu}
                onClick={() => setShowUserMenu((value) => !value)}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {showUserMenu && (
                <div className="user-dropdown user-dropdown-open">
                  <p className="user-name">Xin chào, {user.name}</p>
                  <Link to="/me" onClick={() => setShowUserMenu(false)}>Tài khoản của tôi</Link>
                  <Link to="/orders" onClick={() => setShowUserMenu(false)}>Đơn hàng của tôi</Link>
                  <button type="button" className="logout-menu-btn" onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register" className="btn-outline small">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>

      {/* Thanh điều hướng chính được đưa lên phía trên nội dung */}
      <nav className="main-nav" aria-label="Điều hướng ShopTun">
        <div className="main-nav-inner">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={isActive(item.to) ? 'main-nav-link active' : 'main-nav-link'}>
              <span className="main-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
