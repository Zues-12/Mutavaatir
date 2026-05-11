/**
 * Central site constants for metadata, canonical URLs, and structured data.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://mutavaatir.com).
 */

const fallbackSiteUrl = 'https://mutavaatir.marsols.org'

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (url) return url.replace(/\/+$/, '')
  return fallbackSiteUrl
}

export const siteConfig = {
  name: 'Mutavaatir',
  titleTemplate: '%s | Mutavaatir',
  defaultTitle: 'Mutavaatir — A Book. Chosen For You. Delivered Monthly.',
  description:
    'Monthly book subscription box with handpicked books based on meaning, value and timeless reading.',
  tagline: 'A book. Chosen for you. Delivered monthly.',
  locale: 'en',
  twitterHandle: undefined as string | undefined,
} as const
