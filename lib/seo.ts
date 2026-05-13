import type { Metadata } from 'next'
import { getSiteUrl, siteConfig } from '@/lib/site'

/**
 * Canonical metadata for public marketing routes (homepage and inner pages).
 * Keeps OG/Twitter/hreflang aligned with the live URL from NEXT_PUBLIC_SITE_URL.
 */
export function publicPageMetadata(options: {
  title: string
  description: string
  path: '/' | string
  extraKeywords?: string[]
}): Metadata {
  const path = options.path.startsWith('/') ? options.path : `/${options.path}`
  const origin = getSiteUrl()
  const absoluteUrl = `${origin}${path === '/' ? '' : path}`

  const ogImagePath = siteConfig.ogImagePath.startsWith('/')
    ? siteConfig.ogImagePath
    : `/${siteConfig.ogImagePath}`

  return {
    title: {
      absolute: options.title,
    },
    description: options.description,
    keywords: [...siteConfig.seoKeywords, ...(options.extraKeywords ?? [])],
    alternates: {
      canonical: path,
      languages: {
        'en-PK': absoluteUrl,
        'x-default': absoluteUrl,
      },
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: absoluteUrl,
      locale: 'en_PK',
      alternateLocale: ['en'],
      type: 'website',
      siteName: siteConfig.name,
      images: [
        {
          url: ogImagePath,
          width: siteConfig.ogImageWidth,
          height: siteConfig.ogImageHeight,
          alt: `${siteConfig.name} — curated books and subscription`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [ogImagePath],
    },
  }
}
