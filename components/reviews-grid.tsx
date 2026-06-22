import ReviewCard from '@/components/review-card'
import type { PublicReview } from '@/lib/review-queries'

type ReviewsGridProps = {
  reviews: readonly PublicReview[]
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-center text-base leading-relaxed text-brand-earth">
        Published reader reviews will appear here.
      </p>
    )
  }

  return (
    <ul className="columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-7">
      {reviews.map((review) => (
        <li key={review.id} className="mb-5 break-inside-avoid sm:mb-6 lg:mb-7">
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  )
}
