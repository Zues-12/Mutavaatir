import type { Metadata } from 'next'
import HowItWorksPageHero from '@/components/how-it-works-page-hero'
import HowItWorksFull from '@/components/how-it-works-full'
import Footer from '@/components/footer'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const howTitle = 'How It Works — Book Subscription Steps'
const howDescription =
  'Discover how Mutavaatir works from your reading preferences to a handpicked book, careful packing and delivery across Pakistan.'

export const metadata: Metadata = publicPageMetadata({
  title: howTitle,
  description: howDescription,
  path: '/how-it-works',
})

export default function HowItWorksPage() {
  return (
    <>
      <WebPageJsonLd path="/how-it-works" name={howTitle} description={howDescription} />
      <HowItWorksPageHero />
      <HowItWorksFull />
      <Footer />
    </>
  )
}
