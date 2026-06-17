'use client'

import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import {
  journeyCheckpoints,
  journeyHighlights,
  journeyPhrases,
  type JourneyCheckpoint,
  type JourneyPhrase,
} from '@/lib/how-it-works-journey-data'
import {
  JourneyCheckpointIllustration,
  JourneyDecorDots,
  JourneyDecorSwirl,
} from '@/components/how-it-works-journey-illustrations'

gsap.registerPlugin(ScrollTrigger)

type Point = { x: number; y: number }

type StepLayout = {
  align: 'left' | 'right'
  anchorOffset: 'left' | 'right'
  phraseIndex?: number
  illustrationSide: 'left' | 'right'
}

const stepLayouts: StepLayout[] = [
  { align: 'left', anchorOffset: 'left', phraseIndex: 0, illustrationSide: 'right' },
  { align: 'right', anchorOffset: 'right', phraseIndex: 1, illustrationSide: 'left' },
  { align: 'left', anchorOffset: 'left', phraseIndex: 2, illustrationSide: 'right' },
  { align: 'right', anchorOffset: 'right', phraseIndex: 3, illustrationSide: 'left' },
  { align: 'left', anchorOffset: 'left', phraseIndex: 4, illustrationSide: 'right' },
  { align: 'right', anchorOffset: 'right', illustrationSide: 'left' },
]

function getCenterInRoot(el: HTMLElement, root: HTMLElement): Point {
  const rootRect = root.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - rootRect.left + elRect.width / 2,
    y: elRect.top - rootRect.top + elRect.height / 2,
  }
}

function buildSmoothPath(points: Point[], tension = 0.38): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }

  return d
}

