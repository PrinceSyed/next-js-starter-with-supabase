import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // This uses the secret key for admin operations
    const { data, error } = await supabaseAdmin
      .from('ai_user')
      .select('*')
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Admin access successful',
      count: data?.length || 0
    })
  } catch (err) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 