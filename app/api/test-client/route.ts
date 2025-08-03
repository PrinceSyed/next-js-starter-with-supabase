import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic client configuration
    console.log('Testing Supabase client...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    
    // Test OAuth URL generation
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })
    
    return NextResponse.json({
      success: true,
      hasError: !!error,
      errorMessage: error?.message || null,
      data: data ? 'OAuth URL generated successfully' : null,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    }, { status: 500 })
  }
} 