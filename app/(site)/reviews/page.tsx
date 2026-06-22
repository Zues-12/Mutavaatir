import type { Metadata } from 'next'
import Footer from '@/components/footer'
import ReviewsPageHero from '@/components/reviews-page-hero'
import ReviewsRatingSummary from '@/components/reviews-rating-summary'
import ReviewsGrid from '@/components/reviews-grid'
import ReviewsCommunityNote from '@/components/reviews-community-note'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { ReviewsAggregateJsonLd } from '@/components/reviews-aggregate-json-ld'
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
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Reviews', path: '/reviews' },
        ]}
      />
      <WebPageJsonLd path="/reviews" name={reviewsTitle} description={reviewsDescription} />
      <ReviewsAggregateJsonLd stats={stats} />
      <ReviewsPageHero />
      <section
        aria-labelledby="reviews-content-heading"
        className="bg-brand-mist py-10 sm:py-12 lg:py-14"
      >
        <div className="mx-auto max-w-7xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:space-y-7 lg:px-8">
          <h2 id="reviews-content-heading" className="sr-only">
            Reader reviews and ratings
          </h2>
          <ReviewsRatingSummary stats={stats} />
          <ReviewsGrid reviews={reviews} />
        </div>
      </section>
      <ReviewsCommunityNote />
      <Footer />
    </>
  )
}
