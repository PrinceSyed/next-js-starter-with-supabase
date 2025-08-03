# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
SUPABASE_SECRET_KEY=your-service-role-key-here

# Optional: Site URL for OAuth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role secret** → `SUPABASE_SECRET_KEY`

## Twitter OAuth Setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Twitter provider
4. Configure Twitter OAuth:
   - **Client ID**: Your Twitter API Key
   - **Client Secret**: Your Twitter API Secret
   - **Redirect URL**: `https://your-project-id.supabase.co/auth/v1/callback`

## Twitter Developer App Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use existing one
3. In App Settings > User authentication settings:
   - Enable OAuth 1.0a
   - Set App permissions to "Read and write"
   - Add callback URLs:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)
4. Copy the API Key and API Secret to Supabase

## Troubleshooting

### 404 Error on OAuth Redirect
- Ensure your Supabase project URL is correct
- Check that Twitter OAuth is properly configured in Supabase
- Verify redirect URLs match between Twitter and Supabase

### Environment Variables Not Loading
- Restart your Next.js development server after adding `.env.local`
- Ensure variable names are exactly as shown above
- Check that `.env.local` is in the project root (not in subdirectories) 