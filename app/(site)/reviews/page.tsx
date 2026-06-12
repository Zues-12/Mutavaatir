import type { Metadata } from 'next'
import Footer from '@/components/footer'
import ReviewsPageHero from '@/components/reviews-page-hero'
import ReviewsGrid from '@/components/reviews-grid'
import ReviewsCommunityNote from '@/components/reviews-community-note'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const reviewsTitle = 'Reviews — What readers say about Mutavaatir'
const reviewsDescription =
  'Real testimonials from Mutavaatir readers — unedited words about our monthly book subscription, curation and delivery across Pakistan.'

export const metadata: Metadata = publicPageMetadata({
  title: reviewsTitle,
  description: reviewsDescription,
  path: '/reviews',
  extraKeywords: ['Mutavaatir reviews', 'book subscription reviews', 'reader testimonials'],
})

export default function ReviewsPage() {
  return (
    <>
      <WebPageJsonLd path="/reviews" name={reviewsTitle} description={reviewsDescription} />
      <ReviewsPageHero />
      <ReviewsGrid />
      <ReviewsCommunityNote />
      <Footer />
    </>
  )
}
