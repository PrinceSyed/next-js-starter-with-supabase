import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const redirectTo = 'http://localhost:3000/auth/callback'

    // Test Google OAuth with PKCE flow
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`

    // Test with GET request (the actual OAuth flow)
    const response = await fetch(oauthUrl, { 
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    })

    // Get the response body
    let responseBody = ''
    try {
      responseBody = await response.text()
    } catch (e) {
      responseBody = 'Could not read response body'
    }

    // Check if there's a Location header (redirect to Google)
    const locationHeader = response.headers.get('location')

    return NextResponse.json({
      success: true,
      oauthUrl,
      response: {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        body: responseBody.substring(0, 500),
        hasLocationHeader: !!locationHeader,
        locationHeader: locationHeader
      },
      analysis: {
        isRedirect: response.status >= 300 && response.status < 400,
        hasGoogleRedirect: locationHeader && locationHeader.includes('accounts.google.com'),
        pkceIssue: responseBody.includes('code_verifier') || responseBody.includes('PKCE'),
        recommendations: [
          'If status is 302/303 with Google redirect URL, OAuth flow is working',
          'If status is 404, Google OAuth is not configured in Supabase',
          'If status is 400/500, there might be a PKCE configuration issue'
        ]
      },
      troubleshooting: {
        pkceError: 'The "code verifier should be non-empty" error suggests a PKCE flow issue',
        possibleCauses: [
          'Google OAuth not properly configured in Supabase',
          'Supabase client not configured for PKCE flow',
          'Callback URL mismatch between Google Cloud Console and Supabase'
        ],
        nextSteps: [
          '1. Check Google OAuth configuration in Supabase Dashboard',
          '2. Verify Google Cloud Console OAuth 2.0 settings',
          '3. Ensure callback URLs match exactly',
          '4. Check if Supabase client is using PKCE flow'
        ]
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 