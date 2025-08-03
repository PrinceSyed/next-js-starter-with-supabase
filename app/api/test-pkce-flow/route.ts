import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables'
      })
    }

    // Test 1: Create client-side style client (for OAuth URL generation)
    const clientSideClient = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })

    // Test 2: Create server-side style client (for callback handling)
    const serverSideClient = createClient(supabaseUrl, process.env.SUPABASE_SECRET_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        flowType: 'pkce'
      }
    })

    // Test 3: Generate OAuth URL with client-side client
    const { data: oauthData, error: oauthError } = await clientSideClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })

    return NextResponse.json({
      success: true,
      clientSideConfig: {
        hasFlowType: true,
        flowType: 'pkce',
        persistSession: true,
        detectSessionInUrl: true
      },
      serverSideConfig: {
        hasFlowType: true,
        flowType: 'pkce',
        persistSession: false,
        detectSessionInUrl: false
      },
      oauthGeneration: {
        success: !oauthError,
        hasUrl: !!oauthData?.url,
        error: oauthError?.message,
        urlHasPkce: oauthData?.url?.includes('code_challenge'),
        urlHasMethod: oauthData?.url?.includes('code_challenge_method=s256')
      },
      analysis: {
        configurationMatch: 'Both client and server have flowType: pkce',
        pkceGeneration: oauthData?.url?.includes('code_challenge') ? 'Working' : 'Failed',
        potentialIssue: 'Check if browser is clearing PKCE state between redirect and callback'
      },
      recommendations: [
        'Clear browser cache and localStorage',
        'Try incognito/private mode',
        'Check browser developer tools for errors during OAuth flow'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}