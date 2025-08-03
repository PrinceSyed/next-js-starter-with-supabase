import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate what the client-side should be doing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    
    // Test the exact OAuth URL that should be generated
    const redirectTo = 'http://localhost:3000/auth/callback'
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent(redirectTo)}`
    
    // Test if this URL is accessible
    const response = await fetch(oauthUrl, { 
      method: 'GET',
      headers: {
        'apikey': supabaseKey || '',
        'Authorization': `Bearer ${supabaseKey || ''}`
      }
    })
    
    return NextResponse.json({
      success: true,
      supabaseUrl,
      hasKey: !!supabaseKey,
      oauthUrl,
      responseStatus: response.status,
      responseOk: response.ok,
      responseText: await response.text().catch(() => 'Could not read response')
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    }, { status: 500 })
  }
} 