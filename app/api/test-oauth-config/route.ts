import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!anonKey
        }
      })
    }

    // Create client with PKCE
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })

    // Test OAuth URL generation with different redirect URLs
    const testUrls = [
      'http://localhost:3000/auth/callback',
      'http://localhost:3002/auth/callback',
      'http://localhost:3000/auth/verify',
      'http://localhost:3002/auth/verify'
    ]

    const results = []

    for (const redirectUrl of testUrls) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl
          }
        })

        if (error) {
          results.push({
            redirectUrl,
            success: false,
            error: error.message,
            status: error.status
          })
        } else {
          const urlObj = new URL(data.url)
          results.push({
            redirectUrl,
            success: true,
            hasCodeChallenge: !!urlObj.searchParams.get('code_challenge'),
            hasState: !!urlObj.searchParams.get('state'),
            hasClientId: !!urlObj.searchParams.get('client_id'),
            redirectUri: urlObj.searchParams.get('redirect_uri')
          })
        }
      } catch (error) {
        results.push({
          redirectUrl,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      analysis: {
        port3000Works: results.some(r => r.redirectUrl.includes(':3000') && r.success),
        port3002Works: results.some(r => r.redirectUrl.includes(':3002') && r.success),
        recommendations: [
          'If port 3000 works but 3002 doesn\'t: Update Supabase OAuth settings to include port 3002',
          'If neither works: Check Supabase OAuth configuration',
          'If both work: Use the port that matches your current setup'
        ]
      },
      nextSteps: [
        '1. Check which redirect URLs work in the test results',
        '2. Update Supabase OAuth settings to include the working port',
        '3. Ensure both /auth/callback and /auth/verify URLs are configured',
        '4. Test the OAuth flow again'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 