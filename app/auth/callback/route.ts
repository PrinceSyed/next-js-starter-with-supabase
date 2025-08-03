import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('Auth callback received:', { code: !!code, error, errorDescription })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${requestUrl.origin}?error=${error}&error_description=${errorDescription}`)
  }

  if (code) {
    try {
      console.log('Exchanging code for session...')
      const supabase = createServerClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Auth callback error:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}?error=exchange_failed&error_description=${exchangeError.message}`)
      }
      
      console.log('Session exchange successful:', data.session?.user?.email)
    } catch (error) {
      console.error('Auth callback failed:', error)
      return NextResponse.redirect(`${requestUrl.origin}?error=callback_failed&error_description=${error}`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
} 