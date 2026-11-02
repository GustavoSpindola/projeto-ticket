import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  // Ao abrir o app, se já existe token, recupera o usuário
  useEffect(() => {
    if (!tokenStorage.get()) {
      setLoading(false)
      return
    }
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

export const useAuth = () => useContext(AuthContext)