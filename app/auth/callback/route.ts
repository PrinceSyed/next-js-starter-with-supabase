import { NextRequest, NextResponse } from 'next/server'

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
    url: request.url,
    origin: requestUrl.origin,
    pathname: requestUrl.pathname,
    searchParams: requestUrl.searchParams.toString()
  })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    console.error('Full error details:', { error, errorDescription, state, url: request.url })
    return NextResponse.redirect(
      `${requestUrl.origin}?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`
    )
  }

  // For successful OAuth flows, let Supabase handle the code exchange automatically
  // The client-side library will detect the code in the URL and handle the exchange
  if (code) {
    console.log('OAuth code received, redirecting to home for automatic code exchange...')
    console.log('Code length:', code.length)
    console.log('State:', state)
    
    // Redirect to home page with the code in the URL so Supabase can detect it
    const redirectUrl = new URL(requestUrl.origin)
    redirectUrl.searchParams.set('code', code)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }
    
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl.toString())
  }

  // No code or error - redirect to home
  console.log('No code or error in callback, redirecting to home')
  return NextResponse.redirect(requestUrl.origin)
} 