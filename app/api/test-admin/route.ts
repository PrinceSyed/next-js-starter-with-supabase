import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // 1. Verify authentication - Check for Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // 2. Extract and validate JWT token
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error('Admin auth failed:', authError?.message)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // 3. Check admin role - Query user profile for admin role
    // Note: This assumes a 'user_profiles' table exists with a 'role' column
    // If your database uses a different structure, adjust accordingly
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('ai_user')
      .select('role')
      .eq('id', user.id)
      .single()

    // If user profile doesn't exist or role check fails, deny access
    if (profileError) {
      console.error('Profile lookup failed:', profileError.message)
      return NextResponse.json(
        { error: 'Forbidden - Unable to verify permissions' },
        { status: 403 }
      )
    }

    // Check if user has admin role
    if (userProfile?.role !== 'admin') {
      console.warn(`Non-admin user attempted admin access: ${user.id}`)
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // 4. Proceed with admin operation - Fetch all user data
    const { data, error } = await supabaseAdmin
      .from('ai_user')
      .select('*')

    if (error) {
      console.error('Database query failed:', error.message)
      return NextResponse.json(
        { error: 'Failed to retrieve data' },
        { status: 500 }
      )
    }

    // Return success response with data
    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    })

  } catch (err) {
    console.error('Admin endpoint error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 