import { getSiteUrl, siteConfig } from '@/lib/site'

export function OrganizationJsonLd() {
  const siteUrl = getSiteUrl()
  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
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
      },
      {
        '@type': 'Product',
        '@id': `${siteUrl}/#subscription`,
        name: `${siteConfig.name} monthly subscription`,
        description: siteConfig.description,
        brand: { '@type': 'Brand', name: siteConfig.name },
        category: 'Book subscription box',
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
