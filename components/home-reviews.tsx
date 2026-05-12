import { Quote, Star } from 'lucide-react'

const reviews = [
  {
    quote:
      'Every month feels like Christmas! The books are always thoughtful and totally my vibe.',
    name: 'AYESHA',
  },
  {
    quote:
      'I love how Mutavaatir understands my taste so well. The surprise factor is the best part!',
    name: 'HAMZA',
  },
  {
    quote: 'Beautifully packed, amazing bookmarks, and great books. Worth every single penny.',
    name: 'ZOYA',
  },
] as const
const activeReview = 0

export default function HomeReviews() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden bg-brand-void py-10 md:py-14"
    >
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{ backgroundImage: "url('/home-reviews-bg.png')", backgroundPosition: 'right center' }}
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
            <button
              type="button"
              className="font-display border border-brand-clay/70 px-5 py-3 text-sm tracking-wide text-brand-dust transition-colors duration-300 hover:border-brand-mist hover:text-brand-mist"
            >
              SEE ALL REVIEWS
            </button>
          </div>

          <div className="overflow-x-auto pb-2">
            <ul className="flex min-w-max gap-3 md:gap-4 xl:min-w-0 xl:grid xl:grid-cols-3">
              {reviews.map((review) => (
                <li
                  key={review.name}
                  className="w-[270px] rounded-sm bg-brand-mist p-5 text-brand-void shadow-[0_8px_25px_rgba(0,0,0,0.3)] md:w-[290px] xl:w-auto"
                >
                  <Quote className="h-7 w-7 text-brand-clay" strokeWidth={1.7} aria-hidden />
                  <p className="mt-4 min-h-28 text-xl leading-relaxed text-brand-void">
                    {review.quote}
                  </p>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-display text-lg leading-none tracking-wide text-brand-void">
                        - {review.name}
                      </p>
                      <p className="font-display mt-1 text-xs tracking-wide text-brand-earth">
                        VERIFIED READER
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-brand-void" aria-label="5 stars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-current" strokeWidth={1.6} />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 xl:mt-6" aria-hidden>
          <span className="h-px w-8 bg-brand-earth/45" />
          {reviews.map((review, index) => (
            <span
              key={review.name}
              className={[
                'relative flex h-3 w-3 items-center justify-center rounded-full border',
                index === activeReview
                  ? 'border-brand-dust bg-brand-earth/30 shadow-[0_0_0_1px_rgba(227,212,197,0.2)]'
                  : 'border-brand-earth/55 bg-transparent',
              ].join(' ')}
            >
              <span
                className={[
                  'h-1.5 w-1.5 rounded-full',
                  index === activeReview ? 'bg-brand-mist' : 'bg-brand-earth/55',
                ].join(' ')}
              />
            </span>
          ))}
          <span className="h-px w-8 bg-brand-earth/45" />
        </div>
      </div>
    </section>
  )
}
