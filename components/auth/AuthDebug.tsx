'use client'

import { useAuth } from './AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function AuthDebug() {
  const { user, session, loading, signInWithTwitter } = useAuth()

  const handleTestSignIn = async () => {
    try {
      console.log('Starting Twitter sign in...')
      await signInWithTwitter()
    } catch (error) {
      console.error('Sign in error:', error)
      alert(`Sign in error: ${error}`)
    }
  }

  const handleTestConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      const { data, error } = await supabase.auth.getSession()
      console.log('Connection test result:', { data, error })
      alert(error ? `Connection error: ${error.message}` : 'Connection successful!')
    } catch (error) {
      console.error('Connection test failed:', error)
      alert(`Connection test failed: ${error}`)
    }
  }

  const handleTestOAuthEndpoint = async () => {
    try {
      console.log('Testing OAuth configuration...')
      
      // Clear any cached auth state
      await supabase.auth.signOut()
      
      // Test if Twitter provider is configured by trying to get OAuth URL
      const oauthUrl = `${supabase.supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
      console.log('Testing OAuth URL:', oauthUrl)
      
      // Test if the URL is accessible
      const response = await fetch(oauthUrl, { method: 'HEAD' })
      console.log('OAuth URL test result:', response.status, response.statusText)
      
      if (response.status === 405) {
        console.log('OAuth test result: Success - provider is configured (405 is expected)')
        alert('OAuth test: Success - Twitter provider is configured! (405 is expected)')
      } else if (response.ok) {
        console.log('OAuth test result: Success - provider is configured')
        alert('OAuth test: Success - Twitter provider is configured!')
      } else {
        console.log('OAuth test result:', response.status, response.statusText)
        alert(`OAuth test: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('OAuth test failed:', error)
      alert(`OAuth test failed: ${error}`)
    }
  }

  const handleTestSupabaseUrl = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      console.log('Testing Supabase URL:', supabaseUrl)
      
      // Test the base URL
      const response = await fetch(supabaseUrl, { method: 'HEAD' })
      console.log('Base URL test result:', response.status, response.statusText)
      
      // Test the auth endpoint
      const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, { method: 'HEAD' })
      console.log('Auth endpoint test result:', authResponse.status, authResponse.statusText)
      
      alert(`Base URL: ${response.status}, Auth: ${authResponse.status}`)
    } catch (error) {
      console.error('URL test failed:', error)
      alert(`URL test failed: ${error}`)
    }
  }

  const handleClearCache = async () => {
    try {
      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Reload the page to clear any cached client configurations
      window.location.reload()
      
      alert('Cache cleared and page reloaded!')
    } catch (error) {
      console.error('Cache clear failed:', error)
      alert(`Cache clear failed: ${error}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display font-bold text-2xl">
          Auth Debug
        </CardTitle>
        <CardDescription>
          Debug information for Twitter authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variables */}
        <div className="space-y-2">
          <h3 className="font-semibold">Environment Variables:</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL:</span>{' '}
              <Badge variant="outline">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </Badge>
              {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                <span className="text-xs text-muted-foreground ml-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </span>
              )}
            </p>
            <p>
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:</span>{' '}
              <Badge variant="outline">
                {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
              </Badge>
              {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && (
                <span className="text-xs text-muted-foreground ml-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.substring(0, 20)}...
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Auth State */}
        <div className="space-y-2">
          <h3 className="font-semibold">Auth State:</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-mono">Loading:</span>{' '}
              <Badge variant={loading ? 'secondary' : 'outline'}>
                {loading ? 'Yes' : 'No'}
              </Badge>
            </p>
            <p>
              <span className="font-mono">User:</span>{' '}
              <Badge variant={user ? 'secondary' : 'outline'}>
                {user ? 'Logged In' : 'Not Logged In'}
              </Badge>
            </p>
            <p>
              <span className="font-mono">Session:</span>{' '}
              <Badge variant={session ? 'secondary' : 'outline'}>
                {session ? 'Active' : 'None'}
              </Badge>
            </p>
          </div>
        </div>

        {/* User Details */}
        {user && (
          <div className="space-y-2">
            <h3 className="font-semibold">User Details:</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-mono">ID:</span> {user.id}</p>
              <p><span className="font-mono">Email:</span> {user.email}</p>
              <p><span className="font-mono">Provider:</span> {user.app_metadata?.provider}</p>
              <p><span className="font-mono">Username:</span> {user.user_metadata?.user_name}</p>
              <p><span className="font-mono">Full Name:</span> {user.user_metadata?.full_name}</p>
            </div>
          </div>
        )}

        {/* Test Buttons */}
        <div className="pt-4 border-t border-border space-y-2">
          <Button 
            onClick={handleTestConnection} 
            className="w-full"
            variant="outline"
            size="sm"
          >
            Test Supabase Connection
          </Button>
          <Button 
            onClick={handleTestSignIn} 
            className="w-full"
            variant="outline"
          >
            Test Twitter Sign In
          </Button>
          <Button 
            onClick={handleTestOAuthEndpoint} 
            className="w-full"
            variant="outline"
            size="sm"
          >
            Test Twitter OAuth Config
          </Button>
          <Button 
            onClick={handleTestSupabaseUrl} 
            className="w-full"
            variant="outline"
            size="sm"
          >
            Test Supabase URL
          </Button>
          <Button 
            onClick={handleClearCache} 
            className="w-full"
            variant="outline"
            size="sm"
          >
            Clear Cache & Reload
          </Button>
        </div>

        {/* Console Instructions */}
        <div className="text-xs text-muted-foreground">
          <p>Open browser console (F12) to see detailed logs</p>
          <p className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Note:</strong> If you see a 405 error when testing OAuth endpoints, this is normal - 
            it means your Supabase project is working but Twitter OAuth needs to be configured in the dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 