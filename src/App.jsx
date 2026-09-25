import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Header from './components/Header.jsx'
import RequireAuth from './components/RequireAuth.jsx'

import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Orders from './pages/Orders.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Sales from './pages/Sales.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'

function Shell() {
  const [search, setSearch] = useState('')
  return (
    <>
      <Header search={search} onSearch={setSearch} />
      <main className="app">
        <Routes>
          <Route path="/" element={<Home search={search} />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">Shoptun</p>
            <p>Nền tảng mua sắm demo — bài tập DevOps (Docker &amp; CI/CD).</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Chăm sóc khách hàng</h4>
              <p>Trung tâm hỗ trợ</p>
              <p>Hướng dẫn mua hàng</p>
              <p>Chính sách đổi trả</p>
            </div>
            <div>
              <h4>Về Shoptun</h4>
              <p>Giới thiệu</p>
              <p>Tuyển dụng</p>
              <p>Điều khoản</p>
            </div>
          </div>
        </div>
        <p className="footer-copy">© 2026 Shoptun. Đây là dự án học tập, không phải website thương mại thật.</p>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <Shell />
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}
