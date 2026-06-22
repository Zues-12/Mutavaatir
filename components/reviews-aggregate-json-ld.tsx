import type { PublicReviewStats } from '@/lib/review-queries'
import { getSiteUrl, siteConfig } from '@/lib/site'

export function ReviewsAggregateJsonLd({ stats }: { stats: PublicReviewStats }) {
  if (stats.total < 1 || stats.averageRating < 1) return null

  const siteUrl = getSiteUrl()
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/reviews#product-reviews`,
    name: `${siteConfig.name} monthly book subscription`,
    description: siteConfig.description,
    brand: { '@type': 'Brand', name: siteConfig.name },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: stats.averageRating,
      reviewCount: stats.total,
      bestRating: 5,
      worstRating: 1,
    },
    url: `${siteUrl}/reviews`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
