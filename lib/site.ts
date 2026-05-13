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

/** Keywords for `<meta name="keywords">` and crawler hints only (not rendered as body copy). */
export const seoKeywords = [
  'Mutavaatir',
  'book subscription Pakistan',
  'monthly books Pakistan',
  'book box Pakistan',
  'book mail Pakistan',
  'bookmail',
  'curated books Pakistan',
  'reading subscription Pakistan',
  'book delivery Pakistan',
  'online book subscription',
  'handpicked books',
  'monthly book subscription',
  'Karachi books',
  'Lahore books',
  'Islamabad books',
] as const

export const siteConfig = {
  name: 'Mutavaatir',
  titleTemplate: '%s | Mutavaatir',
  defaultTitle: 'Mutavaatir — A Book. Chosen For You. Delivered Monthly.',
  /** Meta description / SERP snippet (not the same as on-page hero copy). */
  description:
    'Pakistan book subscription: handpicked books delivered monthly to your door. Curated reading, original copies, bookmarks & extras — book mail and monthly book boxes across Pakistan.',
  tagline: 'A book. Chosen for you. Delivered monthly.',
  locale: 'en',
  twitterHandle: undefined as string | undefined,
  /** Default social sharing image (under /public). */
  ogImagePath: '/mutavaatir-product.jpg',
  ogImageWidth: 1024,
  ogImageHeight: 1024,
  seoKeywords: [...seoKeywords],
} as const
