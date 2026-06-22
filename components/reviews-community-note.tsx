import { OriginLink, originCircleColors } from '@/components/origin-button'

export default function ReviewsCommunityNote() {
  return (
    <section
      aria-labelledby="reviews-community-heading"
      className="border-t border-brand-earth/80 bg-brand-earth py-12 sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2
            id="reviews-community-heading"
            className="font-display text-2xl font-medium tracking-wide text-brand-mist sm:text-3xl"
          >
            Thank you for being part of Mutavaatir
          </h2>
          <div className="mt-4 h-px w-12 bg-brand-mist/35" aria-hidden />

          <p className="mt-5 text-base leading-relaxed text-brand-mist/95 sm:text-lg">
            These reviews reflect the trust our readers place in us. We love hearing from you
            all — every parcel, every note, every story matters.
          </p>

          <OriginLink
            href="/subscribe"
            circleColor={originCircleColors.mist}
            labelClassName="transition-colors duration-300 group-hover:text-brand-void"
            className="font-display mt-7 inline-flex border border-brand-mist/50 bg-brand-void px-6 py-3 text-xs font-semibold tracking-widest text-brand-mist transition-colors duration-300 hover:border-brand-mist sm:text-sm"
          >
            START YOUR SUBSCRIPTION
          </OriginLink>
        </div>
      </div>
    </section>
  )
}
