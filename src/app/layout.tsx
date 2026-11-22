import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow_Condensed, Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AiwaRouteTransition } from "@/components/aiwa-route-transition";
import { AiwaGlobalEnding } from "@/components/aiwa-global-ending";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const aiwaText = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const aiwaDisplay = Barlow_Condensed({
  variable: "--font-aiwa-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const aiwaPoster = Anton({
  variable: "--font-aiwa-poster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aiwa Media Group | Creative, Digital & Technology Agency",
  description:
    "Aiwa Media Group is a Muscat-based creative, digital and technology agency. Branding, digital marketing, film production, events and software.",
  openGraph: {
    title: "Aiwa Media Group",
    description: "Ideas that move people. Creative, digital and technology, from Muscat to everywhere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${aiwaText.variable} ${aiwaDisplay.variable} ${aiwaPoster.variable} h-full antialiased`}
      data-aiwa-roc={process.env.AIWA_ROC_GROTESK_WOFF2_BASE64 || process.env.AIWA_ROC_GROTESK_B64_01 ? "true" : undefined}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AiwaGlobalEnding />
          <AiwaRouteTransition />
        </ThemeProvider>
      </body>
    </html>
  );
}
