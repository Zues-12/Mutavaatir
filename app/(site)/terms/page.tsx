import type { Metadata } from 'next'
import Footer from '@/components/footer'
import TermsPageHero from '@/components/terms-page-hero'
import TermsScrollContent from '@/components/terms-scroll-content'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { termsSections } from '@/lib/terms-data'
import { publicPageMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const termsTitle = 'Terms & Conditions — Mutavaatir'
const termsDescription =
  'Terms and conditions for Mutavaatir monthly book subscriptions, including payment, delivery, and cancellation policies.'

export const metadata: Metadata = publicPageMetadata({
  title: termsTitle,
  description: termsDescription,
  path: '/terms',
})

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Terms & conditions', path: '/terms' },
        ]}
      />
      <WebPageJsonLd path="/terms" name={termsTitle} description={termsDescription} />
      <TermsPageHero />
      <TermsScrollContent sections={termsSections} />
      <Footer />
    </>
  )
}
