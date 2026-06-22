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
    <div className="flex w-full flex-col gap-8 rounded-lg border border-brand-earth/10 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-10">
      <ol className="flex flex-1 flex-col gap-3.5 sm:gap-4">
        {[...ratingOptions].reverse().map((rating) => {
          const count = stats.counts[rating]
          const width = stats.total > 0 ? (count / stats.total) * 100 : 0

          return (
            <li
              key={rating}
              className="grid grid-cols-[4.75rem_1fr_auto] items-center gap-3 sm:grid-cols-[5.25rem_1fr_auto] sm:gap-4"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-void">
                  {starLabels[rating]}
                </span>
                <Star
                  className="h-4 w-4 fill-brand-earth text-brand-earth"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-brand-mist" role="presentation">
                <div
                  className="h-full rounded-full bg-brand-earth transition-[width]"
                  style={{ width: `${width}%` }}
                />
              </div>

              <span className="min-w-10 text-right text-sm font-medium tabular-nums text-brand-void">
                {count}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="flex shrink-0 flex-col items-center text-center">
        <p className="font-display text-5xl font-medium leading-none text-brand-void sm:text-6xl">
          {stats.averageRating.toFixed(1)}
        </p>

        <div
          className="mt-4 flex items-center gap-1 text-brand-earth"
          aria-label={`${stats.averageRating} out of 5 stars`}
        >
          {ratingOptions.map((star) => (
            <Star
              key={star}
              className={[
                'h-4 w-4 sm:h-5 sm:w-5',
                star <= Math.round(stats.averageRating)
                  ? 'fill-current'
                  : 'fill-transparent text-brand-earth/30',
              ].join(' ')}
              strokeWidth={1.5}
              aria-hidden
            />
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-brand-earth">
          {stats.total} {stats.total === 1 ? 'rating' : 'ratings'}
        </p>
      </div>
    </div>
  )
}
