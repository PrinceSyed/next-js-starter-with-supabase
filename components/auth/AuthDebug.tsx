'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AuthDebug() {
  const { user, session, loading, signInWithTwitter, signInWithGoogle, signOut } = useAuth()
  const [testResults, setTestResults] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testOAuthSetup = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-twitter-oauth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testSupabaseConnection = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testOAuthFlow = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-oauth-flow')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testGoogleOAuth = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-google-oauth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const debugOAuth = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/debug-oauth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testActualOAuth = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-actual-oauth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testGooglePKCE = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-google-pkce')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testGoogleOAuthDetailed = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-google-oauth-detailed')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const debugGoogleOAuth = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/debug-google-oauth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testServerClient = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-server-client')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testEnvRuntime = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-env-runtime')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testPKCEFlow = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-pkce-flow')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const debugPKCEIssue = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/debug-pkce-issue')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testSimpleOAuthFlow = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-simple-oauth-flow')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testCompleteOAuthFlow = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-oauth-complete-flow')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testOAuthConfig = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-oauth-config')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testOAuthFlowFixed = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-oauth-flow-fixed')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const diagnoseAuth = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/diagnose-auth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  const testCompleteOAuthFlowNew = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/test-complete-oauth-flow')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Authentication Debug Panel</CardTitle>
        <CardDescription>
          Debug your Supabase and Twitter OAuth setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Auth Status</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Loading:</span>
                    <Badge variant={loading ? "destructive" : "secondary"}>
                      {loading ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authenticated:</span>
                    <Badge variant={user ? "default" : "secondary"}>
                      {user ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session:</span>
                    <Badge variant={session ? "default" : "secondary"}>
                      {session ? "Active" : "None"}
                    </Badge>
                  </div>
                </div>
              </div>

              {user && (
                <div className="space-y-2">
                  <h3 className="font-semibold">User Info</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                    <div><strong>ID:</strong> {user.id}</div>
                    <div><strong>Provider:</strong> {user.app_metadata?.provider || 'N/A'}</div>
                    <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

                         <div className="pt-4 space-y-2">
               <Button 
                 onClick={signInWithTwitter} 
                 disabled={loading}
                 className="w-full"
               >
                 Test Twitter Sign In
               </Button>
                               <Button 
                  onClick={signInWithGoogle} 
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  Test Google Sign In
                </Button>
                <Button 
                  onClick={signOut} 
                  disabled={loading || !user}
                  className="w-full"
                  variant="destructive"
                >
                  Sign Out
                </Button>
             </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Environment Variables</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL:</span>
                      <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                      </Badge>
                    </div>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                      <div className="text-xs text-muted-foreground break-all">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:</span>
                      <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-mono">SUPABASE_SECRET_KEY:</span>
                      <Badge variant={process.env.SUPABASE_SECRET_KEY ? "default" : "destructive"}>
                        {process.env.SUPABASE_SECRET_KEY ? '✅ Set' : '❌ Missing'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Client Info</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</div>
                    <div><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</div>
                    <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="space-y-4">
                             <div className="flex gap-2 flex-wrap">
                 <Button 
                   onClick={testActualOAuth} 
                   disabled={isTesting}
                   variant="default"
                 >
                   🎯 Test Actual OAuth Flow
                 </Button>
                                   <Button 
                    onClick={testGooglePKCE} 
                    disabled={isTesting}
                    variant="default"
                  >
                    🔍 Test Google PKCE
                  </Button>
                                     <Button 
                     onClick={testGoogleOAuthDetailed} 
                     disabled={isTesting}
                     variant="default"
                   >
                     🔍 Test Google OAuth Detailed
                   </Button>
                   <Button 
                     onClick={debugGoogleOAuth} 
                     disabled={isTesting}
                     variant="default"
                   >
                     🔍 Debug Google OAuth (Comprehensive)
                   </Button>
                                       <Button 
                      onClick={testServerClient} 
                      disabled={isTesting}
                      variant="outline"
                    >
                      🔍 Test Server Client Config
                    </Button>
                    <Button 
                      onClick={testEnvRuntime} 
                      disabled={isTesting}
                      variant="outline"
                    >
                      🔍 Test Environment Runtime
                    </Button>
                    <Button 
                      onClick={testPKCEFlow} 
                      disabled={isTesting}
                      variant="default"
                    >
                      🔐 Test PKCE Flow
                    </Button>
                    <Button 
                      onClick={debugPKCEIssue} 
                      disabled={isTesting}
                      variant="destructive"
                    >
                      🔍 Debug PKCE Issue
                    </Button>
                    <Button 
                      onClick={testSimpleOAuthFlow} 
                      disabled={isTesting}
                      variant="outline"
                    >
                      🔍 Test Simple OAuth Flow
                    </Button>
                    <Button 
                      onClick={testCompleteOAuthFlow} 
                      disabled={isTesting}
                      variant="default"
                    >
                      🔍 Test Complete OAuth Flow
                    </Button>
                    <Button 
                      onClick={testOAuthConfig} 
                      disabled={isTesting}
                      variant="destructive"
                    >
                      🔍 Test OAuth Config (Port Issue)
                    </Button>
                    <Button 
                      onClick={testOAuthFlowFixed} 
                      disabled={isTesting}
                      variant="default"
                    >
                      ✅ Test Fixed OAuth Flow
                    </Button>
                    <Button 
                      onClick={diagnoseAuth} 
                      disabled={isTesting}
                      variant="destructive"
                    >
                      🔍 Diagnose Auth Issues
                    </Button>
                    <Button 
                      onClick={testCompleteOAuthFlowNew} 
                      disabled={isTesting}
                      variant="default"
                    >
                      🔄 Test Complete OAuth Flow
                    </Button>
                 <Button 
                   onClick={debugOAuth} 
                   disabled={isTesting}
                   variant="outline"
                 >
                   🔍 Debug OAuth (Comprehensive)
                 </Button>
                 <Button 
                   onClick={testOAuthSetup} 
                   disabled={isTesting}
                   variant="outline"
                 >
                   Test Twitter OAuth
                 </Button>
                 <Button 
                   onClick={testGoogleOAuth} 
                   disabled={isTesting}
                   variant="outline"
                 >
                   Test Google OAuth
                 </Button>
                 <Button 
                   onClick={testSupabaseConnection} 
                   disabled={isTesting}
                   variant="outline"
                 >
                   Test Supabase Connection
                 </Button>
                 <Button 
                   onClick={testOAuthFlow} 
                   disabled={isTesting}
                   variant="outline"
                 >
                   Test OAuth Flow
                 </Button>
               </div>

              {testResults && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Test Results</h3>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Session Details</h3>
              {session ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-sm">
                      <div><strong>Access Token:</strong> {session.access_token.substring(0, 20)}...</div>
                      <div><strong>Refresh Token:</strong> {session.refresh_token.substring(0, 20)}...</div>
                      <div><strong>Expires At:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</div>
                      <div><strong>Token Type:</strong> {session.token_type}</div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><strong>User ID:</strong> {session.user.id}</div>
                      <div><strong>Email:</strong> {session.user.email}</div>
                      <div><strong>Email Confirmed:</strong> {session.user.email_confirmed_at ? 'Yes' : 'No'}</div>
                      <div><strong>Last Sign In:</strong> {session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No active session</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 