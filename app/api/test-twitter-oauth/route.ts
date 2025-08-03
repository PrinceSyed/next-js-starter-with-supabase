import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the OAuth URL construction
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const redirectTo = 'http://localhost:3000/auth/callback'
    
    // Construct the OAuth URL manually to test
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent(redirectTo)}`
    
    // Test if the URL is accessible - OAuth endpoints expect POST, not GET
    const response = await fetch(oauthUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    
    return NextResponse.json({
      success: true,
      supabaseUrl,
      redirectTo,
      oauthUrl,
      responseStatus: response.status,
      responseOk: response.ok,
      // Check environment variables
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasServiceKey: !!process.env.SUPABASE_SECRET_KEY
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasServiceKey: !!process.env.SUPABASE_SECRET_KEY
    }, { status: 500 })
  }
} 