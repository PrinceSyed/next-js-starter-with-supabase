'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


interface Post {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    user_name?: string
  }
}

export default function PostsPage() {
  const { user, loading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        setError('Failed to load posts')
        return
      }

      setPosts(posts || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to create a post')
      return
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Debug: Log user data
      console.log('Creating post with user data:', {
        userId: user.id,
        userEmail: user.email,
        userMetadata: user.user_metadata,
        postData: {
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          user_id: user.id,
          user_metadata: {
            full_name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url,
            user_name: user.user_metadata?.user_name || user.user_metadata?.name
          }
        }
      })

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            user_id: user.id,
            user_metadata: {
              full_name: user.user_metadata?.full_name || user.email,
              avatar_url: user.user_metadata?.avatar_url,
              user_name: user.user_metadata?.user_name || user.user_metadata?.name
            }
          }
        ])
        .select()

      if (error) {
        console.error('Error creating post:', error)
        setError(`Failed to create post: ${error.message}`)
        return
      }

      console.log('Post created successfully:', data)

      // Reset form and refresh posts
      setNewPost({ title: '', content: '' })
      await fetchPosts()
      
    } catch (err) {
      console.error('Error creating post:', err)
      setError('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-display font-bold text-2xl">
                Access Denied
              </CardTitle>
              <CardDescription>
                You must be logged in to view and create posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please sign in with your preferred OAuth provider to continue.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-black text-foreground tracking-tight">
            Posts
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your thoughts with the community
          </p>
          <Badge variant="secondary" className="text-sm">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </Badge>
        </div>

        {/* Create Post Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-display font-bold text-2xl">
              Create New Post
            </CardTitle>
            <CardDescription>
              Share something with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  required
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your post content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {newPost.content.length}/1000 characters
                </p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting || !newPost.title.trim() || !newPost.content.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Post...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-display font-bold text-2xl">
              Recent Posts
            </CardTitle>
            <CardDescription>
              Latest posts from the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts yet. Be the first to create one!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src={post.user_metadata?.avatar_url} alt={post.user_metadata?.full_name} />
                        <AvatarFallback>
                          {post.user_metadata?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium">
                            {post.user_metadata?.full_name || 'Anonymous User'}
                          </p>
                          {post.user_metadata?.user_name && (
                            <Badge variant="outline" className="text-xs">
                              @{post.user_metadata.user_name}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>
                    </div>
                                         <div className="border-t border-border mt-4"></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 