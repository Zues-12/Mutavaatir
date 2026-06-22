import { subscriptionPlans } from '@/lib/pricing-data'
import { getOgImagePath } from '@/lib/seo'
import { getSiteUrl, siteConfig } from '@/lib/site'

const planPrices = subscriptionPlans.map((plan) => plan.pricePerMonth)

export function OrganizationJsonLd() {
  const siteUrl = getSiteUrl()
  const ogImagePath = getOgImagePath()
  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}${siteConfig.logoPath}`,
        },
        image: `${siteUrl}${ogImagePath}`,
        areaServed: {
          '@type': 'Country',
          name: 'Pakistan',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        alternateName: siteConfig.defaultTitle,
        description: siteConfig.description,
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: ['en-PK', 'en'],
        potentialAction: {
          '@type': 'ReadAction',
          target: `${siteUrl}/subscribe`,
        },
      },
      {
        '@type': 'Product',
        '@id': `${siteUrl}/#subscription`,
        name: `${siteConfig.name} monthly subscription`,
        description: siteConfig.description,
        brand: { '@type': 'Brand', name: siteConfig.name },
        category: 'Book subscription box',
        image: `${siteUrl}${ogImagePath}`,
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: Math.min(...planPrices),
          highPrice: Math.max(...planPrices),
          priceCurrency: 'PKR',
          offerCount: subscriptionPlans.length,
          url: `${siteUrl}/pricing`,
          availability: 'https://schema.org/InStock',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
