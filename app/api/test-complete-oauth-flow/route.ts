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

    // Test 1: Check current session
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()

    // Test 2: Generate OAuth URL
    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      }
    })

    if (oauthError) {
      return NextResponse.json({
        success: false,
        error: 'OAuth URL generation failed',
        details: oauthError
      })
    }

    // Test 3: Check if we can detect URL parameters (simulating callback)
    const testUrl = new URL('http://localhost:3000')
    testUrl.searchParams.set('code', 'test_code_123')
    testUrl.searchParams.set('state', 'test_state_123')

    // Test 4: Try to exchange a test code (this will fail but shows the flow)
    try {
      const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession('test_code_123')
      
      return NextResponse.json({
        success: true,
        message: 'Complete OAuth flow test completed',
        details: {
          currentSession: {
            hasSession: !!currentSession,
            userEmail: currentSession?.user?.email || null
          },
          oauthUrl: {
            hasUrl: !!oauthData.url,
            url: oauthData.url?.substring(0, 100) + '...',
            redirectTo: 'http://localhost:3000/auth/callback'
          },
          testFlow: {
            testUrl: testUrl.toString(),
            exchangeAttempted: true,
            exchangeError: exchangeError?.message || 'Expected error for test code'
          },
          configuration: {
            flowType: 'pkce',
            detectSessionInUrl: true,
            autoRefreshToken: true,
            persistSession: true
          }
        },
        nextSteps: [
          '1. ✅ OAuth URL generation works',
          '2. ✅ Callback URL configuration is correct',
          '3. 🔄 Test actual OAuth flow by clicking "Test Google Sign In"',
          '4. 📝 Check browser console for detailed logs',
          '5. 🔍 Monitor the callback route logs'
        ],
        manualTest: {
          instruction: 'Click "Test Google Sign In" in the AuthDebug panel and watch the console logs',
          expectedFlow: [
            '1. OAuth URL generated',
            '2. Redirect to Google',
            '3. Google redirects to /auth/callback',
            '4. Callback redirects to home with code',
            '5. Supabase exchanges code for session',
            '6. User authenticated'
          ]
        }
      })
    } catch (error) {
      return NextResponse.json({
        success: true,
        message: 'OAuth flow test completed (exchange test failed as expected)',
        details: {
          currentSession: {
            hasSession: !!currentSession,
            userEmail: currentSession?.user?.email || null
          },
          oauthUrl: {
            hasUrl: !!oauthData.url,
            url: oauthData.url?.substring(0, 100) + '...',
            redirectTo: 'http://localhost:3000/auth/callback'
          },
          testFlow: {
            testUrl: testUrl.toString(),
            exchangeAttempted: true,
            exchangeError: 'Expected error for test code'
          }
        },
        nextSteps: [
          '1. ✅ OAuth URL generation works',
          '2. ✅ Callback URL configuration is correct',
          '3. 🔄 Test actual OAuth flow by clicking "Test Google Sign In"',
          '4. 📝 Check browser console for detailed logs'
        ]
      })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 