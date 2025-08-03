'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function SupabaseTest() {
  const [data, setData] = useState<any[]>([])
  const [adminData, setAdminData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: ai_user, error } = await supabase
        .from('ai_user')
        .select('*')
      
      if (error) {
        setError(error.message)
      } else {
        setData(ai_user || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testAdminConnection = async () => {
    setAdminLoading(true)
    setAdminError(null)
    
    try {
      const response = await fetch('/api/test-admin')
      const result = await response.json()
      
      if (!response.ok) {
        setAdminError(result.error || 'Admin API error')
      } else {
        setAdminData(result.data || [])
      }
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display font-bold text-2xl">
          Supabase Integration Test
        </CardTitle>
        <CardDescription>
          Testing both client-side and server-side database connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client-side Test */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Client-Side Test (Publishable Key)</h3>
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Client Connection'}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm font-medium">Error:</p>
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {data.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Success!</Badge>
                <span className="text-sm text-muted-foreground">
                  Found {data.length} record(s) in ai_user table
                </span>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Server-side Test */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg">Server-Side Test (Secret Key)</h3>
          <Button 
            onClick={testAdminConnection} 
            disabled={adminLoading}
            className="w-full"
            variant="outline"
          >
            {adminLoading ? 'Testing...' : 'Test Admin API'}
          </Button>

          {adminError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm font-medium">Error:</p>
              <p className="text-destructive text-sm">{adminError}</p>
            </div>
          )}

          {adminData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Admin Success!</Badge>
                <span className="text-sm text-muted-foreground">
                  Found {adminData.length} record(s) via admin API
                </span>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(adminData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {data.length === 0 && adminData.length === 0 && !error && !adminError && !loading && !adminLoading && (
          <div className="text-center text-muted-foreground text-sm">
            Click the buttons above to test both connections
          </div>
        )}
      </CardContent>
    </Card>
  )
} 