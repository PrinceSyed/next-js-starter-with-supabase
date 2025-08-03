import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const state = requestUrl.searchParams.get('state')

  console.log('Auth callback received:', { 
    code: !!code, 
    error, 
    errorDescription, 
    state: !!state,
    url: request.url 
  })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`
    )
  }

  if (code) {
    try {
      console.log('Exchanging code for session...')
      const supabase = createServerClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Auth callback error:', exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}?error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`
        )
      }
      
      console.log('Session exchange successful:', {
        user: data.session?.user?.email,
        provider: data.session?.user?.app_metadata?.provider
      })
      
      // Set cookies for the session
      const response = NextResponse.redirect(requestUrl.origin)
      
      // Set the session cookie
      if (data.session) {
        response.cookies.set('sb-access-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.session.expires_in
        })
        
        response.cookies.set('sb-refresh-token', data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
      }
      
      return response
      
    } catch (error) {
      console.error('Auth callback failed:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}?error=callback_failed&error_description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`
      )
    }
  }

  // No code or error - redirect to home
  console.log('No code or error in callback, redirecting to home')
  return NextResponse.redirect(requestUrl.origin)
} 