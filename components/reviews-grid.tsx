import { Quote, Star } from 'lucide-react'
import type { PublicReview } from '@/lib/review-queries'
import { cn } from '@/lib/utils'

type ReviewsGridProps = {
  reviews: readonly PublicReview[]
}

const placeholderTones = [
  'from-brand-earth to-brand-earth/85',
  'from-brand-clay to-brand-earth',
  'from-brand-earth/90 to-brand-clay/90',
  'from-brand-clay/95 to-brand-earth/80',
] as const

function reviewerLabel(review: PublicReview): string {
  return review.display_name?.trim() || 'Verified Reader'
}

function reviewerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'VR'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

function placeholderTone(name: string): (typeof placeholderTones)[number] {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % placeholderTones.length
  }
  return placeholderTones[hash]!
}

function ReviewerPlaceholder({ name }: { name: string }) {
  const initials = reviewerInitials(name)

  return (
    <div
      className={cn(
        'relative flex aspect-5/3 w-full items-center justify-center overflow-hidden bg-linear-to-br',
        placeholderTone(name),
      )}
      aria-hidden
    >
      <span className="pointer-events-none absolute inset-0 bg-brand-void/10" />
      <span className="pointer-events-none font-display text-[5rem] font-semibold leading-none tracking-wider text-brand-mist/15 sm:text-[5.5rem]">
        {initials}
      </span>
      <p className="relative max-w-[90%] px-4 text-center font-display text-lg font-medium uppercase tracking-wide text-brand-mist sm:text-xl">
        {name}
      </p>
    </div>
  )
}

function ReviewCard({ review }: { review: PublicReview }) {
  const name = reviewerLabel(review)

  return (
    <article className="overflow-hidden rounded-md border border-brand-earth/15 bg-brand-dust/25 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
      <ReviewerPlaceholder name={name} />

      <div className="flex flex-col p-5 sm:p-6">
        <Quote
          className="h-6 w-6 shrink-0 text-brand-earth"
          strokeWidth={1.7}
          fill="currentColor"
          aria-hidden
        />
        <p className="mt-3 text-base leading-relaxed text-brand-void sm:text-lg">{review.feedback}</p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-brand-earth/10 pt-4">
          <p className="font-display text-xs tracking-wide text-brand-earth uppercase">Verified reader</p>
          <div
            className="flex shrink-0 items-center gap-1 text-brand-earth"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={[
                  'h-3.5 w-3.5',
                  index < review.rating ? 'fill-current' : 'fill-brand-dust/40',
                ].join(' ')}
                strokeWidth={1.6}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  return (
    <section
      aria-labelledby="reviews-grid-heading"
      className="bg-brand-mist py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="reviews-grid-heading" className="sr-only">
          Reader testimonials
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center text-base leading-relaxed text-brand-earth sm:text-lg">
            Published reader reviews will appear here.
          </p>
        ) : (
          <ul className="columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-7">
            {reviews.map((review) => (
              <li key={review.id} className="mb-5 break-inside-avoid sm:mb-6 lg:mb-7">
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
