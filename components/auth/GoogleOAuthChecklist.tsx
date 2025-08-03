'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  link?: string
  linkText?: string
}

export function GoogleOAuthChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'env-vars',
      title: 'Environment Variables',
      description: 'Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set',
      completed: false
    },
    {
      id: 'supabase-provider',
      title: 'Supabase Google Provider',
      description: 'Enable Google OAuth in Supabase Dashboard > Authentication > Providers',
      completed: false,
      link: 'https://supabase.com/dashboard/project/_/auth/providers',
      linkText: 'Go to Supabase Dashboard'
    },
    {
      id: 'google-credentials',
      title: 'Google OAuth Credentials',
      description: 'Add Google Client ID and Client Secret to Supabase Google provider settings',
      completed: false,
      link: 'https://console.cloud.google.com/apis/credentials',
      linkText: 'Google Cloud Console'
    },
    {
      id: 'callback-urls',
      title: 'Callback URLs',
      description: 'Ensure callback URLs match between Google Cloud Console and Supabase',
      completed: false
    },
    {
      id: 'authorized-domains',
      title: 'Authorized Domains',
      description: 'Add your domain to Google OAuth authorized domains',
      completed: false
    },
    {
      id: 'test-flow',
      title: 'Test OAuth Flow',
      description: 'Run the debug tests to verify the complete OAuth flow',
      completed: false
    }
  ])

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Google OAuth Setup Checklist
          <Badge variant={completedCount === totalCount ? "default" : "secondary"}>
            {completedCount}/{totalCount}
          </Badge>
        </CardTitle>
        <CardDescription>
          Complete these steps to properly configure Google OAuth authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.link && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => window.open(item.link, '_blank')}
                  >
                    {item.linkText}
                  </Button>
                )}
              </div>
              <Badge variant={item.completed ? "default" : "outline"}>
                {item.completed ? "Done" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
        
        {completedCount === totalCount && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ Setup Complete!</h4>
            <p className="text-sm text-green-700">
              All Google OAuth configuration steps are complete. Try signing in with Google now.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 