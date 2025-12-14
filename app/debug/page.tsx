import { GoogleOAuthChecklist } from '@/components/auth/GoogleOAuthChecklist'

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Google OAuth Setup</h1>
        <p className="text-muted-foreground mb-8">
          Use this checklist to configure Google OAuth authentication.
        </p>
        
        <div className="max-w-2xl">
          <GoogleOAuthChecklist />
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
      </div>
    </div>
  )
} 