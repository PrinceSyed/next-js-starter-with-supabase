'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, X } from 'lucide-react'

export function OAuthErrorDisplay() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescParam = searchParams.get('error_description')
    
    if (errorParam) {
      setError(errorParam)
      setErrorDescription(errorDescParam)
      
      // Clear the error from URL after displaying it
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      url.searchParams.delete('error_description')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  if (!error) {
    return null
  }

  const getErrorTitle = (errorCode: string) => {
    switch (errorCode) {
      case 'exchange_failed':
        return 'Authentication Failed'
      case 'access_denied':
        return 'Access Denied'
      case 'invalid_request':
        return 'Invalid Request'
      case 'server_error':
        return 'Server Error'
      default:
        return 'Authentication Error'
    }
  }

  const getErrorDescription = (errorCode: string, description: string | null) => {
    if (description) {
      return description
    }
    
    switch (errorCode) {
      case 'exchange_failed':
        return 'Failed to complete the authentication process. This might be due to a configuration issue or network problem.'
      case 'access_denied':
        return 'You denied access to your account. Please try again and grant the necessary permissions.'
      case 'invalid_request':
        return 'The authentication request was invalid. Please try again.'
      case 'server_error':
        return 'A server error occurred during authentication. Please try again later.'
      default:
        return 'An unexpected error occurred during authentication.'
    }
  }

  const getTroubleshootingSteps = (errorCode: string) => {
    switch (errorCode) {
      case 'exchange_failed':
        return [
          'Check if your Supabase project is properly configured',
          'Verify that OAuth providers are enabled in your Supabase dashboard',
          'Ensure callback URLs are correctly set in both Supabase and OAuth provider settings',
          'Check browser console for additional error details'
        ]
      case 'access_denied':
        return [
          'Make sure you grant the necessary permissions when prompted',
          'Check if your account has the required access level',
          'Try signing in with a different account if available'
        ]
      default:
        return [
          'Refresh the page and try again',
          'Clear your browser cache and cookies',
          'Check if you have a stable internet connection',
          'Contact support if the issue persists'
        ]
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-destructive">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">
              {getErrorTitle(error)}
            </CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {error}
          </Badge>
        </div>
        <CardDescription className="text-destructive/80">
          {getErrorDescription(error, errorDescription)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Troubleshooting Steps:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {getTroubleshootingSteps(error).map((step, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
            size="sm"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => setError(null)} 
            variant="outline"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 