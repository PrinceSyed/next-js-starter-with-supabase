import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Rugbot Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <Link href="/" className="flex items-center">
              <span className="text-foreground font-display font-bold text-xl tracking-tight">
                Rugbot.ai
              </span>
            </Link>
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/leaderboard" 
              className="text-foreground hover:text-muted-foreground transition-colors duration-200 font-medium"
            >
              Leaderboard
            </Link>
            <Button variant="outline">
              Log In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 