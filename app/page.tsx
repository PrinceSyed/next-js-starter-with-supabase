import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiscordLoginButton } from "@/components/auth/DiscordLoginButton";
import { OAuthButton } from "@/components/auth/OAuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-display font-black text-foreground tracking-tight">
            Rugbot
          </h1>
          <p className="text-xl text-muted-foreground">
            A persuasive role-playing game with AI chatbot
          </p>
          <Badge variant="secondary" className="text-sm">
            Powered by OpenRouter & Solana
          </Badge>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-display font-bold text-2xl">
                Sign in with Google
              </CardTitle>
              <CardDescription>
                Use your Google account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OAuthButton provider="google" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary font-display font-bold text-2xl">
                Sign in with Discord
              </CardTitle>
              <CardDescription>
                Use your Discord account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiscordLoginButton />
            </CardContent>
          </Card>
        </div>

        {/* Posts Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-display font-bold text-2xl">
              Community Posts
            </CardTitle>
            <CardDescription>
              Create and view community posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <a href="/posts">View Posts</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
