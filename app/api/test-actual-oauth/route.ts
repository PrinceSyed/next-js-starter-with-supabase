import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const redirectTo = 'http://localhost:3000/auth/callback'

    // Test the actual OAuth flow that Supabase uses
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent(redirectTo)}`

    // Test with GET request (which is what the actual OAuth flow uses)
    const response = await fetch(oauthUrl, { 
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    })

    // Get the response body to see what error we're getting
    let responseBody = ''
    try {
      responseBody = await response.text()
    } catch (e) {
      responseBody = 'Could not read response body'
    }

    // Also test with the exact same URL but different method
    const postResponse = await fetch(oauthUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({})
    })

    let postResponseBody = ''
    try {
      postResponseBody = await postResponse.text()
    } catch (e) {
      postResponseBody = 'Could not read response body'
    }

    return NextResponse.json({
      success: true,
      oauthUrl,
      getRequest: {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        body: responseBody.substring(0, 500), // Limit response body
        headers: Object.fromEntries(response.headers.entries())
      },
      postRequest: {
        status: postResponse.status,
        ok: postResponse.ok,
        statusText: postResponse.statusText,
        body: postResponseBody.substring(0, 500), // Limit response body
        headers: Object.fromEntries(postResponse.headers.entries())
      },
      analysis: {
        getRequestRedirect: response.status >= 300 && response.status < 400,
        postRequestRedirect: postResponse.status >= 300 && postResponse.status < 400,
        hasLocationHeader: response.headers.get('location') || postResponse.headers.get('location'),
        locationHeader: response.headers.get('location') || postResponse.headers.get('location')
      },
      recommendations: [
        'If GET request returns 302/303 with Location header, OAuth is working correctly',
        'If both return 405, that\'s expected for API testing',
        'If you get "path invalid" error, check the exact error message in the response body'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      oauthUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent('http://localhost:3000/auth/callback')}`
    }, { status: 500 })
  }
} 