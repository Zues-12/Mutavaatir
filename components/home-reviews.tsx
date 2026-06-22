import { Quote, Star } from 'lucide-react'
import { OriginLink, originCircleColors } from '@/components/origin-button'
import { listFeaturedPublicReviews } from '@/lib/review-queries'

function reviewerLabel(displayName: string | null): string {
  return displayName?.trim() || 'Verified Reader'
}

export default async function HomeReviews() {
  const reviews = await listFeaturedPublicReviews(5)

  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden bg-brand-void py-20 md:py-24"
    >
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{ backgroundImage: "url('/home-reviews-bg.webp')", backgroundPosition: 'right center' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-brand-void/70" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr] xl:gap-8">
          <div className="space-y-4 xl:pr-2">
            <div>
              <h2
                id="reviews-heading"
                className="font-display text-4xl leading-none font-medium tracking-tight text-brand-dust sm:text-5xl xl:text-6xl"
              >
                LOVED BY READERS
              </h2>
              <div className="mt-4 h-px w-14 bg-brand-clay/60" aria-hidden />
            </div>
            <p className="max-w-[24ch] text-lg leading-relaxed text-brand-dust/95 sm:text-xl">
              Real stories from readers who found their next favorite book with us.
            </p>
          </div>

          <div className="scrollbar-brand overflow-x-auto pb-2">
            <ul className="flex min-w-max items-stretch gap-3 md:gap-4">
              {reviews.map((review) => {
                const name = reviewerLabel(review.display_name)

                return (
                  <li
                    key={review.id}
                    className="flex w-[270px] shrink-0 flex-col rounded-sm bg-brand-mist p-5 text-brand-void shadow-[0_8px_25px_rgba(0,0,0,0.3)] md:w-[290px]"
                  >
                    <div className="flex items-center justify-end">
                      <Quote
                        className="h-7 w-7 text-brand-clay"
                        strokeWidth={1.7}
                        fill="currentColor"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-4 min-h-28 flex-1 text-xl leading-relaxed text-brand-void">
                      {review.feedback}
                    </p>
                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-display text-lg leading-none tracking-wide text-brand-void">
                          — {name}
                        </p>
                        <p className="font-display mt-1 text-xs tracking-wide text-brand-earth">
                          VERIFIED READER
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1 text-brand-void"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={[
                              'h-3.5 w-3.5',
                              index < review.rating ? 'fill-current' : 'fill-brand-earth/25',
                            ].join(' ')}
                            strokeWidth={1.6}
                            aria-hidden
                          />
                        ))}
                      </div>
                    </div>
                  </li>
                )
              })}

              <li className="flex w-[220px] shrink-0 md:w-[240px]">
                <OriginLink
                  href="/reviews"
                  circleColor={originCircleColors.mist}
                  labelClassName="transition-colors duration-300 group-hover:text-brand-void"
                  className="font-display flex h-full min-h-[280px] w-full flex-col items-center justify-center border border-brand-clay/70 bg-transparent px-6 py-8 text-center text-sm tracking-wide text-brand-dust transition-colors duration-300 hover:border-brand-mist"
                >
                  SEE ALL REVIEWS
                </OriginLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
