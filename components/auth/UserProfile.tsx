'use client'

import { useAuth } from './AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display font-bold text-2xl">
          User Profile
        </CardTitle>
        <CardDescription>
          Your Twitter account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
            <AvatarFallback className="text-lg">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {user.user_metadata?.full_name || 'Unknown User'}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{user.user_metadata?.user_name || 'user'}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
            <Badge variant="secondary">
              Connected via Twitter
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button 
            onClick={signOut} 
            variant="outline" 
            className="w-full"
          >
            Sign Out
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>User ID: {user.id}</p>
          <p>Last Sign In: {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  )
} 