import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!anonKey
        }
      })
    }

    // Create client with PKCE
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })

    // Test 1: Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    // Test 2: Check OAuth URL generation
    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Authentication diagnostic completed',
      details: {
        environment: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!anonKey,
          url: supabaseUrl?.substring(0, 50) + '...'
        },
        session: {
          hasSession: !!session,
          sessionError: sessionError?.message || null,
          userEmail: session?.user?.email || null
        },
        oauth: {
          hasOAuthUrl: !!oauthData.url,
          oauthError: oauthError?.message || null,
          oauthUrl: oauthData.url?.substring(0, 100) + '...'
        },
        configuration: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          autoRefreshToken: true,
          persistSession: true
        }
      },
      recommendations: [
        '1. Check if the OAuth URL is being generated correctly',
        '2. Verify that the callback route is working',
        '3. Ensure Supabase client can detect sessions',
        '4. Test the complete OAuth flow'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Diagnostic failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 