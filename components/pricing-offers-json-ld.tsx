import { subscriptionPlans } from '@/lib/pricing-data'
import { getSiteUrl, siteConfig } from '@/lib/site'

export function PricingOffersJsonLd() {
  const siteUrl = getSiteUrl()

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/pricing#subscription-plans`,
    name: `${siteConfig.name} book subscription`,
    description: siteConfig.description,
    brand: { '@type': 'Brand', name: siteConfig.name },
    category: 'Book subscription box',
    offers: subscriptionPlans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.pricePerMonth,
      priceCurrency: 'PKR',
      url: `${siteUrl}/subscribe?plan=${plan.id}`,
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.pricePerMonth,
        priceCurrency: 'PKR',
        unitText: 'MONTH',
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
