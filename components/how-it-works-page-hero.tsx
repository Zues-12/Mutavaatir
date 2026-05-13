import Image from 'next/image'

export default function HowItWorksPageHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-void"
      aria-labelledby="how-it-works-page-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/how-hero.png"
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
          id="how-it-works-page-hero-heading"
          className="font-display text-4xl font-medium tracking-wide text-brand-clay sm:text-5xl lg:text-6xl"
        >
          HOW IT WORKS
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-dust/70" aria-hidden />
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-mist sm:text-lg">
          Simple. Personal. Meaningful. Here&apos;s how your subscription comes together—step by step.
        </p>
      </div>
    </section>
  )
}
