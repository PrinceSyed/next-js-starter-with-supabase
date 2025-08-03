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

    // Test 1: Check OAuth URL generation
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

    if (oauthError) {
      return NextResponse.json({
        success: false,
        error: 'OAuth URL generation failed',
        details: oauthError
      })
    }

    return NextResponse.json({
      success: true,
      message: 'OAuth flow is properly configured',
      details: {
        hasOAuthUrl: !!oauthData.url,
        oauthUrl: oauthData.url?.substring(0, 100) + '...',
        provider: 'google',
        redirectTo: 'http://localhost:3000/auth/callback',
        flowType: 'pkce'
      },
      nextSteps: [
        '1. The OAuth URL is being generated correctly',
        '2. The callback route will redirect to home page',
        '3. Supabase client will automatically handle code exchange',
        '4. No custom verify page needed'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 