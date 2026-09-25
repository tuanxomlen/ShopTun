import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    const result = login(form)
    if (!result.ok) { setError(result.message); return }
    navigate(location.state?.from || '/')
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={onSubmit}>
        <h1>Đăng nhập</h1>
        <p className="auth-sub">Đăng nhập để tiếp tục mua sắm tại Shoptun</p>
        {error && <p className="form-error">{error}</p>}

        <label>Email</label>
        <input type="email" name="email" required value={form.email} onChange={onChange} />

        <label>Mật khẩu</label>
        <input type="password" name="password" required value={form.password} onChange={onChange} />

        <button className="btn-primary full" type="submit">Đăng nhập</button>
        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  )
}
