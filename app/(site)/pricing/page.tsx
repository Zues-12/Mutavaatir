import type { Metadata } from 'next'
import Footer from '@/components/footer'
import PricingPageHero from '@/components/pricing-page-hero'
import PricingPlans from '@/components/pricing-plans'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { PricingOffersJsonLd } from '@/components/pricing-offers-json-ld'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { subscriptionPlans } from '@/lib/pricing-data'
import { publicPageMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const lowestMonthlyPrice = Math.min(...subscriptionPlans.map((plan) => plan.pricePerMonth))

const pricingTitle = 'Pricing & Packages — Mutavaatir book subscriptions'
const pricingDescription =
  `Monthly, quarterly, and yearly Mutavaatir subscription plans. Curated books, bookmarks, and doorstep delivery across Pakistan — from Rs. ${lowestMonthlyPrice.toLocaleString('en-PK')} per month.`

export const metadata: Metadata = publicPageMetadata({
  title: pricingTitle,
  description: pricingDescription,
  path: '/pricing',
  extraKeywords: [
    'Mutavaatir pricing',
    'book subscription Pakistan',
    'monthly book box plans',
  ],
})

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ]}
      />
      <WebPageJsonLd
        path="/pricing"
        name={pricingTitle}
        description={pricingDescription}
      />
      <PricingOffersJsonLd />
      <PricingPageHero />
      <PricingPlans />
      <Footer />
    </>
  )
}
