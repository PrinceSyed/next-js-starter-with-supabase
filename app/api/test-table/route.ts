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

    // Test 1: Check table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'posts' })

    if (columnsError) {
      // Fallback: try to get table info using a simple query
      const { data: testData, error: testError } = await supabase
        .from('posts')
        .select('*')
        .limit(0)

      if (testError) {
        return NextResponse.json({
          error: 'Table does not exist or is not accessible',
          details: testError.message,
          code: testError.code
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Table exists but column info not available',
        hint: 'Run the fix-posts-table.sql script to ensure all columns exist'
      })
    }

    // Test 2: Check if required columns exist
    const requiredColumns = ['id', 'title', 'content', 'user_id', 'user_metadata', 'created_at', 'updated_at']
    const existingColumns = columns?.map((col: any) => col.column_name) || []
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))

    // Test 3: Try to insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          title: 'Test Post',
          content: 'This is a test post to verify the table structure.',
          user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
          user_metadata: {
            full_name: 'Test User',
            avatar_url: null,
            user_name: 'testuser'
          }
        }
      ])
      .select()

    return NextResponse.json({
      success: true,
      message: 'Table structure analysis complete',
      existingColumns,
      missingColumns,
      requiredColumns,
      insertTest: insertError ? {
        success: false,
        error: insertError.message,
        code: insertError.code
      } : {
        success: true,
        message: 'Test insert successful'
      },
      recommendations: missingColumns.length > 0 ? [
        'Run the fix-posts-table.sql script to add missing columns',
        'Missing columns: ' + missingColumns.join(', ')
      ] : [
        'Table structure looks good!',
        'All required columns are present'
      ]
    })

  } catch (error) {
    console.error('Table test error:', error)
    return NextResponse.json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 