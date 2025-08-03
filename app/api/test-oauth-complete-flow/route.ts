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

    // Test 1: Generate OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'OAuth URL generation failed',
        details: {
          message: error.message,
          status: error.status,
          name: error.name
        }
      })
    }

    // Test 2: Analyze the OAuth URL
    const oauthUrl = data.url
    const urlObj = new URL(oauthUrl)
    
    const analysis = {
      hasUrl: !!oauthUrl,
      isGoogleUrl: oauthUrl.includes('accounts.google.com'),
      hasCodeChallenge: !!urlObj.searchParams.get('code_challenge'),
      codeChallengeMethod: urlObj.searchParams.get('code_challenge_method'),
      hasState: !!urlObj.searchParams.get('state'),
      hasClientId: !!urlObj.searchParams.get('client_id'),
      hasRedirectUri: !!urlObj.searchParams.get('redirect_uri'),
      responseType: urlObj.searchParams.get('response_type'),
      scope: urlObj.searchParams.get('scope'),
      redirectUri: urlObj.searchParams.get('redirect_uri')
    }

    // Test 3: Check current session
    const { data: sessionData } = await supabase.auth.getSession()

    return NextResponse.json({
      success: true,
      oauthUrl: oauthUrl,
      analysis,
      sessionInfo: {
        hasSession: !!sessionData.session,
        sessionUser: sessionData.session?.user?.email || null
      },
      flowSteps: {
        step1: 'OAuth URL generated with PKCE parameters',
        step2: 'User redirected to Google OAuth',
        step3: 'Google redirects back to /auth/callback with code',
        step4: 'Callback redirects to /auth/verify with code',
        step5: 'Client-side code exchange using stored code verifier',
        step6: 'Session established and user redirected to home'
      },
      troubleshooting: {
        ifNoCodeChallenge: 'PKCE not configured - check Supabase OAuth settings',
        ifNoState: 'State parameter missing - security issue',
        ifWrongRedirectUri: 'Redirect URI mismatch - check Supabase dashboard',
        ifNotGoogleUrl: 'OAuth URL not pointing to Google - provider configuration issue',
        pkceFlow: 'The new flow uses client-side code exchange to access stored code verifier'
      },
      recommendations: [
        '1. Ensure Google OAuth 2.0 is enabled in Supabase dashboard',
        '2. Verify callback URL is exactly: http://localhost:3000/auth/callback',
        '3. Check Google Cloud Console OAuth 2.0 settings',
        '4. Test in regular browser window (not incognito)',
        '5. Clear browser cache and cookies if needed',
        '6. Check browser console for any errors'
      ],
      nextSteps: [
        '1. Test the OAuth URL in a browser',
        '2. Complete the OAuth flow manually',
        '3. Check if the new /auth/verify page works',
        '4. Monitor browser console for any errors',
        '5. Verify session is established after flow'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 