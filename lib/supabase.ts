import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable')
}

// Ensure URL is properly formatted
const normalizedUrl = supabaseUrl.replace(/\/$/, '') // Remove trailing slash if present

// Add debugging for client-side
if (typeof window !== 'undefined') {
  console.log('Client-side Supabase config:', {
    url: normalizedUrl,
    keyExists: !!supabasePublishableKey,
    keyPrefix: supabasePublishableKey?.substring(0, 10) + '...'
  })
}

export const supabase = createClient(normalizedUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
}) 