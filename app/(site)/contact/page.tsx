import type { Metadata } from 'next'
import Footer from '@/components/footer'
import ContactPageHero from '@/components/contact-page-hero'
import ContactSupportSection from '@/components/contact-support-section'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'

const contactTitle = 'Contact — Get in touch with Mutavaatir'
const contactDescription =
  'Reach the Mutavaatir team about subscriptions, deliveries, book curation, or anything else. We respond within a few business days.'

export const metadata: Metadata = publicPageMetadata({
  title: contactTitle,
  description: contactDescription,
  path: '/contact',
  extraKeywords: [
    'Mutavaatir contact',
    'book subscription support Pakistan',
    'Mutavaatir customer service',
  ],
})

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <WebPageJsonLd path="/contact" name={contactTitle} description={contactDescription} />
      <ContactPageHero />
      <ContactSupportSection />
      <Footer />
    </>
  )
}
