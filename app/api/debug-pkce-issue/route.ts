import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const serviceKey = process.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!anonKey,
          hasServiceKey: !!serviceKey
        }
      })
    }

    // Test 1: Client-side client with PKCE
    const clientSideClient = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })

    // Test 2: Server-side client with PKCE
    const serverSideClient = createClient(supabaseUrl, serviceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        flowType: 'pkce'
      }
    })

    // Test 3: Generate OAuth URL and check for PKCE parameters
    const { data: oauthData, error: oauthError } = await clientSideClient.auth.signInWithOAuth({
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
        details: {
          error: oauthError.message,
          code: oauthError.status,
          name: oauthError.name
        }
      })
    }

    // Analyze the OAuth URL for PKCE parameters
    const oauthUrl = oauthData.url
    const urlObj = new URL(oauthUrl)
    const codeChallenge = urlObj.searchParams.get('code_challenge')
    const codeChallengeMethod = urlObj.searchParams.get('code_challenge_method')
    const state = urlObj.searchParams.get('state')

    // Test 4: Check if we can access the session storage for PKCE
    const { data: sessionData } = await clientSideClient.auth.getSession()

    return NextResponse.json({
      success: true,
      analysis: {
        oauthUrlGenerated: !!oauthUrl,
        hasCodeChallenge: !!codeChallenge,
        codeChallengeMethod,
        hasState: !!state,
        oauthUrl: oauthUrl,
        urlAnalysis: {
          isGoogleUrl: oauthUrl.includes('accounts.google.com'),
          hasClientId: urlObj.searchParams.has('client_id'),
          hasRedirectUri: urlObj.searchParams.has('redirect_uri'),
          hasResponseType: urlObj.searchParams.get('response_type'),
          hasScope: urlObj.searchParams.has('scope')
        }
      },
      clientConfig: {
        clientSide: {
          flowType: 'pkce',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        serverSide: {
          flowType: 'pkce',
          autoRefreshToken: false,
          persistSession: false
        }
      },
      sessionInfo: {
        hasSession: !!sessionData.session,
        sessionUser: sessionData.session?.user?.email || null
      },
      troubleshooting: {
        pkceIssue: 'The "code verifier should be non-empty" error indicates:',
        possibleCauses: [
          '1. Code verifier not properly stored in browser storage during OAuth initiation',
          '2. Code verifier not retrieved during callback processing',
          '3. Browser storage issues (cookies/localStorage disabled)',
          '4. Supabase client configuration mismatch between client and server',
          '5. OAuth provider not properly configured for PKCE flow'
        ],
        recommendations: [
          '1. Ensure browser allows cookies and localStorage',
          '2. Check Supabase OAuth settings in dashboard',
          '3. Verify Google OAuth 2.0 configuration includes PKCE support',
          '4. Clear browser cache and try again',
          '5. Check if using incognito/private browsing mode'
        ],
        nextSteps: [
          '1. Test OAuth flow in a regular browser window (not incognito)',
          '2. Check browser console for storage-related errors',
          '3. Verify Supabase project settings',
          '4. Test with a different OAuth provider (Twitter, GitHub)',
          '5. Check if the issue persists with different browsers'
        ]
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 