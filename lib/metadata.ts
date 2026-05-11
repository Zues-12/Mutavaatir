import type { Metadata } from 'next'
import { getSiteUrl, siteConfig } from '@/lib/site'

const siteUrl = getSiteUrl()

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [
    'book subscription',
    'monthly books',
    'Mutavaatir',
    'reading subscription',
    'curated books',
  ],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: `${siteConfig.locale}_US`,
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/mutavaatir-circle.ico',
    apple: '/mutavaatir-circle.ico',
    shortcut: '/mutavaatir-circle.ico',
  },
}
