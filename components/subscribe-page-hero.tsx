import Image from 'next/image'

export default function SubscribePageHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-void"
      aria-labelledby="subscribe-page-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/hero-pricing.png"
          alt=""
          fill
          className="object-cover object-right sm:object-center"
          sizes="100vw"
          priority
          quality={90}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-brand-void/75" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <h1
          id="subscribe-page-hero-heading"
          className="font-display text-4xl font-medium tracking-wide text-brand-clay sm:text-5xl lg:text-6xl"
        >
          MONTHLY BOOK SUBSCRIPTION
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-dust/70" aria-hidden />
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-mist sm:text-lg">
          Mutavaatir is a monthly subscription service where you will receive a
          randomly selected book every month, delivered to your doorstep. Fill out
          the form below to get started.
        </p>
      </div>
    </section>
  )
}
