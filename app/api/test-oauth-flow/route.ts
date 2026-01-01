import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const serviceKey = process.env.SUPABASE_SECRET_KEY

    // Test 1: Check environment variables
    const envCheck = {
      supabaseUrl: !!supabaseUrl,
      anonKey: !!anonKey,
      serviceKey: !!serviceKey,
      missingKeys: [] as string[]
    }

    if (!supabaseUrl) envCheck.missingKeys.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!anonKey) envCheck.missingKeys.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    if (!serviceKey) envCheck.missingKeys.push('SUPABASE_SECRET_KEY')

    // Test 2: Check Supabase connectivity
    const connectivityCheck: any = {
      baseUrl: null,
      authEndpoint: null,
      restEndpoint: null
    }

    if (supabaseUrl) {
      try {
        const baseResponse = await fetch(supabaseUrl, { method: 'HEAD' })
        connectivityCheck.baseUrl = {
          status: baseResponse.status,
          ok: baseResponse.ok
        }
      } catch (e) {
        connectivityCheck.baseUrl = { error: e instanceof Error ? e.message : 'Unknown error' }
      }

      try {
        const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, { method: 'HEAD' })
        connectivityCheck.authEndpoint = {
          status: authResponse.status,
          ok: authResponse.ok
        }
      } catch (e) {
        connectivityCheck.authEndpoint = { error: e instanceof Error ? e.message : 'Unknown error' }
      }

      try {
        const restResponse = await fetch(`${supabaseUrl}/rest/v1/`, { method: 'HEAD' })
        connectivityCheck.restEndpoint = {
          status: restResponse.status,
          ok: restResponse.ok
        }
      } catch (e) {
        connectivityCheck.restEndpoint = { error: e instanceof Error ? e.message : 'Unknown error' }
      }

    }

    // Test 3: Check client-side OAuth URL generation
    const clientOAuthUrl = supabaseUrl ? `${supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent('http://localhost:3000/auth/callback')}` : null

    // Test 4: Check if we can create a server client
    let serverClientCheck: { success: boolean; error: string | null; hasSession?: boolean } = { success: false, error: null }
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.getSession()
      serverClientCheck = { 
        success: !error, 
        error: error?.message || null,
        hasSession: !!data.session
      }
    } catch (e) {
      serverClientCheck = { 
        success: false, 
        error: e instanceof Error ? e.message : 'Unknown error',
        hasSession: false
      }
    }

    // Generate recommendations
    const recommendations = []
    
    if (envCheck.missingKeys.length > 0) {
      recommendations.push(`Missing environment variables: ${envCheck.missingKeys.join(', ')}`)
    }
    
    if (!connectivityCheck.baseUrl?.ok) {
      recommendations.push('Cannot connect to Supabase base URL - check your project URL')
    }
    
    if (!connectivityCheck.authEndpoint?.ok) {
      recommendations.push('Auth endpoint not accessible - check your project configuration')
    }
    
    if (!serverClientCheck.success) {
      recommendations.push(`Server client error: ${serverClientCheck.error}`)
    }

    if (recommendations.length === 0) {
      recommendations.push('All basic checks passed! Try the Twitter sign-in button.')
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      connectivity: connectivityCheck,
      serverClient: serverClientCheck,
      clientOAuthUrl,
      recommendations,
      nextSteps: [
        '1. Add missing environment variables to .env.local',
        '2. Restart your development server',
        '3. Configure Twitter OAuth in Supabase Dashboard',
        '4. Test the Twitter sign-in button'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 