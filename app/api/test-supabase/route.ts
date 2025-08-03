import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Test basic connection
    const { data, error } = await supabase.from('_dummy_table_').select('*').limit(1)
    
    // This will likely fail with a table not found error, but that's expected
    // We just want to test the connection
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection test completed',
      hasError: !!error,
      errorMessage: error?.message || null,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasServiceKey: !!process.env.SUPABASE_SECRET_KEY
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