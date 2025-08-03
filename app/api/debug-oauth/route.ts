import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const serviceKey = process.env.SUPABASE_SECRET_KEY

    // Test 1: Basic URL validation
    const urlValidation = {
      supabaseUrl,
      isValidUrl: false,
      hasHttps: false,
      hasCorrectDomain: false
    }

    try {
      const url = new URL(supabaseUrl)
      urlValidation.isValidUrl = true
      urlValidation.hasHttps = url.protocol === 'https:'
      urlValidation.hasCorrectDomain = url.hostname.includes('supabase.co')
    } catch (e) {
      urlValidation.isValidUrl = false
    }

    // Test 2: Test different OAuth endpoints
    const oauthTests = {}
    
    const providers = ['twitter', 'google', 'github']
    const testUrls = [
      `${supabaseUrl}/auth/v1/authorize`,
      `${supabaseUrl}/auth/v1/callback`,
      `${supabaseUrl}/auth/v1/token`,
      `${supabaseUrl}/auth/v1/user`,
      `${supabaseUrl}/rest/v1/`,
      `${supabaseUrl}/`
    ]

    for (const testUrl of testUrls) {
      try {
        const response = await fetch(testUrl, { 
          method: 'HEAD',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        })
        oauthTests[testUrl] = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        }
      } catch (error) {
        oauthTests[testUrl] = {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Test 3: Test OAuth URL construction
    const oauthUrlTests = {}
    const redirectTo = 'http://localhost:3000/auth/callback'
    
    for (const provider of providers) {
      const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`
      
      try {
        const response = await fetch(oauthUrl, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          },
          body: JSON.stringify({})
        })
        
        oauthUrlTests[provider] = {
          url: oauthUrl,
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        }
      } catch (error) {
        oauthUrlTests[provider] = {
          url: oauthUrl,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Test 4: Test Supabase client
    let clientTest = { success: false, error: null, session: null }
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.auth.getSession()
      clientTest = {
        success: !error,
        error: error?.message || null,
        session: data.session ? 'exists' : 'none'
      }
    } catch (e) {
      clientTest = {
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error',
        session: 'error'
      }
    }

    // Test 5: Check environment variables
    const envCheck = {
      supabaseUrl: !!supabaseUrl,
      anonKey: !!anonKey,
      serviceKey: !!serviceKey,
      anonKeyPrefix: anonKey ? anonKey.substring(0, 10) + '...' : null,
      serviceKeyPrefix: serviceKey ? serviceKey.substring(0, 10) + '...' : null
    }

    // Generate recommendations
    const recommendations = []
    
    if (!urlValidation.isValidUrl) {
      recommendations.push('Invalid Supabase URL format')
    }
    
    if (!urlValidation.hasHttps) {
      recommendations.push('Supabase URL should use HTTPS')
    }
    
    if (!urlValidation.hasCorrectDomain) {
      recommendations.push('Supabase URL should be from supabase.co domain')
    }

    if (!envCheck.anonKey) {
      recommendations.push('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    }

    if (!envCheck.serviceKey) {
      recommendations.push('Missing SUPABASE_SECRET_KEY')
    }

    // Check for specific error patterns
    const has405Errors = Object.values(oauthUrlTests).some(test => 
      test.status === 405 || (test.error && test.error.includes('405'))
    )
    
    if (has405Errors) {
      recommendations.push('405 errors are expected for OAuth endpoints - this is normal')
    }

    const hasPathErrors = Object.values(oauthUrlTests).some(test => 
      test.error && test.error.includes('path is invalid')
    )
    
    if (hasPathErrors) {
      recommendations.push('"Path is invalid" errors suggest OAuth provider not configured in Supabase')
    }

    if (recommendations.length === 0) {
      recommendations.push('All basic checks passed - try the actual OAuth flow')
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      urlValidation,
      envCheck,
      oauthTests,
      oauthUrlTests,
      clientTest,
      recommendations,
      troubleshooting: {
        pathInvalidError: 'This error usually means the OAuth provider is not enabled in Supabase Dashboard',
        nextSteps: [
          '1. Go to Supabase Dashboard > Authentication > Providers',
          '2. Enable the provider you want to use (Twitter/Google)',
          '3. Add the provider credentials',
          '4. Save the configuration',
          '5. Restart your development server'
        ]
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 