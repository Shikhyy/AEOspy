import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AEOspy — AI Visibility Intelligence Platform',
  description:
    "Audit your brand's presence across ChatGPT, Gemini, Perplexity and more. Discover where AI engines cite you and where they don't.",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0E0D0B] text-[#F2EDE4]">
        {children}
      </body>
    </html>
  )
}
