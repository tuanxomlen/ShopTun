import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    const result = register(form)
    if (!result.ok) { setError(result.message); return }
    navigate('/')
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={onSubmit}>
        <h1>Tạo tài khoản Shoptun</h1>
        <p className="auth-sub">Đăng ký để lưu giỏ hàng và theo dõi đơn hàng</p>
        {error && <p className="form-error">{error}</p>}

        <label>Họ tên</label>
        <input type="text" name="name" required value={form.name} onChange={onChange} />

        <label>Email</label>
        <input type="email" name="email" required value={form.email} onChange={onChange} />

        <label>Mật khẩu</label>
        <input type="password" name="password" required minLength={4} value={form.password} onChange={onChange} />

        <button className="btn-primary full" type="submit">Đăng ký</button>
        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  )
}
