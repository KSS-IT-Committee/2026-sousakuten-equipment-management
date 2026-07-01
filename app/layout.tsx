import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { NoScriptAlert } from "@/components/NoScriptAlert";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Google Analytics 4 measurement ID for this app's GA property.
const GA_MEASUREMENT_ID = "G-DGM95SGSRQ";

export const metadata: Metadata = {
  title: "創作展 貸出備品管理サイト",
  description: "創作展中の備品貸出管理サイト",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

/**
 * Root layout component that applies global fonts, page-level HTML attributes, and renders app content.
 *
 * Renders an `<html lang="ja">` element with font-related CSS variables and utility classes, and a `<body>` that wraps the provided children.
 *
 * @param children - The React nodes to render inside the application's body
 * @returns The root HTML structure containing the rendered children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        {/*<ThemeProvider attribute="class" defaultTheme="system" enableSystem>*/}
        <NoScriptAlert />
        {/*<Navbar
            accountSlot={<AccountNav />}
            navSlot={
              <>
                <Internal>
                  <NavMenuLinks />
                </Internal>
                <NavRequestLink />
              </>
            }
          />*/}
        <main>{children}</main>
        <Footer />
        {/*</ThemeProvider>*/}
      </body>
      {/* Google tag (gtag.js) via @next/third-parties — the official Next.js
          integration. Skipped on PR preview deployments: IS_PR_PREVIEW is
          injected at runtime by the deploy infra and read here server-side, so
          it must NOT be NEXT_PUBLIC_ (those inline at build time). */}
      {GA_MEASUREMENT_ID && process.env.IS_PR_PREVIEW !== "true" && (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
