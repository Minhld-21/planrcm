'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { getCurrentUser, getGoogleLoginUrl, logout, type AuthUser } from '@/lib/api'

type AuthStatus = 'loading' | 'authenticated' | 'guest'

type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  googleOAuthEnabled: boolean
  error: string | null
  signIn: (returnTo?: string) => void
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [googleOAuthEnabled, setGoogleOAuthEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void getCurrentUser()
      .then((session) => {
        if (!active) {
          return
        }

        setUser(session.user)
        setGoogleOAuthEnabled(session.googleOAuthEnabled)
        setStatus(session.user ? 'authenticated' : 'guest')
      })
      .catch(() => {
        if (!active) {
          return
        }

        setStatus('guest')
      })

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback((returnTo = '/') => {
    if (!googleOAuthEnabled) {
      setError('Đăng nhập Google chưa được cấu hình. Vui lòng thử lại sau.')
      return
    }

    window.location.assign(getGoogleLoginUrl(returnTo))
  }, [googleOAuthEnabled])

  const signOut = useCallback(async () => {
    setError(null)

    try {
      await logout()
      setUser(null)
      setStatus('guest')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Không thể đăng xuất. Vui lòng thử lại.')
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      status,
      googleOAuthEnabled,
      error,
      signIn,
      signOut,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
