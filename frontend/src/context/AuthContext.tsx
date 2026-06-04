import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'
import { User, RegisterData, AuthContextType } from '../types'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('access')) {
      api.get<User>('/api/auth/me/')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post<{ access: string; refresh: string }>('/api/auth/login/', { email, password })
    localStorage.setItem('access', res.data.access)
    localStorage.setItem('refresh', res.data.refresh)
    const profile = await api.get<User>('/api/auth/me/')
    setUser(profile.data)
    return profile.data
  }

  const register = async (data: RegisterData): Promise<User> => {
    await api.post('/api/auth/register/', data)
    return login(data.email, data.password)
  }

  const logout = async (): Promise<void> => {
    try {
      const refresh = localStorage.getItem('refresh')
      if (refresh) await api.post('/api/auth/logout/', { refresh })
    } finally {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
