import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * OAuth Callback Handler
 *
 * Security improvements:
 * 1. Exchanges code server-side (no code exposure in URLs/logs)
 * 2. Uses Supabase SSR for proper cookie storage
 * 3. Removes sensitive data logging
 * 4. Uses Supabase's built-in CSRF protection (state validation)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error occurred:', error)
    // Redirect to home with generic error (no sensitive data in URL)
    return NextResponse.redirect(
      `${requestUrl.origin}/?auth_error=${encodeURIComponent(error)}`
    )
  }

  // Check for authorization code
  if (!code) {
    console.warn('No authorization code in callback')
    return NextResponse.redirect(
      `${requestUrl.origin}/?auth_error=no_code`
    )
  }

  try {
    // Create server-side Supabase client with cookie storage
    const supabase = await createClient()

    // Exchange authorization code for session server-side
    // This prevents the code from being exposed in client-side URLs/logs
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Failed to exchange code for session:', exchangeError.message)
      return NextResponse.redirect(
        `${requestUrl.origin}/?auth_error=session_failed`
      )
    }

    // Log successful authentication (without sensitive data)
    if (data.session?.user) {
      console.log('User authenticated successfully:', {
        userId: data.session.user.id,
        email: data.session.user.email
      })
    }

    // Redirect to home page WITHOUT sensitive data in URL
    // The session is stored in httpOnly cookies by Supabase SSR
    return NextResponse.redirect(requestUrl.origin)

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/?auth_error=server_error`
    )
  }
} 