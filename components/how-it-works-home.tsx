'use client'

import { useLayoutEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Wand2, BookOpenText, PackageOpen } from 'lucide-react'
import { Fragment } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type Step = {
  readonly number: string
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
}

const steps: Step[] = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'SUBMIT YOUR FORM',
    description:
      'Fill out our short form to help us know your reading preferences.',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'WE PICK YOUR BOOK',
    description:
      'We handpick a book just for you based on your set preferences.',
  },
  {
    number: '03',
    icon: PackageOpen,
    title: 'WE PACK & SHIP',
    description:
      'Your book is packed with care and shipped right to your doorstep.',
  },
  {
    number: '04',
    icon: BookOpenText,
    title: 'YOU READ & ENJOY',
    description:
      'Unbox, read, and enjoy a story picked just for you — yours to keep forever.',
  },
]

/** Thin chevron only — no stem — for step separators. */
function StepChevron() {
  return (
    <svg
      className="h-14 w-7 shrink-0 text-brand-clay sm:h-16 sm:w-8"
      viewBox="0 0 32 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 12 L22 36 L8 60"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function HowItWorksHome() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const chevronRefs = useRef<(HTMLDivElement | null)[]>([])
  const prefersReducedMotion = useReducedMotion()
  const animate = !prefersReducedMotion

  const setStepRef = (index: number) => (el: HTMLDivElement | null) => {
    stepRefs.current[index] = el
  }

  const setChevronRef = (index: number) => (el: HTMLDivElement | null) => {
    chevronRefs.current[index] = el
  }

  useLayoutEffect(() => {
    if (!animate) return

    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin) return

    const stepEls = stepRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    const chevronEls = chevronRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    if (stepEls.length === 0) return

    const lgMedia = window.matchMedia('(min-width: 1024px)')

    const ctx = gsap.context(() => {
      const revealStep = (step: HTMLElement, fromY = 32) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: fromY },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      if (!lgMedia.matches) {
        stepEls.forEach((step) => revealStep(step, 24))
        return
      }

      gsap.set(stepEls, { opacity: 0, y: 32 })
      gsap.set(chevronEls, { opacity: 0, scale: 0.92 })

      const stepDuration = 1
      const chevronDuration = 0.35
      const endHold = 0.25
      const scrollPerStep = 110

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'center center',
          end: () => `+=${scrollPerStep * steps.length + 80}`,
          pin,
          pinSpacing: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      steps.forEach((_, index) => {
        const step = stepEls[index]
        if (!step) return

        tl.to(
          step,
          {
            opacity: 1,
            y: 0,
            duration: stepDuration,
            ease: 'power2.out',
          },
          index === 0 ? 0 : '>',
        )

        const chevron = chevronEls[index]
        if (chevron) {
          tl.to(
            chevron,
            {
              opacity: 1,
              scale: 1,
              duration: chevronDuration,
              ease: 'power2.out',
            },
            '<0.25',
          )
        }
      })

      tl.to({}, { duration: endHold })
    }, section)

    const onBreakpointChange = () => {
      ScrollTrigger.refresh()
    }

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh()
    })
    resizeObserver.observe(section)
    lgMedia.addEventListener('change', onBreakpointChange)

    return () => {
      lgMedia.removeEventListener('change', onBreakpointChange)
      resizeObserver.disconnect()
      ctx.revert()
    }
  }, [animate])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="how-heading"
      className="bg-brand-mist"
    >
      <div ref={pinRef} className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="max-w-md shrink-0 lg:max-w-[min(16rem,22vw)] xl:max-w-xs">
            <h2
              id="how-heading"
              className="font-display mr-4 text-4xl leading-none font-medium tracking-tight text-brand-void sm:text-5xl lg:text-3xl xl:text-5xl"
            >
              HOW IT WORKS
            </h2>
            <div className="mt-4 h-px w-12 bg-brand-clay" aria-hidden />
            <p className="mt-4 font-display text-lg leading-relaxed font-normal tracking-normal text-brand-earth sm:text-xl lg:text-base xl:text-xl">
              Simple. Personal.
              <br />
              Meaningful.
            </p>
          </div>

          <div
            className="flex min-w-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-2"
            role="list"
          >
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <Fragment key={step.number}>
                  <div
                    ref={animate ? setStepRef(index) : undefined}
                    data-how-step=""
                    className={cn(
                      'flex min-w-0 flex-1 flex-col will-change-[opacity,transform] lg:basis-0',
                      animate && 'lg:translate-y-8 lg:opacity-0',
                    )}
                    role="listitem"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display text-3xl font-normal leading-none tracking-tight text-brand-dust sm:text-4xl">
                        {step.number}
                      </span>
                      <Icon
                        className="ml-1 size-8 shrink-0 text-brand-earth sm:size-9"
                        strokeWidth={1.35}
                        aria-hidden
                      />
                    </div>
                    <h3 className="mt-3 font-display text-sm leading-tight font-semibold tracking-normal text-brand-earth sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-brand-earth sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      ref={animate ? setChevronRef(index) : undefined}
                      className={cn(
                        'hidden shrink-0 items-center justify-center self-center will-change-[opacity,transform] lg:flex',
                        animate && 'lg:scale-[0.92] lg:opacity-0',
                      )}
                      aria-hidden
                    >
                      <StepChevron />
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
