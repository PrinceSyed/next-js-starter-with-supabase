'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function TwitterLoginButton() {
  const { user, loading, signInWithTwitter, signOut } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signInWithTwitter()
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  if (loading) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="space-y-3">
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
              @{user.user_metadata?.user_name || 'user'}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Connected
          </Badge>
        </div>
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          className="w-full"
          size="sm"
        >
          Disconnect Twitter
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={handleSignIn} 
      disabled={isSigningIn}
      className="w-full" 
      variant="outline"
    >
      {isSigningIn ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Connect Twitter
        </>
      )}
    </Button>
  )
} 