import { createClient } from '@supabase/supabase-js'

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable')
}

if (!supabaseSecretKey) {
  throw new Error('Missing SUPABASE_SECRET_KEY environment variable')
}

// Client-side Supabase client (safe for browser)
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side Supabase admin client (only use in API routes, Server Components)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Utility function to check if we're on the server side
export const isServer = typeof window === 'undefined'

// Get the appropriate client based on context
export const getSupabaseClient = () => {
  return isServer ? supabaseAdmin : supabase
} 