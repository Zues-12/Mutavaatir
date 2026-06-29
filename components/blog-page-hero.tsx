import Image from 'next/image'

export default function BlogPageHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-void"
      aria-labelledby="blog-page-hero-heading"
    >
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/review-hero.webp"
          alt=""
          fill
          className="object-cover object-right sm:object-center"
          sizes="100vw"
          priority
          quality={85}
        />
      </div>
      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-brand-void/78" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="font-display text-[0.62rem] font-medium uppercase tracking-[0.35em] text-brand-clay">
          Mutavaatir
        </p>
        <h1
          id="blog-page-hero-heading"
          className="mt-3 font-display text-4xl font-medium tracking-wide text-brand-mist sm:text-5xl lg:text-6xl"
        >
          READING NOTES
        </h1>
        <div className="mt-5 h-px w-12 bg-brand-dust/50" aria-hidden />
        <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-dust sm:text-lg">
          Essays, reflections, and letters on books, reading, and the stories that stay with you.
        </p>
      </div>
    </section>
  )
}
