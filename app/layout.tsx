import type { Metadata } from "next";
import { spaceGrotesk, ppWatch } from "@/lib/fonts";
import { Navigation } from "@/components/ui/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rugbot - RPG Web App",
  description: "A persuasive role-playing game with AI chatbot powered by OpenRouter. Convince the bot to earn Solana tokens!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${ppWatch.variable} antialiased`}
      >
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
