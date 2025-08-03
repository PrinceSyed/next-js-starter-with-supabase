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
      console.log('Getting initial session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      }
      
      console.log('Initial session:', session?.user?.email || 'No session')
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user')
        console.log('Full session data:', session)
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
      console.log('Redirect URL:', `${window.location.origin}/auth/callback`)
      
      // Validate environment variables
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
      }
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable')
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      })
      
      if (error) {
        console.error(`${provider} OAuth error:`, error)
        throw error
      }
      
      console.log(`${provider} OAuth initiated successfully:`, data)
      
      // If we have a URL, redirect to it
      if (data.url) {
        console.log(`Redirecting to OAuth URL: ${data.url}`)
        window.location.href = data.url
      } else {
        console.warn('No OAuth URL received from Supabase')
      }
      
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