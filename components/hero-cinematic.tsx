import { ArrowRight } from 'lucide-react'
import { OriginLink, originCircleColors } from '@/components/origin-button'
import HeroBackgroundVideo from '@/components/hero-background-video'

export default function HeroCinematic() {
  return (
    <section
      id="home"
      className="relative isolate -mt-21 min-h-svh overflow-hidden lg:-mt-24"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-21 bottom-0 lg:-top-24"
        aria-hidden
      >
        <HeroBackgroundVideo />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void/70 via-brand-void/10 to-transparent" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-35 mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      <div className="relative z-10 flex min-h-svh flex-col justify-end px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-10 lg:pb-14 xl:px-14 xl:pb-16">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 xl:gap-16">
          <h1
            id="hero-heading"
            className="font-sans text-[clamp(3.25rem,12.5vw,10rem)] leading-[0.88] font-normal tracking-[-0.03em] text-brand-mist lg:max-w-[min(68%,50rem)]"
          >
            Mutavaatir
            <span className="text-brand-clay" aria-hidden>
              *
            </span>
          </h1>

          <div className="flex w-full max-w-xs flex-col gap-5 sm:max-w-sm lg:w-72 lg:max-w-none lg:shrink-0 xl:w-80">
            <p className="text-sm leading-relaxed text-brand-mist/95 sm:text-[0.9375rem] sm:leading-6">
              Mutavaatir is a monthly book subscription box that brings you handpicked books
              based on meaning, value and timeless reading.
            </p>
            <OriginLink
              href="/subscribe"
              id="pricing"
              circleColor={originCircleColors.void}
              className="inline-flex w-fit items-center gap-3 rounded-full bg-brand-mist py-2.5 pl-6 pr-2.5 text-sm font-medium text-brand-void transition-colors duration-300 hover:bg-white"
            >
              Get started
              <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-void text-brand-mist">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </OriginLink>
          </div>
        </div>
      </div>
    </section>
  )
}
