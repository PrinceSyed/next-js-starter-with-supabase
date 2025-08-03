# Posts Table Setup Guide

This guide will help you create the `posts` table in your Supabase database for the posts functionality.

## Table Structure

The `posts` table should have the following structure:

```sql
-- Create the posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to read all posts
CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## How to Apply This Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the SQL above
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

1. Create a new migration file in your `supabase/migrations` folder
2. Name it something like `20240101000000_create_posts_table.sql`
3. Paste the SQL above into the file
4. Run `supabase db push` to apply the migration

## Table Fields Explanation

- **id**: Unique identifier for each post (auto-generated UUID)
- **title**: The post title (required, max 100 characters)
- **content**: The post content (required, max 1000 characters)
- **user_id**: References the authenticated user who created the post
- **user_metadata**: JSON field storing user info (name, avatar, username) at time of creation
- **created_at**: Timestamp when the post was created
- **updated_at**: Timestamp when the post was last updated

## Row Level Security (RLS)

The table includes RLS policies that:
- Allow all users to read posts
- Allow authenticated users to create posts
- Allow users to update/delete only their own posts

## Testing the Setup

After creating the table:

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/posts`
3. Sign in with any OAuth provider
4. Try creating a post
5. Verify the post appears in the list
6. Check your Supabase dashboard to see the data in the table

## Troubleshooting

### Common Issues

1. **"Table 'posts' does not exist" error**
   - Make sure you've run the SQL migration in your Supabase project
   - Check that the table name is exactly `posts` (lowercase)

2. **"Permission denied" error**
   - Ensure RLS policies are properly configured
   - Check that the user is authenticated
   - Verify the user_id matches the authenticated user

3. **"Foreign key constraint" error**
   - Make sure the `auth.users` table exists (it should by default)
   - Verify the user_id references a valid user

### Debug Steps

1. Check the browser console for error messages
2. Verify your Supabase connection in the dashboard
3. Test the table directly in the Supabase SQL editor
4. Check the RLS policies are enabled and configured correctly

## Next Steps

Once the posts table is working:

1. Add more fields as needed (tags, categories, etc.)
2. Implement post editing functionality
3. Add post deletion with confirmation
4. Implement post search and filtering
5. Add pagination for large numbers of posts 