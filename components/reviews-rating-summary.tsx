import { Star } from 'lucide-react'
import { ratingOptions } from '@/lib/reviews'
import type { PublicReviewStats } from '@/lib/review-queries'

const starLabels: Record<(typeof ratingOptions)[number], string> = {
  5: 'Five',
  4: 'Four',
  3: 'Three',
  2: 'Two',
  1: 'One',
}

type ReviewsRatingSummaryProps = {
  stats: PublicReviewStats
}

export default function ReviewsRatingSummary({ stats }: ReviewsRatingSummaryProps) {
  if (stats.total === 0) return null

  return (
    <section
      aria-labelledby="reviews-rating-summary-heading"
      className="border-b border-brand-earth/10 bg-brand-mist py-12 sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="reviews-rating-summary-heading" className="sr-only">
          Reader rating summary
        </h2>

        <div className="mx-auto flex max-w-4xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <ol className="flex flex-1 flex-col gap-3 sm:gap-3.5">
            {[...ratingOptions].reverse().map((rating) => {
              const count = stats.counts[rating]
              const width = stats.total > 0 ? (count / stats.total) * 100 : 0

              return (
                <li key={rating} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[5rem_1fr_auto] sm:gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs font-medium uppercase tracking-wider text-brand-earth">
                      {starLabels[rating]}
                    </span>
                    <Star className="h-3.5 w-3.5 fill-brand-clay text-brand-clay" strokeWidth={1.5} aria-hidden />
                  </div>

                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-brand-dust/35 sm:h-3"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-brand-clay transition-[width]"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <span className="min-w-10 text-right text-sm tabular-nums text-brand-void">
                    {count}
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="flex shrink-0 flex-col items-center rounded-md border border-brand-earth/15 bg-brand-dust/25 px-10 py-8 text-center shadow-[0_8px_25px_rgba(0,0,0,0.06)] sm:px-12 sm:py-10">
            <p className="font-display text-5xl font-medium leading-none text-brand-clay sm:text-6xl">
              {stats.averageRating.toFixed(1)}
            </p>

            <div
              className="mt-4 flex items-center gap-1 text-brand-clay"
              aria-label={`${stats.averageRating} out of 5 stars`}
            >
              {ratingOptions.map((star) => (
                <Star
                  key={star}
                  className={[
                    'h-4 w-4 sm:h-5 sm:w-5',
                    star <= Math.round(stats.averageRating) ? 'fill-current' : 'fill-brand-dust/50',
                  ].join(' ')}
                  strokeWidth={1.5}
                  aria-hidden
                />
              ))}
            </div>

            <p className="mt-4 text-sm text-brand-earth">
              {stats.total} {stats.total === 1 ? 'Rating' : 'Ratings'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
