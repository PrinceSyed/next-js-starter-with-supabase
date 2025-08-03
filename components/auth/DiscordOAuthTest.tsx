'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function DiscordOAuthTest() {
  const { user, loading, signInWithOAuth, signOut } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const handleTestDiscordAuth = async () => {
    setIsSigningIn(true)
    setTestResults([])
    
    try {
      addTestResult('Starting Discord OAuth test...')
      addTestResult('Initiating OAuth flow...')
      
      await signInWithOAuth('discord')
      
      addTestResult('OAuth flow initiated successfully')
      addTestResult('Check browser console for detailed logs')
      
    } catch (error) {
      console.error('Discord OAuth test failed:', error)
      addTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      addTestResult('User signed out successfully')
    } catch (error) {
      console.error('Sign out failed:', error)
      addTestResult(`Sign out error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const isDiscordUser = user?.app_metadata?.provider === 'discord'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary font-display font-bold text-2xl">
          Discord OAuth Test
        </CardTitle>
        <CardDescription>
          Test and debug Discord authentication integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Status */}
        <div className="space-y-3">
          <h3 className="font-semibold">Current Status:</h3>
          {loading ? (
            <Badge variant="secondary">Loading...</Badge>
          ) : user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={isDiscordUser ? "default" : "secondary"}>
                  {isDiscordUser ? "Discord User" : "Other Provider"}
                </Badge>
                <Badge variant="outline">Authenticated</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                  <AvatarFallback>
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Provider: {user.app_metadata?.provider || 'unknown'}
                  </p>
                  {user.user_metadata?.user_name && (
                    <p className="text-xs text-muted-foreground truncate">
                      Username: @{user.user_metadata.user_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Badge variant="destructive">Not Authenticated</Badge>
          )}
        </div>

        {/* Test Actions */}
        <div className="space-y-2">
          <h3 className="font-semibold">Test Actions:</h3>
          <div className="flex space-x-2">
            {!user ? (
              <Button 
                onClick={handleTestDiscordAuth} 
                disabled={isSigningIn}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSigningIn ? 'Testing...' : 'Test Discord OAuth'}
              </Button>
            ) : (
              <Button 
                onClick={handleSignOut} 
                variant="outline"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Information */}
        {user && (
          <div className="space-y-2">
            <h3 className="font-semibold">Debug Information:</h3>
            <div className="bg-muted p-3 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify({
                  id: user.id,
                  email: user.email,
                  provider: user.app_metadata?.provider,
                  user_metadata: user.user_metadata,
                  app_metadata: user.app_metadata
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 