'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithOAuth: (provider: 'twitter' | 'google' | 'github' | 'discord') => Promise<void>
  signInWithTwitter: () => Promise<void>
  signInWithGoogle: () => Promise<void>
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

  const signInWithOAuth = async (provider: 'twitter' | 'google' | 'github' | 'discord') => {
    try {
      console.log(`Starting ${provider} OAuth...`)
      console.log('Current origin:', window.location.origin)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // You can add additional OAuth parameters here if needed
          }
        }
      })
      
      if (error) {
        console.error(`${provider} OAuth error:`, error)
        throw error
      }
      
      console.log(`${provider} OAuth initiated successfully:`, data)
      
    } catch (error) {
      console.error(`${provider} sign in failed:`, error)
      throw error
    }
  }

  const signInWithTwitter = () => signInWithOAuth('twitter')
  const signInWithGoogle = () => signInWithOAuth('google')

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
    signInWithOAuth,
    signInWithTwitter,
    signInWithGoogle,
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