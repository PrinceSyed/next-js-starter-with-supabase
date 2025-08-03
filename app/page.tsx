import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SupabaseTest } from "@/components/SupabaseTest";
import { TwitterLoginButton } from "@/components/auth/TwitterLoginButton";
import { DiscordLoginButton } from "@/components/auth/DiscordLoginButton";
import { DiscordOAuthTest } from "@/components/auth/DiscordOAuthTest";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { UserProfile } from "@/components/auth/UserProfile";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { AuthDebug } from "@/components/auth/AuthDebug";
import { OAuthErrorDisplay } from "@/components/auth/OAuthErrorDisplay";
import { GoogleSignOutButton } from "@/components/auth/GoogleSignOutButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-6xl font-display font-black text-foreground tracking-tight">
              Rugbot
            </h1>
            <AuthStatus />
          </div>
          <p className="text-xl text-muted-foreground">
            A persuasive role-playing game with AI chatbot
          </p>
          <Badge variant="secondary" className="text-sm">
            Powered by OpenRouter & Solana
          </Badge>
        </div>

        {/* OAuth Error Display */}
        <OAuthErrorDisplay />

        {/* Supabase Test */}
        <SupabaseTest />

        {/* Auth Debug - Temporary for troubleshooting */}
        <AuthDebug />

        {/* User Profile - Shows when authenticated */}
        <UserProfile />

        {/* Google Sign Out Button */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-display font-bold text-2xl">
              Google Authentication
            </CardTitle>
            <CardDescription>
              Manage your Google account connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleSignOutButton />
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-display font-bold text-2xl">
                Twitter Auth
              </CardTitle>
              <CardDescription>
                Sign in with your Twitter account via Supabase OAuth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TwitterLoginButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-display font-bold text-2xl">
                Discord Auth
              </CardTitle>
              <CardDescription>
                Sign in with your Discord account via Supabase OAuth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiscordLoginButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-display font-bold text-2xl">
                AI Chat
              </CardTitle>
              <CardDescription>
                Engage with an LLM role-playing chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* All OAuth Providers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-display font-bold text-2xl">
              All OAuth Providers
            </CardTitle>
            <CardDescription>
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <OAuthButton provider="google" />
            <OAuthButton provider="discord" />
            <OAuthButton provider="twitter" />
          </CardContent>
        </Card>

        {/* Discord OAuth Test */}
        <DiscordOAuthTest />

        {/* Chat Interface Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display font-bold text-3xl">
              Chat Interface Preview
            </CardTitle>
            <CardDescription>
              This is how the chat interface will look
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">AI Bot</span>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  Hello! I'm the AI bot. Try to persuade me with your arguments...
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 justify-end">
                <span className="text-sm text-muted-foreground">You</span>
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
              </div>
              <div className="bg-secondary p-3 rounded-lg">
                <p className="text-sm text-secondary-foreground">
                  Let me try to convince you...
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Input 
                placeholder="Type your message..." 
                className="flex-1"
              />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>

        {/* Typography Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display font-black text-4xl">
              Typography System
            </CardTitle>
            <CardDescription>
              PP Watch Display Font + Space Grotesk Body Font (Default)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h1 className="font-display font-black text-5xl text-foreground">Display Black</h1>
              <h2 className="font-display font-bold text-4xl text-foreground">Display Bold</h2>
              <h3 className="font-display font-medium text-3xl text-foreground">Display Medium</h3>
              <h4 className="font-display font-extralight text-2xl text-foreground">Display Extralight</h4>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-border">
              <p className="text-lg text-foreground">Body text using Space Grotesk (default)</p>
              <p className="text-base text-muted-foreground">
                This is the body text that will be used throughout the application for readability and consistency. Space Grotesk is now the default font for all text.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display font-bold text-3xl">Design System Colors</CardTitle>
            <CardDescription>
              Our custom warm brown color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-primary rounded-lg"></div>
                <p className="text-xs text-center">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-secondary rounded-lg"></div>
                <p className="text-xs text-center">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-accent rounded-lg"></div>
                <p className="text-xs text-center">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-muted rounded-lg"></div>
                <p className="text-xs text-center">Muted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
