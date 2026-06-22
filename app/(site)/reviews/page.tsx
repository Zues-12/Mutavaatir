import type { Metadata } from 'next'
import Footer from '@/components/footer'
import ReviewsPageHero from '@/components/reviews-page-hero'
import ReviewsRatingSummary from '@/components/reviews-rating-summary'
import ReviewsGrid from '@/components/reviews-grid'
import ReviewsCommunityNote from '@/components/reviews-community-note'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { getPublicReviewStats, listPublicReviews } from '@/lib/review-queries'
import { publicPageMetadata } from '@/lib/seo'

const reviewsTitle = 'Reviews — What readers say about Mutavaatir'
const reviewsDescription =
  'Real testimonials from Mutavaatir readers — unedited words about our monthly book subscription, curation and delivery across Pakistan.'

export const metadata: Metadata = publicPageMetadata({
  title: reviewsTitle,
  description: reviewsDescription,
  path: '/reviews',
  extraKeywords: ['Mutavaatir reviews', 'book subscription reviews', 'reader testimonials'],
})

export default async function ReviewsPage() {
  const [stats, reviews] = await Promise.all([getPublicReviewStats(), listPublicReviews()])

  return (
    <>
      <WebPageJsonLd path="/reviews" name={reviewsTitle} description={reviewsDescription} />
      <ReviewsPageHero />
      <ReviewsRatingSummary stats={stats} />
      <ReviewsGrid reviews={reviews} />
      <ReviewsCommunityNote />
      <Footer />
    </>
  )
}
