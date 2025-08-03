import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // For now, we'll handle auth on the client side
  // This avoids the environment variable issue with auth helpers
  return res
} 