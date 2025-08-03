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

    // Test 1: Check if we can generate an OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate OAuth URL',
        details: {
          message: error.message,
          status: error.status,
          name: error.name
        }
      })
    }

    // Test 2: Analyze the generated URL
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
      scope: urlObj.searchParams.get('scope')
    }

    return NextResponse.json({
      success: true,
      oauthUrl: oauthUrl,
      analysis,
      recommendations: {
        ifNoCodeChallenge: 'PKCE is not properly configured - check Supabase OAuth settings',
        ifNoState: 'State parameter missing - this is required for security',
        ifNotGoogleUrl: 'OAuth URL is not pointing to Google - check provider configuration',
        ifNoClientId: 'Client ID missing - check Supabase OAuth configuration',
        ifWrongRedirectUri: 'Redirect URI mismatch - verify callback URL in Supabase dashboard'
      },
      nextSteps: [
        '1. If code_challenge is missing, check Supabase OAuth settings',
        '2. Verify Google OAuth 2.0 is enabled in Supabase dashboard',
        '3. Check that callback URL matches exactly: http://localhost:3000/auth/callback',
        '4. Ensure Google Cloud Console OAuth 2.0 settings are correct',
        '5. Test the OAuth URL in a browser to see if it redirects properly'
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