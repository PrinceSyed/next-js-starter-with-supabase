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

    // Create a fresh Supabase client for testing
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })

    // Test 1: Generate OAuth URL with PKCE
    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {}
      }
    })

    // Test 2: Check if we can get the OAuth URL
    let oauthUrl = null
    if (oauthData?.url) {
      oauthUrl = oauthData.url
      
      // Test 3: Make a request to the OAuth URL
      const response = await fetch(oauthUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      let responseBody = ''
      try {
        responseBody = await response.text()
      } catch (e) {
        responseBody = 'Could not read response body'
      }

      return NextResponse.json({
        success: true,
        oauthGeneration: {
          success: !oauthError,
          error: oauthError?.message,
          hasUrl: !!oauthData?.url,
          url: oauthUrl
        },
        oauthRequest: {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          isRedirect: response.status >= 300 && response.status < 400,
          locationHeader: response.headers.get('location'),
          hasGoogleRedirect: response.headers.get('location')?.includes('accounts.google.com'),
          bodyPreview: responseBody.substring(0, 200) + (responseBody.length > 200 ? '...' : ''),
          bodyLength: responseBody.length
        },
        analysis: {
          pkceFlowWorking: !oauthError && oauthData?.url,
          googleRedirectExpected: response.status >= 300 && response.status < 400,
          googleRedirectFound: response.headers.get('location')?.includes('accounts.google.com'),
          issue: oauthError ? 'OAuth URL generation failed' : 
                 response.status === 200 ? 'Google returning HTML instead of redirect' :
                 response.status >= 400 ? 'HTTP error from Google OAuth' : 'Unknown issue'
        },
        recommendations: [
          oauthError ? 'Check Supabase Google OAuth configuration' :
          response.status === 200 ? 'Google OAuth is not properly configured - check Google Cloud Console' :
          response.status >= 400 ? 'Check Google Cloud Console OAuth 2.0 settings' :
          'OAuth flow appears to be working correctly'
        ]
      })
    } else {
      return NextResponse.json({
        success: false,
        oauthGeneration: {
          success: false,
          error: oauthError?.message || 'No OAuth URL generated',
          hasUrl: false
        },
        analysis: {
          issue: 'OAuth URL generation failed',
          possibleCauses: [
            'Google OAuth not properly configured in Supabase',
            'Missing or incorrect Google Client ID/Secret',
            'Callback URL mismatch between Supabase and Google Cloud Console'
          ]
        }
      })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 