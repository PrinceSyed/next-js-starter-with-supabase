import { AuthDebug } from '@/components/auth/AuthDebug'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { GoogleOAuthChecklist } from '@/components/auth/GoogleOAuthChecklist'

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Google OAuth Debug Page</h1>
        <p className="text-muted-foreground mb-8">
          Use this page to diagnose and troubleshoot Google OAuth authentication issues.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Setup Checklist</h2>
            <GoogleOAuthChecklist />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Debug Tools</h2>
            <AuthProvider>
              <AuthDebug />
            </AuthProvider>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Common Google OAuth Issues:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Missing or incorrect environment variables</li>
            <li>• Google OAuth not enabled in Supabase Dashboard</li>
            <li>• Incorrect callback URLs in Google Cloud Console</li>
            <li>• Missing Google OAuth credentials in Supabase</li>
            <li>• CORS issues with OAuth redirects</li>
            <li>• PKCE flow configuration problems</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Run the "Debug Google OAuth (Comprehensive)" test above</li>
            <li>2. Check the test results for specific issues</li>
            <li>3. Verify your Supabase project settings</li>
            <li>4. Ensure Google OAuth is properly configured</li>
            <li>5. Check browser console for any JavaScript errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 