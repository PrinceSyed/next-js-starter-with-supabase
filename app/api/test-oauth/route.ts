import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Test OAuth configuration
    const { data, error } = await supabase.auth.admin.listUsers()
    
    return NextResponse.json({
      success: true,
      message: 'OAuth test completed',
      hasError: !!error,
      errorMessage: error?.message || null,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasServiceKey: !!process.env.SUPABASE_SECRET_KEY,
      // Check if we can access auth endpoints
      authEndpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize`
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