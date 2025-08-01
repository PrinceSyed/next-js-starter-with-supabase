import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

// Google Fonts
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Local Display Fonts - PP Watch
export const ppWatch = localFont({
  src: [
    {
      path: "../public/fonts/Font PP Watch/PPWatch-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Font PP Watch/PPWatch-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Font PP Watch/PPWatch-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Font PP Watch/PPWatch-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
}); 