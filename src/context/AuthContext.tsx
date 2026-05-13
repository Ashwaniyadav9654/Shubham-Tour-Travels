import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('stt_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin check
    if (email === 'admin@shubhamtravels.com' && password === 'admin@2024') {
      const adminUser: User = { id: 'admin-1', name: 'Admin', email, role: 'admin' }
      setUser(adminUser)
      localStorage.setItem('stt_user', JSON.stringify(adminUser))
      return true
    }
    // Demo user
    if (password.length >= 6) {
      const mockUser: User = { id: Date.now().toString(), name: email.split('@')[0], email, role: 'user' }
      setUser(mockUser)
      localStorage.setItem('stt_user', JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    const newUser: User = { id: Date.now().toString(), name, email, role: 'user' }
    setUser(newUser)
    localStorage.setItem('stt_user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('stt_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
