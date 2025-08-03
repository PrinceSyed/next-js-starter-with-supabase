# Environment Variables Setup Guide

This guide will help you set up the required environment variables for your Rugbot application.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[YOUR_SUPABASE_ANON_KEY]
SUPABASE_SECRET_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]
```

## How to Get These Values

### 1. Supabase Project URL
1. Go to your Supabase project dashboard
2. Click on **Settings** in the left sidebar
3. Click on **API**
4. Copy the **Project URL** (starts with `https://`)

### 2. Supabase Anon Key (Publishable Key)
1. In the same API settings page
2. Copy the **anon public** key (starts with `eyJ...`)

### 3. Supabase Service Role Key (Secret Key)
1. In the same API settings page
2. Copy the **service_role** key (starts with `eyJ...`)
3. **Important**: Keep this secret and never expose it in client-side code

## Example .env.local File

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xiugnmlhuvxxdeswqzlq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdWdubWxodXZ4eGRlc3dxemxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ5NzQsImV4cCI6MjA1MDU1MDk3NH0.example
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdWdubWxodXZ4eGRlc3dxemxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk3NDk3NCwiZXhwIjoyMDUwNTUwOTc0fQ.example
```

## Environment Variable Types

### NEXT_PUBLIC_ Variables
- These are exposed to the browser
- Safe to use in client-side code
- Required for authentication and database operations

### Private Variables (no NEXT_PUBLIC_ prefix)
- These are only available on the server
- Used for admin operations and API routes
- Never exposed to the browser

## Troubleshooting

### "Missing environment variable" error
1. Make sure your `.env.local` file is in the project root
2. Restart your development server after adding environment variables
3. Check that the variable names are exactly as shown above
4. Verify that the values are copied correctly from Supabase

### "Invalid API key" error
1. Double-check that you copied the correct keys from Supabase
2. Make sure you're using the anon key for client-side operations
3. Verify that your Supabase project is active and not paused

### Development vs Production
- For development: Use `.env.local`
- For production: Set environment variables in your hosting platform (Vercel, Netlify, etc.)

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Keep your service role key secret**
3. **Use the anon key for client-side operations**
4. **Only use the service role key in API routes or server components**

## Testing Your Setup

After setting up the environment variables:

1. Restart your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Try signing in with an OAuth provider
4. Navigate to `/posts` and try creating a post
5. Check the browser console for any errors

If everything works, your environment variables are configured correctly! 