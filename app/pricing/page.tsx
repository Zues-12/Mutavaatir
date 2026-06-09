import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PricingPageHero from '@/components/pricing-page-hero'
import PricingPlans from '@/components/pricing-plans'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const pricingTitle = 'Pricing & Packages — Mutavaatir book subscriptions'
const pricingDescription =
  'Monthly, quarterly, and yearly Mutavaatir subscription plans. Curated books, bookmarks, and doorstep delivery across Pakistan — from Rs. 1,200 per month.'

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
      <WebPageJsonLd
        path="/pricing"
        name={pricingTitle}
        description={pricingDescription}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-brand-void" tabIndex={-1}>
        <PricingPageHero />
        <PricingPlans />
        <Footer />
      </main>
    </>
  )
}
