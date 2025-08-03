# Discord OAuth Setup Guide

This guide will help you set up Discord OAuth authentication for your Rugbot application using Supabase.

## Prerequisites

- A Discord application created in the Discord Developer Portal
- A Supabase project with authentication enabled
- Your Next.js application running locally

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your application a name (e.g., "Rugbot")
4. Click "Create"

## Step 2: Configure OAuth2 Settings

1. In your Discord application dashboard, go to the "OAuth2" section in the left sidebar
2. Under "Redirects", add the following URLs:
   - `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
3. Copy your **Client ID** and **Client Secret** (you'll need these for Supabase)

## Step 3: Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Discord** in the list and click to enable it
4. Enter your Discord application credentials:
   - **Client ID**: Your Discord application's Client ID
   - **Client Secret**: Your Discord application's Client Secret
5. Save the configuration

## Step 4: Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[YOUR_SUPABASE_ANON_KEY]
SUPABASE_SECRET_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]
```

Replace the placeholder values with your actual Supabase project credentials.

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click the "Connect Discord" button
4. You should be redirected to Discord for authorization
5. After authorizing, you should be redirected back to your app and be signed in

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URLs in your Discord application match exactly with what Supabase expects
   - Check that there are no trailing slashes or extra characters

2. **"Client ID or secret is invalid" error**
   - Double-check your Discord Client ID and Client Secret
   - Make sure you copied them from the correct Discord application

3. **"OAuth provider not enabled" error**
   - Ensure Discord is enabled in your Supabase Authentication settings
   - Check that you've saved the provider configuration

4. **Callback URL not working**
   - Verify that your callback route (`/auth/callback`) is properly configured
   - Check the browser console for any JavaScript errors

### Debug Steps

1. Check the browser console for error messages
2. Verify your environment variables are loaded correctly
3. Test the OAuth flow in an incognito/private browser window
4. Check the Supabase logs in your project dashboard

## Discord OAuth Scopes

By default, Discord OAuth requests the following scopes:
- `identify` - Access to user's Discord username and avatar
- `email` - Access to user's email address (if available)

You can modify these scopes in your Supabase Discord provider settings if needed.

## Security Considerations

1. **Never commit your Client Secret to version control**
2. **Use environment variables for all sensitive configuration**
3. **Regularly rotate your Discord Client Secret**
4. **Monitor your OAuth usage and logs**

## Next Steps

Once Discord OAuth is working:

1. Customize the user experience after successful authentication
2. Add role-based access control if needed
3. Implement user profile management
4. Add additional OAuth providers as needed

## Support

If you encounter issues:

1. Check the [Supabase Authentication documentation](https://supabase.com/docs/guides/auth)
2. Review the [Discord OAuth2 documentation](https://discord.com/developers/docs/topics/oauth2)
3. Check the browser console and Supabase logs for error details 