import { useCallback, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/http'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(() => Boolean(tokenStorage.get()))

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    if (!tokenStorage.get()) return
    authService.me().then(setUser).catch(logout).finally(() => setLoading(false))
  }, [logout])

  
  useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])

  async function login(email, password) {
    tokenStorage.set(await authService.login(email, password))
    setUser(await authService.me())
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}