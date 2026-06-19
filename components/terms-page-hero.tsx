import Image from 'next/image'

export default function TermsPageHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-void"
      aria-labelledby="terms-page-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/tandc-hero.webp"
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
          id="terms-page-hero-heading"
          className="font-display text-4xl font-medium tracking-wide text-brand-clay sm:text-5xl lg:text-6xl"
        >
          TERMS &amp; CONDITIONS
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-dust/70" aria-hidden />
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-mist sm:text-lg">
          Please read these terms before submitting your subscription.
        </p>
      </div>
    </section>
  )
}
