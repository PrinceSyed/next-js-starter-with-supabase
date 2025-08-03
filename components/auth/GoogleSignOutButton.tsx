'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LogOut, User } from 'lucide-react'

export function GoogleSignOutButton() {
  const { user, loading, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      console.log('Signing out...')
      await signOut()
      console.log('Sign out successful')
    } catch (error) {
      console.error('Sign out failed:', error)
      alert('Sign out failed. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <Button variant="outline" disabled className="w-full">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
        <User className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Not signed in</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* User Profile Display */}
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
            {user.user_metadata?.user_name ? `@${user.user_metadata.user_name}` : user.email}
          </p>
        </div>
        <Badge variant="default" className="text-xs">
          Google
        </Badge>
      </div>

      {/* Sign Out Button */}
      <Button 
        onClick={handleSignOut} 
        variant="destructive" 
        className="w-full"
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing Out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out of Google
          </>
        )}
      </Button>
    </div>
  )
} 