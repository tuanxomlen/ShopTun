import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem('sa_users') || '[]') }
  catch { return [] }
}
const writeUsers = (users) => localStorage.setItem('sa_users', JSON.stringify(users))

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa_current_user') || 'null') }
    catch { return null }
  })

  const register = ({ name, email, password }) => {
    const users = readUsers()
    if (users.some((u) => u.email === email)) {
      return { ok: false, message: 'Email này đã được đăng ký.' }
    }
    const newUser = { name, email, password }
    writeUsers([...users, newUser])
    const publicUser = { name, email }
    localStorage.setItem('sa_current_user', JSON.stringify(publicUser))
    setUser(publicUser)
    return { ok: true }
  }

  const login = ({ email, password }) => {
    const users = readUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) return { ok: false, message: 'Sai email hoặc mật khẩu.' }
    const publicUser = { name: found.name, email: found.email }
    localStorage.setItem('sa_current_user', JSON.stringify(publicUser))
    setUser(publicUser)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem('sa_current_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
