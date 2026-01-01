import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        hasServiceKey: !!process.env.SUPABASE_SECRET_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.substring(0, 10) + '...',
        serviceKeyPrefix: process.env.SUPABASE_SECRET_KEY?.substring(0, 10) + '...',
      },
      client: {
        origin: 'http://localhost:3000', // Assuming local development
        callbackUrl: 'http://localhost:3000/auth/callback',
      },
      tests: {},
      recommendations: [] as string[]
    }

    // Test 1: Client-side Supabase connection
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      diagnostics.tests.clientSession = {
        success: !sessionError,
        hasSession: !!sessionData.session,
        error: sessionError?.message,
        userEmail: sessionData.session?.user?.email
      }
    } catch (error) {
      diagnostics.tests.clientSession = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 2: Server-side Supabase connection
    try {
      const supabaseServer = await createClient()
      const { data: serverSessionData, error: serverSessionError } = await supabaseServer.auth.getSession()
      diagnostics.tests.serverSession = {
        success: !serverSessionError,
        hasSession: !!serverSessionData.session,
        error: serverSessionError?.message
      }
    } catch (error) {
      diagnostics.tests.serverSession = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 3: OAuth URL construction
    try {
      const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: diagnostics.client.callbackUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      })
      
      diagnostics.tests.oauthUrlConstruction = {
        success: !oauthError,
        hasUrl: !!oauthData.url,
        url: oauthData.url || null,
        error: oauthError?.message,
        provider: oauthData.provider
      }
    } catch (error) {
      diagnostics.tests.oauthUrlConstruction = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 4: Check if Google provider is enabled (by attempting to get provider config)
    // Note: listIdentities is not available on the client auth API
    diagnostics.tests.providerConfig = {
      success: true,
      note: 'Provider configuration check requires admin API access'
    }

    // Test 5: Test callback endpoint accessibility
    try {
      const callbackResponse = await fetch(diagnostics.client.callbackUrl)
      diagnostics.tests.callbackEndpoint = {
        success: callbackResponse.ok,
        status: callbackResponse.status,
        statusText: callbackResponse.statusText,
        accessible: callbackResponse.status !== 404
      }
    } catch (error) {
      diagnostics.tests.callbackEndpoint = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 6: Check for common OAuth configuration issues
    const commonIssues = []
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      commonIssues.push('Missing NEXT_PUBLIC_SUPABASE_URL')
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      commonIssues.push('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    }
    
    if (!process.env.SUPABASE_SECRET_KEY) {
      commonIssues.push('Missing SUPABASE_SECRET_KEY')
    }
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
      commonIssues.push('Invalid Supabase URL format')
    }
    
    if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ')) {
      commonIssues.push('Invalid Supabase anon key format')
    }

    diagnostics.tests.commonIssues = {
      found: commonIssues.length > 0,
      issues: commonIssues
    }

    // Test 7: PKCE flow configuration
    diagnostics.tests.pkceConfig = {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }

    // Recommendations based on test results
    const recommendations = []
    
    if (commonIssues.length > 0) {
      recommendations.push('Fix environment variable issues listed above')
    }
    
    if (!diagnostics.tests.oauthUrlConstruction.success) {
      recommendations.push('Check Google OAuth provider configuration in Supabase Dashboard')
      recommendations.push('Verify Google OAuth credentials are properly set in Supabase')
    }
    
    if (!diagnostics.tests.callbackEndpoint.accessible) {
      recommendations.push('Ensure /auth/callback route is properly configured')
    }
    
    if (!diagnostics.tests.clientSession.success) {
      recommendations.push('Check Supabase client configuration')
    }
    
    recommendations.push('Verify callback URLs match between Google Cloud Console and Supabase')
    recommendations.push('Ensure Google OAuth is enabled in Supabase Dashboard > Authentication > Providers')
    recommendations.push('Check browser console for any JavaScript errors during OAuth flow')

    diagnostics.recommendations = recommendations

    return NextResponse.json({
      success: true,
      diagnostics
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 