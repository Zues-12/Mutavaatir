import { Quote, Star } from 'lucide-react'
import { allReaderReviews } from '@/lib/reviews-data'

export default function ReviewsGrid() {
  return (
    <section
      aria-labelledby="reviews-grid-heading"
      className="bg-brand-mist py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="reviews-grid-heading" className="sr-only">
          Reader testimonials
        </h2>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7">
          {allReaderReviews.map((review) => (
            <li
              key={review.name}
              className="flex flex-col rounded-md border border-brand-earth/15 bg-brand-dust/25 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.08)] sm:p-6"
            >
              <Quote
                className="h-7 w-7 shrink-0 text-brand-earth"
                strokeWidth={1.7}
                fill="currentColor"
                aria-hidden
              />
              <p className="mt-4 min-h-[6.5rem] text-base leading-relaxed text-brand-void sm:min-h-[7rem] sm:text-lg">
                {review.quote}
              </p>
              <div className="mt-6 flex items-end justify-between gap-4 border-t border-brand-earth/10 pt-5">
                <p className="font-display text-sm font-semibold tracking-wide text-brand-earth">
                  — {review.name}
                </p>
                <div className="flex shrink-0 items-center gap-1 text-brand-earth" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" strokeWidth={1.6} />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
