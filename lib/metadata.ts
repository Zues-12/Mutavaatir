import type { Metadata } from 'next'
import { getSocialImageMetadata } from '@/lib/seo'
import { getSiteUrl, siteConfig } from '@/lib/site'

const siteUrl = getSiteUrl()
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
const socialImage = getSocialImageMetadata()

/** Root metadata merged with route-level `generateMetadata` / `metadata` exports. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  /** Fallback for routes that do not export their own description. */
  description: siteConfig.description,
  keywords: [...siteConfig.seoKeywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Books & Literature',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-PK': siteUrl,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    alternateLocale: ['en'],
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [socialImage.url],
    ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle } : {}),
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
    icon: siteConfig.logoPath,
    apple: siteConfig.logoPath,
    shortcut: siteConfig.logoPath,
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}
