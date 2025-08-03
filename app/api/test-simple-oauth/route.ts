import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    
    // Create a fresh client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test the simplest possible OAuth call
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter'
    })
    
    return NextResponse.json({
      success: true,
      hasError: !!error,
      errorMessage: error?.message || null,
      errorCode: error?.status || null,
      data: data ? 'Success' : null,
      supabaseUrl,
      hasKey: !!supabaseKey
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
} 