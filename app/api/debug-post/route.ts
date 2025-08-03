import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the request body
    const body = await request.json()
    const { title, content, user_id, user_metadata } = body

    // Debug: Log what we received
    console.log('Debug post creation:', {
      title,
      content,
      user_id,
      user_metadata,
      hasUserId: !!user_id,
      hasUserMetadata: !!user_metadata
    })

    // Test 1: Try to get current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('Current user from auth:', {
      user: user ? {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      } : null,
      error: userError
    })

    // Test 2: Try to insert with provided user_id
    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          title: title || 'Debug Test Post',
          content: content || 'This is a debug test post.',
          user_id: user_id || user?.id || '00000000-0000-0000-0000-000000000000',
          user_metadata: user_metadata || user?.user_metadata || {
            full_name: 'Debug User',
            avatar_url: null,
            user_name: 'debuguser'
          }
        }
      ])
      .select()

    return NextResponse.json({
      success: true,
      message: 'Debug post creation test',
      receivedData: {
        title,
        content,
        user_id,
        user_metadata
      },
      currentUser: user ? {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      } : null,
      insertResult: insertError ? {
        success: false,
        error: insertError.message,
        code: insertError.code,
        details: insertError.details
      } : {
        success: true,
        data: insertData
      },
      recommendations: insertError ? [
        'Check if user is authenticated',
        'Verify RLS policies are correct',
        'Ensure user_id matches authenticated user'
      ] : [
        'Post creation successful!',
        'User data was properly inserted'
      ]
    })

  } catch (error) {
    console.error('Debug post error:', error)
    return NextResponse.json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 