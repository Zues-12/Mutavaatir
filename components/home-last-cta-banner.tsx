import Link from 'next/link'

export default function HomeLastCtaBanner() {
  return (
    <section
      aria-labelledby="last-cta-heading"
      className="relative isolate w-full overflow-hidden bg-brand-void bg-[url('/last-section-bg.png')] bg-left bg-no-repeat max-xl:min-h-[12.75rem] max-xl:bg-cover xl:aspect-[1024/116] xl:min-h-0 xl:bg-[length:100%_auto]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-brand-void/45 xl:hidden"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] flex-col items-center justify-center gap-1.5 px-4 py-3 text-center max-xl:py-5 sm:gap-2 xl:min-h-0 xl:gap-1 xl:py-2 2xl:gap-2 2xl:py-3">
        <h2
          id="last-cta-heading"
          className="font-display max-w-[20ch] text-xl font-medium leading-[1.05] tracking-tight text-brand-mist sm:max-w-none sm:text-2xl sm:leading-none md:text-3xl xl:text-2xl 2xl:text-4xl"
        >
          A NEW STORY.
          <span className="font-normal"> EVERY MONTH.</span>
        </h2>

        <div className="flex flex-col items-center gap-1.5 xl:gap-1">
          <div
            className="size-1.5 shrink-0 rotate-45 bg-brand-mist/95 sm:size-2"
            aria-hidden
          />
          <div className="flex w-full max-w-xl items-center justify-center gap-2 sm:gap-3">
            <span
              className="hidden h-px min-w-[1.25rem] bg-brand-mist/55 sm:block sm:min-w-[2rem] md:min-w-[3rem]"
              aria-hidden
            />
            <p className="font-display max-w-[min(100%,22rem)] text-[0.7rem] font-normal leading-snug tracking-wide text-brand-mist/95 sm:max-w-none sm:text-xs md:text-sm xl:max-w-[min(100%,28rem)] xl:text-[0.7rem] xl:leading-tight 2xl:text-sm">
              Open your door to surprise, meaning and inspiration.
            </p>
            <span
              className="hidden h-px min-w-[1.25rem] bg-brand-mist/55 sm:block sm:min-w-[2rem] md:min-w-[3rem]"
              aria-hidden
            />
          </div>
        </div>

        <Link
          href="/pricing"
          className="font-display mt-0.5 bg-brand-clay px-5 py-2.5 text-[0.65rem] font-medium tracking-wider text-brand-mist transition-colors duration-300 hover:bg-brand-earth sm:px-7 sm:py-3 sm:text-xs xl:mt-1 xl:py-2 xl:text-[0.65rem] 2xl:py-2.5 2xl:text-xs"
        >
          SUBSCRIBE NOW
        </Link>
      </div>
    </section>
  )
}
