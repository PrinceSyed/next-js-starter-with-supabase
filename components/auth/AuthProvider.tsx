'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithTwitter: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithTwitter = async () => {
    try {
      console.log('Starting Twitter OAuth...')
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Current origin:', window.location.origin)
      console.log('Supabase client config:', {
        url: supabase.supabaseUrl,
        key: supabase.supabaseKey ? 'Set' : 'Missing'
      })
      
      console.log('About to call signInWithOAuth...')
      
      // Try with manual OAuth URL construction to avoid the client bug
      const oauthUrl = `${supabase.supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
      console.log('Manual OAuth URL:', oauthUrl)
      
      // Redirect to the OAuth URL directly
      window.location.href = oauthUrl
      console.log('OAuth redirect initiated')
      
    } catch (error) {
      console.error('Twitter sign in failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithTwitter,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 