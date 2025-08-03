import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
        url: !!supabaseUrl,
        key: !!supabaseKey
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test 1: Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('posts')
      .select('count')
      .limit(1)

    if (testError) {
      return NextResponse.json({
        error: 'Database connection failed',
        details: testError.message,
        code: testError.code,
        hint: testError.code === 'PGRST116' ? 'Table "posts" does not exist. Please create it first.' : 'Unknown error'
      }, { status: 500 })
    }

    // Test 2: Try to get table structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'posts' })
      .single()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      postsCount: testData?.length || 0,
      tableInfo: tableError ? 'Could not get table info' : tableInfo
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 