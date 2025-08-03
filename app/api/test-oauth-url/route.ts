import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const redirectTo = 'http://localhost:3001/auth/callback'
    
    // Construct the OAuth URL
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent(redirectTo)}`
    
    // Test if the URL is accessible
    const response = await fetch(oauthUrl, { method: 'HEAD' })
    
    return NextResponse.json({
      success: true,
      supabaseUrl,
      redirectTo,
      oauthUrl,
      responseStatus: response.status,
      responseOk: response.ok,
      responseText: response.statusText
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    }, { status: 500 })
  }
} 