import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test environment variables at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const serviceKey = process.env.SUPABASE_SECRET_KEY

    // Test if they're available in browser context
    const clientSideVars = {
      hasSupabaseUrl: typeof window !== 'undefined' ? !!(globalThis as any).NEXT_PUBLIC_SUPABASE_URL : 'N/A (server)',
      hasAnonKey: typeof window !== 'undefined' ? !!(globalThis as any).NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : 'N/A (server)'
    }

    return NextResponse.json({
      success: true,
      serverSide: {
        hasSupabaseUrl: !!supabaseUrl,
        hasAnonKey: !!anonKey,
        hasServiceKey: !!serviceKey,
        supabaseUrlPrefix: supabaseUrl?.substring(0, 30) + '...',
        anonKeyPrefix: anonKey?.substring(0, 20) + '...',
        serviceKeyPrefix: serviceKey?.substring(0, 20) + '...'
      },
      clientSide: clientSideVars,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development'
      },
      runtime: {
        timestamp: new Date().toISOString(),
        platform: process.platform,
        nodeVersion: process.version
      },
      recommendations: [
        supabaseUrl ? 'Supabase URL is loaded correctly' : 'MISSING: NEXT_PUBLIC_SUPABASE_URL',
        anonKey ? 'Anon key is loaded correctly' : 'MISSING: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
        serviceKey ? 'Service key is loaded correctly' : 'MISSING: SUPABASE_SECRET_KEY'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}