function JourneyIntro({
  introRef,
  introCopyRef,
  highlightRefs,
}: {
  introRef: React.Ref<HTMLDivElement>
  introCopyRef: React.Ref<HTMLParagraphElement>
  highlightRefs: (index: number) => (el: HTMLDivElement | null) => void
}) {
  return (
    <div ref={introRef} className="journey-intro relative z-10 mb-6 sm:mb-10">
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:mt-10 sm:gap-5">
        {journeyHighlights.map((item, index) => (
          <div
            key={item.label}
            ref={highlightRefs(index)}
            className="journey-highlight rounded-xl border border-brand-earth/15 bg-[#faf6f0]/80 px-3 py-4 text-center shadow-[0_2px_12px_-6px_rgba(13,13,13,0.12)] sm:px-4 sm:py-5"
          >
            <p className="font-display text-2xl font-medium tracking-wide text-brand-earth sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-1 text-[10px] tracking-[0.18em] text-brand-earth/65 uppercase sm:text-[11px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FloatingPhrase({
  phrase,
  className,
  phraseRef,
}: {
  phrase: JourneyPhrase
  className?: string
  phraseRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <div ref={phraseRef} className={cn('journey-phrase-wrap relative', className)}>
      <JourneyDecorSwirl className="absolute -top-6 size-10 opacity-70 sm:-top-8 sm:size-12" />
      <p
        className={cn(
          'journey-phrase relative z-10 rounded-xl border border-brand-earth/10 bg-[#faf6f0] px-4 py-3 font-display text-base italic tracking-wide text-brand-earth/75 shadow-[0_2px_14px_-6px_rgba(13,13,13,0.14)] sm:text-lg',
          phrase.align === 'left' && 'text-left',
          phrase.align === 'right' && 'text-right',
          phrase.align === 'center' && 'text-center',
        )}
      >
        <span className="text-brand-earth/45" aria-hidden>
          &ldquo;
        </span>
        {phrase.text}
        <span className="text-brand-earth/45" aria-hidden>
          &rdquo;
        </span>
      </p>
    </div>
  )
}

function CheckpointAnchor({
  checkpoint,
  anchorRef,
}: {
  checkpoint: JourneyCheckpoint
  anchorRef?: React.Ref<HTMLSpanElement>
}) {
  const Icon = checkpoint.icon

  return (
    <span
      ref={anchorRef}
      className="journey-anchor relative z-20 flex size-11 shrink-0 origin-center items-center justify-center rounded-full border border-brand-earth/25 bg-[#faf6f0] text-brand-earth shadow-[0_2px_10px_-4px_rgba(13,13,13,0.18)] sm:size-12"
    >
      <Icon className="size-[1.125rem] sm:size-5" strokeWidth={1.5} aria-hidden />
    </span>
  )
}

function CheckpointContent({
  checkpoint,
  panelRef,
  align,
}: {
  checkpoint: JourneyCheckpoint
  panelRef?: React.Ref<HTMLElement>
  align: 'left' | 'right'
}) {
  return (
    <article
      ref={panelRef}
      className={cn(
        'journey-checkpoint relative z-10 max-w-[18rem] rounded-xl border border-brand-earth/10 bg-[#faf6f0] px-4 py-3.5 shadow-[0_4px_20px_-8px_rgba(13,13,13,0.16)] sm:max-w-xs sm:px-5 sm:py-4',
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
      )}
    >
      <p className="text-[10px] tracking-[0.22em] text-brand-earth uppercase sm:text-[11px]">
        <span className="mr-2 text-brand-void/55">{checkpoint.number}</span>
        {checkpoint.tag}
      </p>
      <h2 className="mt-1 font-display text-lg leading-snug font-medium tracking-wide text-brand-void sm:text-xl">
        {checkpoint.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-brand-earth/75">
        {checkpoint.description}
      </p>
      <ul
        className={cn(
          'mt-3 space-y-1.5 border-t border-brand-earth/10 pt-3',
          align === 'right' && 'sm:text-right',
        )}
      >
        {checkpoint.details.map((detail) => (
          <li
            key={detail}
            data-journey-detail
            className={cn(
              'flex items-start gap-2 text-xs leading-relaxed text-brand-earth/70 sm:text-[13px]',
              align === 'right' && 'sm:flex-row-reverse sm:text-right',
            )}
          >
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-clay/80"
              aria-hidden
            />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function StepIllustration({
  checkpoint,
  side,
  illustrationRef,
}: {
  checkpoint: JourneyCheckpoint
  side: 'left' | 'right'
  illustrationRef: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={illustrationRef}
      className={cn(
        'journey-illustration pointer-events-none absolute top-1/2 z-[5] hidden -translate-y-1/2 sm:block',
        side === 'left' && 'left-0 md:left-2 lg:left-6',
        side === 'right' && 'right-0 md:right-2 lg:right-6',
      )}
    >
      <JourneyDecorDots className="absolute -top-4 left-1/2 size-16 -translate-x-1/2 opacity-80 sm:-top-6 sm:size-20" />
      <div className="relative size-32 md:size-40 lg:size-48">
        <JourneyCheckpointIllustration
          id={checkpoint.illustration}
          className="relative z-10 h-full w-full drop-shadow-[0_8px_24px_-12px_rgba(123,98,68,0.35)]"
        />
        <JourneyCheckpointIllustration
          id={checkpoint.illustration}
          variant="background"
          className="absolute inset-0 translate-y-3 scale-125"
        />
      </div>
      <JourneyDecorSwirl
        className={cn(
          'absolute size-12 opacity-60 sm:size-14',
          side === 'left' ? '-right-2 bottom-0' : '-left-2 bottom-0',
        )}
      />
    </div>
  )
}

function JourneyStep({
  checkpoint,
  layout,
  panelRef,
  anchorRef,
  phraseRef,
  illustrationRef,
  sectionRef,
  mobileIllustrationRef,
}: {
  checkpoint: JourneyCheckpoint
  layout: StepLayout
  panelRef: React.Ref<HTMLElement>
  anchorRef: React.Ref<HTMLSpanElement>
  phraseRef?: React.Ref<HTMLDivElement>
  illustrationRef: React.Ref<HTMLDivElement>
  sectionRef: React.Ref<HTMLElement>
  mobileIllustrationRef: React.Ref<HTMLDivElement>
}) {
  const phrase =
    layout.phraseIndex !== undefined ? journeyPhrases[layout.phraseIndex] : undefined
  const textOnLeft = layout.align === 'left'

  return (
    <section
      ref={sectionRef}
      className="journey-step relative flex min-h-[72vh] flex-col justify-center overflow-visible py-10 sm:min-h-[68vh] sm:py-14"
    >
      <StepIllustration
        checkpoint={checkpoint}
        side={layout.illustrationSide}
        illustrationRef={illustrationRef}
      />

      <div
        ref={mobileIllustrationRef}
        className={cn(
          'journey-mobile-illustration pointer-events-none absolute z-0 sm:hidden',
          layout.illustrationSide === 'left' ? '-left-4 top-10' : '-right-4 top-10',
        )}
      >
        <JourneyCheckpointIllustration
          id={checkpoint.illustration}
          variant="background"
          className="size-44 opacity-[0.1]"
        />
      </div>

      <div className="grid grid-cols-1 items-center gap-8 overflow-visible sm:grid-cols-[minmax(0,1fr)_minmax(13rem,20rem)_minmax(0,1fr)] sm:gap-x-4 md:gap-x-8">
        <div
          className={cn(
            'relative z-10 flex overflow-visible',
            textOnLeft ? 'justify-center sm:justify-end sm:pr-3' : 'justify-center sm:justify-start sm:pl-3',
          )}
        >
          {textOnLeft ? (
            <CheckpointContent checkpoint={checkpoint} panelRef={panelRef} align="left" />
          ) : (
            phrase && (
              <FloatingPhrase
                phrase={phrase}
                phraseRef={phraseRef}
                className="max-w-[13rem] sm:max-w-[11rem]"
              />
            )
          )}
        </div>

        <div className="relative z-20 flex w-full items-center overflow-visible px-1 sm:px-0">
          <div
            className={cn(
              'flex w-full',
              layout.anchorOffset === 'left' && 'justify-start',
              layout.anchorOffset === 'right' && 'justify-end',
            )}
          >
            <CheckpointAnchor checkpoint={checkpoint} anchorRef={anchorRef} />
          </div>
        </div>

        <div
          className={cn(
            'relative z-10 flex overflow-visible',
            textOnLeft ? 'justify-center sm:justify-start sm:pl-3' : 'justify-center sm:justify-end sm:pr-3',
          )}
        >
          {textOnLeft ? (
            phrase && (
              <FloatingPhrase
                phrase={phrase}
                phraseRef={phraseRef}
                className="max-w-[13rem] sm:max-w-[11rem]"
              />
            )
          ) : (
            <CheckpointContent checkpoint={checkpoint} panelRef={panelRef} align="right" />
          )}
        </div>
      </div>
    </section>
  )
}

export default function HowItWorksJourneyDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const trackPathRef = useRef<SVGPathElement>(null)
  const progressPathRef = useRef<SVGPathElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const introCopyRef = useRef<HTMLParagraphElement>(null)
  const highlightRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const anchorRefs = useRef<(HTMLSpanElement | null)[]>([])
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const phraseRefs = useRef<(HTMLDivElement | null)[]>([])
  const illustrationRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobileIllustrationRefs = useRef<(HTMLDivElement | null)[]>([])
  const closingRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const setHighlightRef = (index: number) => (el: HTMLDivElement | null) => {
    highlightRefs.current[index] = el
  }

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el
  }

  const setAnchorRef = (index: number) => (el: HTMLSpanElement | null) => {
    anchorRefs.current[index] = el
  }

  const setPanelRef = (index: number) => (el: HTMLElement | null) => {
    panelRefs.current[index] = el
  }

  const setPhraseRef = (index: number) => (el: HTMLDivElement | null) => {
    phraseRefs.current[index] = el
  }

  const setIllustrationRef = (index: number) => (el: HTMLDivElement | null) => {
    illustrationRefs.current[index] = el
  }

  const setMobileIllustrationRef = (index: number) => (el: HTMLDivElement | null) => {
    mobileIllustrationRefs.current[index] = el
  }

  useLayoutEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    const trackPath = trackPathRef.current
    const progressPath = progressPathRef.current
    if (!root || !svg || !trackPath || !progressPath) return

    const syncPath = () => {
      const points = journeyCheckpoints
        .map((_, index) => anchorRefs.current[index])
        .filter((anchor): anchor is HTMLSpanElement => Boolean(anchor))
        .map((anchor) => getCenterInRoot(anchor, root))

      if (points.length < 2) return

      const d = buildSmoothPath(points)
      trackPath.setAttribute('d', d)
      progressPath.setAttribute('d', d)

      const length = progressPath.getTotalLength()
      progressPath.style.strokeDasharray = `${length}`
      progressPath.style.strokeDashoffset = `${length * (1 - scrollProgressRef.current)}`

      svg.setAttribute('viewBox', `0 0 ${root.clientWidth} ${root.scrollHeight}`)
      svg.style.width = `${root.clientWidth}px`
      svg.style.height = `${root.scrollHeight}px`
    }

    const applyReducedMotion = () => {
      syncPath()
      progressPath.style.strokeDashoffset = '0'

      const revealTargets = [
        introCopyRef.current,
        ...highlightRefs.current,
        ...panelRefs.current,
        ...phraseRefs.current,
        ...illustrationRefs.current,
        ...mobileIllustrationRefs.current,
        closingRef.current,
      ]

      revealTargets.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
      })

      anchorRefs.current.forEach((anchor) => {
        if (anchor) {
          gsap.set(anchor, {
            opacity: 1,
            scale: 1,
            borderColor: 'rgba(61, 47, 35, 0.35)',
            backgroundColor: '#7b6244',
            color: '#f5ebe0',
          })
        }
      })

      panelRefs.current.forEach((panel) => {
        if (!panel) return
        panel.querySelectorAll<HTMLElement>('[data-journey-detail]').forEach((detail) => {
          gsap.set(detail, { opacity: 1, x: 0, y: 0 })
        })
      })
    }

    if (prefersReducedMotion) {
      applyReducedMotion()
      return
    }

    let resizeObserver: ResizeObserver | undefined

    const ctx = gsap.context(() => {
      if (introCopyRef.current) gsap.set(introCopyRef.current, { opacity: 0, y: 24 })
      highlightRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 28, scale: 0.96 })
      })
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return
        const fromX = stepLayouts[index]?.align === 'left' ? -32 : 32
        gsap.set(panel, { opacity: 0, x: fromX, y: 28 })
      })
      phraseRefs.current.forEach((phrase) => {
        if (phrase) gsap.set(phrase, { opacity: 0, y: 20 })
      })
      illustrationRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 20, scale: 0.9 })
      })
      mobileIllustrationRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 16, scale: 0.92 })
      })
      if (closingRef.current) {
        closingRef.current.querySelectorAll<HTMLElement>('[data-journey-closing]').forEach((el) => {
          gsap.set(el, { opacity: 0, y: 24 })
        })
      }

      const revealOnScroll = (
        el: HTMLElement,
        {
          x = 0,
          y = 36,
          scale = 1,
          delay = 0,
          trigger,
          start = 'top 84%',
        }: {
          x?: number
          y?: number
          scale?: number
          delay?: number
          trigger?: HTMLElement
          start?: string
        } = {},
      ) => {
        gsap.fromTo(
          el,
          { opacity: 0, x, y, scale },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: trigger ?? el,
              start,
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      if (introCopyRef.current) {
        revealOnScroll(introCopyRef.current, { y: 24, start: 'top 90%' })
      }

      highlightRefs.current.forEach((highlight, index) => {
        if (!highlight) return
        revealOnScroll(highlight, {
          y: 28,
          scale: 0.96,
          delay: index * 0.1,
          trigger: introRef.current ?? highlight,
          start: 'top 88%',
        })
      })

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return

        const layout = stepLayouts[index]
        const fromX = layout?.align === 'left' ? -32 : 32

        gsap.set(panel, { opacity: 0, x: fromX, y: 28 })

        gsap.to(panel, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRefs.current[index] ?? panel,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        })

        const details = panel.querySelectorAll<HTMLElement>('[data-journey-detail]')
        details.forEach((detail, detailIndex) => {
          gsap.set(detail, { opacity: 0, x: fromX * 0.4, y: 12 })
          gsap.to(detail, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.65,
            delay: 0.2 + detailIndex * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRefs.current[index] ?? panel,
              start: 'top 76%',
              toggleActions: 'play none none reverse',
            },
          })
        })
      })

      phraseRefs.current.forEach((phrase, index) => {
        if (!phrase) return

        const layout = stepLayouts.find((item) => item.phraseIndex === index)
        const fromX =
          layout?.align === 'left' ? -28 : layout?.align === 'right' ? 28 : 0

        revealOnScroll(phrase, {
          x: fromX,
          y: 20,
          scale: 0.98,
          trigger: phrase,
          start: 'top 86%',
        })
      })

      illustrationRefs.current.forEach((illustration, index) => {
        if (!illustration) return

        const side = stepLayouts[index]?.illustrationSide ?? 'right'
        const fromX = side === 'left' ? -40 : 40

        revealOnScroll(illustration, {
          x: fromX,
          y: 20,
          scale: 0.9,
          trigger: sectionRefs.current[index] ?? illustration,
          start: 'top 80%',
        })
      })

      mobileIllustrationRefs.current.forEach((illustration, index) => {
        if (!illustration) return

        revealOnScroll(illustration, {
          y: 16,
          scale: 0.92,
          trigger: sectionRefs.current[index] ?? illustration,
          start: 'top 82%',
        })
      })

      anchorRefs.current.forEach((anchor, index) => {
        if (!anchor) return

        gsap.set(anchor, {
          opacity: 0,
          scale: 0.55,
          borderColor: 'rgba(123, 98, 68, 0.25)',
          backgroundColor: '#faf6f0',
          color: '#7b6244',
        })

        const section = sectionRefs.current[index] ?? anchor

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
          .to(anchor, {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: 'back.out(1.8)',
          })
          .to(
            anchor,
            {
              borderColor: 'rgba(61, 47, 35, 0.45)',
              backgroundColor: '#7b6244',
              color: '#f5ebe0',
              scale: 1.05,
              duration: 0.35,
              ease: 'power2.out',
            },
            '-=0.15',
          )
      })

      if (closingRef.current) {
        const closingChildren = closingRef.current.querySelectorAll<HTMLElement>(
          '[data-journey-closing]',
        )
        closingChildren.forEach((child, index) => {
          gsap.set(child, { opacity: 0, y: 24 })
          gsap.to(child, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: closingRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          })
        })
      }

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.55,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
          syncPath()
        },
      })

      syncPath()

      resizeObserver = new ResizeObserver(() => {
        syncPath()
        ScrollTrigger.refresh()
      })
      resizeObserver.observe(root)
    }, root)

    return () => {
      resizeObserver?.disconnect()
      ctx.revert()
    }
  }, [prefersReducedMotion])

  return (
    <div ref={rootRef} className="relative overflow-visible bg-brand-mist">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, rgba(159,134,102,0.12) 0%, transparent 42%), radial-gradient(circle at 80% 55%, rgba(123,98,68,0.1) 0%, transparent 38%), radial-gradient(circle at 40% 90%, rgba(191,171,146,0.14) 0%, transparent 45%)',
        }}
      />

      <svg
        ref={svgRef}
        className="pointer-events-none absolute top-0 left-0 z-0 overflow-visible"
        fill="none"
        aria-hidden
      >
        <path
          ref={trackPathRef}
          stroke="rgba(123, 98, 68, 0.22)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={progressPathRef}
          stroke="#6b5438"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl overflow-visible px-5 pt-10 sm:px-8 sm:pt-14 md:px-12">
        <JourneyIntro
          introRef={introRef}
          introCopyRef={introCopyRef}
          highlightRefs={setHighlightRef}
        />

        {journeyCheckpoints.map((checkpoint, index) => (
          <JourneyStep
            key={checkpoint.id}
            checkpoint={checkpoint}
            layout={stepLayouts[index]}
            sectionRef={setSectionRef(index)}
            panelRef={setPanelRef(index)}
            anchorRef={setAnchorRef(index)}
            illustrationRef={setIllustrationRef(index)}
            mobileIllustrationRef={setMobileIllustrationRef(index)}
            phraseRef={
              stepLayouts[index].phraseIndex !== undefined
                ? setPhraseRef(stepLayouts[index].phraseIndex!)
                : undefined
            }
          />
        ))}

        <div
          ref={closingRef}
          className="journey-closing relative z-10 mx-auto max-w-xl pb-28 text-center sm:pb-32"
        >
          <div data-journey-closing>
            <JourneyDecorDots className="mx-auto mb-4 size-14 opacity-70" />
          </div>
          <p
            data-journey-closing
            className="rounded-xl border border-brand-earth/10 bg-[#faf6f0] px-5 py-4 font-display text-sm italic leading-relaxed text-brand-earth/85 sm:text-base"
          >
            &ldquo;Every book is chosen with intention — because the right story at the
            right moment can stay with you forever.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
