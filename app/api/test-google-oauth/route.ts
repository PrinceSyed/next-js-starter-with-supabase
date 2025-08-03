import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    // Test the OAuth URL construction
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const redirectTo = 'http://localhost:3000/auth/callback'
    
    // Construct the OAuth URL manually to test
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`
    
    // Test if the URL is accessible - OAuth endpoints expect POST, not GET
    const response = await fetch(oauthUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    
    // Test with Supabase client to check provider configuration
    const supabase = createServerClient()
    let providerConfig = null
    try {
      // Try to get provider configuration (this might not be available via API)
      const { data: providers, error: providerError } = await supabase.auth.listIdentities()
      providerConfig = { providers, error: providerError?.message }
    } catch (e) {
      providerConfig = { error: 'Could not fetch provider config' }
    }
    
    return NextResponse.json({
      success: true,
      supabaseUrl,
      redirectTo,
      oauthUrl,
      responseStatus: response.status,
      responseOk: response.ok,
      responseStatusText: response.statusText,
      // Check environment variables
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasServiceKey: !!process.env.SUPABASE_SECRET_KEY,
      // Provider configuration
      providerConfig,
      // Recommendations
      recommendations: {
        missingServiceKey: !process.env.SUPABASE_SECRET_KEY ? 'Add SUPABASE_SECRET_KEY to .env.local' : null,
        expected405: response.status === 405 ? '405 is expected - OAuth endpoint exists but expects proper OAuth flow' : null,
        nextSteps: [
          'Ensure Google OAuth is enabled in Supabase Dashboard > Authentication > Providers',
          'Verify Google OAuth credentials are set in Supabase',
          'Check that callback URLs match between Google Cloud Console and Supabase'
        ]
      }
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