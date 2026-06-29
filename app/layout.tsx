import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Oswald, Noto_Nastaliq_Urdu } from 'next/font/google'
import './globals.css'
import { OrganizationJsonLd } from '@/components/json-ld'
import ScrollToTopOnNavigate from '@/components/scroll-to-top-on-navigate'
import { rootMetadata } from '@/lib/metadata'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nastaliq',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = rootMetadata

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
    { media: '(prefers-color-scheme: light)', color: '#0d0d0d' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-PK" className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${notoNastaliqUrdu.variable} scrollbar-brand bg-brand-void`}>
      <body className="scrollbar-brand font-sans antialiased bg-brand-void text-brand-dust">
        <OrganizationJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-brand-mist focus:px-4 focus:py-3 focus:text-brand-void focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ScrollToTopOnNavigate />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
