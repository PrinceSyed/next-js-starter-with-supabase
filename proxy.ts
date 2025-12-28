import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Only handle auth-related routes
  if (!req.nextUrl.pathname.startsWith('/auth')) {
    return res
  }

  // For OAuth callback, we need to ensure proper headers and session handling
  if (req.nextUrl.pathname === '/auth/callback') {
    // Get the code from the URL
    const code = req.nextUrl.searchParams.get('code')
    const error = req.nextUrl.searchParams.get('error')

    // Log the callback for debugging
    console.log('Proxy - Auth callback:', {
      pathname: req.nextUrl.pathname,
      hasCode: !!code,
      hasError: !!error,
      searchParams: req.nextUrl.searchParams.toString()
    })

    // Set CORS headers for OAuth callbacks
    res.headers.set('Access-Control-Allow-Origin', '*')
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}



