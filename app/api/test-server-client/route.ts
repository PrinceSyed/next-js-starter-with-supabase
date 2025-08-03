import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables'
      })
    }

    // Test 1: Current server client (without PKCE)
    const currentServerClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test 2: Server client with PKCE (like the working repo might have)
    const pkceServerClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        flowType: 'pkce'
      }
    })

    // Test 3: Client-side style client (for comparison)
    const clientStyleClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })

    return NextResponse.json({
      success: true,
      analysis: {
        currentServerConfig: {
          hasPkce: false,
          autoRefreshToken: false,
          persistSession: false
        },
        pkceServerConfig: {
          hasPkce: true,
          autoRefreshToken: false,
          persistSession: false
        },
        clientStyleConfig: {
          hasPkce: true,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      },
      potentialIssue: 'Server client missing PKCE configuration',
      recommendation: 'Add flowType: "pkce" to server client in lib/supabase-server.ts',
      fix: {
        file: 'lib/supabase-server.ts',
        change: 'Add flowType: "pkce" to auth config',
        code: `
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      flowType: 'pkce'  // Add this line
    }
  })
}
        `
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 