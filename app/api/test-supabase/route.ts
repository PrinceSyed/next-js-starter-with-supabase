import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const serviceKey = process.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_SUPABASE_URL not configured'
      }, { status: 500 })
    }

    // Test basic connectivity
    const baseResponse = await fetch(supabaseUrl, { method: 'HEAD' })
    
    // Test auth endpoint
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, { method: 'HEAD' })
    
    // Test with Supabase client
    const supabase = await createClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    // Test health endpoint
    const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, { method: 'HEAD' })

    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl,
        hasAnonKey: !!anonKey,
        hasServiceKey: !!serviceKey,
        anonKeyPrefix: anonKey ? anonKey.substring(0, 10) + '...' : null,
        serviceKeyPrefix: serviceKey ? serviceKey.substring(0, 10) + '...' : null
      },
      connectivity: {
        baseUrl: {
          status: baseResponse.status,
          ok: baseResponse.ok,
          statusText: baseResponse.statusText
        },
        authEndpoint: {
          status: authResponse.status,
          ok: authResponse.ok,
          statusText: authResponse.statusText
        },
        healthEndpoint: {
          status: healthResponse.status,
          ok: healthResponse.ok,
          statusText: healthResponse.statusText
        }
      },
      client: {
        sessionExists: !!sessionData.session,
        sessionError: sessionError?.message || null,
        userEmail: sessionData.session?.user?.email || null
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        hasServiceKey: !!process.env.SUPABASE_SECRET_KEY
      }
    }, { status: 500 })
  }
} 