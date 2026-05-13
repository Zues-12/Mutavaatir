import type { Metadata } from 'next'
import { getSiteUrl, siteConfig } from '@/lib/site'

const siteUrl = getSiteUrl()
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

/** Root metadata merged with route-level `generateMetadata` / `metadata` exports. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  /** Fallback for routes that do not export their own description. */
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/mutavaatir-circle.ico',
    apple: '/mutavaatir-circle.ico',
    shortcut: '/mutavaatir-circle.ico',
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}
