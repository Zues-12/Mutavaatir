import { MessageCircleHeart } from 'lucide-react'

export default function ReviewsCommunityNote() {
  return (
    <section
      aria-labelledby="reviews-community-heading"
      className="bg-brand-earth py-12 sm:py-14 lg:py-16"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center sm:flex-row sm:gap-8 sm:px-6 sm:text-left lg:px-8">
        <MessageCircleHeart
          className="h-20 w-20 shrink-0 text-brand-mist sm:h-24 sm:w-24 lg:h-28 lg:w-28"
          strokeWidth={0.8}
          aria-hidden
        />
        <div>
          <h2 id="reviews-community-heading" className="sr-only">
            Thank you from Mutavaatir
          </h2>
          <p className="text-base leading-relaxed text-brand-mist sm:text-lg">
            These reviews are a reflection of the trust <br/> our readers place in us.<br/> We love hearing from you all! <br/> Thank you for being part of Mutavaatir.
          </p>
        </div>
      </div>
    </section>
  )
}
