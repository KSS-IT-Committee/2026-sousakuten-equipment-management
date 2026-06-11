import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { AccountNav } from "@/components/AccountNav";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    >
      {/* Google tag (gtag.js) — skipped on PR preview deployments.
          IS_PR_PREVIEW is injected at runtime by the deploy infra and read
          here server-side, so it must NOT be NEXT_PUBLIC_ (those inline at
          build time). */}
      {process.env.IS_PR_PREVIEW !== "true" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-DGM95SGSRQ"
            strategy="afterInteractive"
          ></Script>
          <Script id="google-analytics" strategy="afterInteractive">
            {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DGM95SGSRQ');
  `}
          </Script>
        </>
      )}
      <body>
        <Navbar accountSlot={<AccountNav />} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
