'use client'

import { useAuth } from './AuthProvider'
import { Badge } from '@/components/ui/badge'

export function AuthStatus() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Badge variant="outline">Loading...</Badge>
  }

  if (user) {
    return (
      <Badge variant="secondary" className="text-xs">
        ✅ @{user.user_metadata?.user_name || 'user'}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-xs">
      🔒 Not Connected
    </Badge>
  )
} 