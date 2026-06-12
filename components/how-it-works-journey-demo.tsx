'use client'

import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import {
  journeyCheckpoints,
  journeyPhrases,
  type JourneyCheckpoint,
  type JourneyPhrase,
} from '@/lib/how-it-works-journey-data'

gsap.registerPlugin(ScrollTrigger)

type Point = { x: number; y: number }

type StepLayout = {
  align: 'left' | 'right'
  anchorOffset: 'left' | 'right'
  phraseIndex?: number
}

const stepLayouts: StepLayout[] = [
  { align: 'left', anchorOffset: 'left', phraseIndex: 0 },
  { align: 'right', anchorOffset: 'right', phraseIndex: 1 },
  { align: 'left', anchorOffset: 'left', phraseIndex: 2 },
  { align: 'right', anchorOffset: 'right', phraseIndex: 3 },
  { align: 'left', anchorOffset: 'left', phraseIndex: 4 },
  { align: 'right', anchorOffset: 'right' },
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

function FloatingPhrase({
  phrase,
  className,
  phraseRef,
}: {
  phrase: JourneyPhrase
  className?: string
  phraseRef?: React.Ref<HTMLParagraphElement>
}) {
  return (
    <p
      ref={phraseRef}
      className={cn(
        'journey-phrase relative z-10 rounded-lg bg-brand-mist px-3 py-2 font-display text-base italic tracking-wide text-brand-earth/70 sm:text-lg',
        phrase.align === 'left' && 'text-left',
        phrase.align === 'right' && 'text-right',
        phrase.align === 'center' && 'text-center',
        className,
      )}
    >
      {phrase.text}
    </p>
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
        'journey-checkpoint relative z-10 max-w-[17rem] rounded-xl bg-brand-mist px-4 py-3 sm:max-w-xs sm:px-5 sm:py-4',
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
    </article>
  )
}

function JourneyStep({
  checkpoint,
  layout,
  panelRef,
  anchorRef,
  phraseRef,
}: {
  checkpoint: JourneyCheckpoint
  layout: StepLayout
  panelRef: React.Ref<HTMLElement>
  anchorRef: React.Ref<HTMLSpanElement>
  phraseRef?: React.Ref<HTMLParagraphElement>
}) {
  const phrase =
    layout.phraseIndex !== undefined ? journeyPhrases[layout.phraseIndex] : undefined
  const textOnLeft = layout.align === 'left'

  return (
    <section className="relative flex min-h-[70vh] flex-col justify-center overflow-visible py-10 sm:min-h-[65vh] sm:py-14">
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
                className="max-w-[11rem]"
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
                className="max-w-[11rem]"
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
  const anchorRefs = useRef<(HTMLSpanElement | null)[]>([])
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const phraseRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const scrollProgressRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const setAnchorRef = (index: number) => (el: HTMLSpanElement | null) => {
    anchorRefs.current[index] = el
  }

  const setPanelRef = (index: number) => (el: HTMLElement | null) => {
    panelRefs.current[index] = el
  }

  const setPhraseRef = (index: number) => (el: HTMLParagraphElement | null) => {
    phraseRefs.current[index] = el
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
      panelRefs.current.forEach((panel) => {
        if (panel) gsap.set(panel, { opacity: 1, y: 0 })
      })
      phraseRefs.current.forEach((phrase) => {
        if (phrase) gsap.set(phrase, { opacity: 1, y: 0 })
      })
      anchorRefs.current.forEach((anchor) => {
        if (anchor) {
          gsap.set(anchor, {
            borderColor: 'rgba(61, 47, 35, 0.35)',
            backgroundColor: '#7b6244',
            color: '#f5ebe0',
          })
        }
      })
    }

    if (prefersReducedMotion) {
      applyReducedMotion()
      return
    }

    let resizeObserver: ResizeObserver | undefined

    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel) => {
        if (panel) gsap.set(panel, { opacity: 0.22, y: 20 })
      })
      phraseRefs.current.forEach((phrase) => {
        if (phrase) gsap.set(phrase, { opacity: 0, y: 12 })
      })

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

      panelRefs.current.forEach((panel) => {
        if (!panel) return

        gsap.to(panel, {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 74%',
            end: 'top 48%',
            scrub: 0.4,
          },
        })
      })

      anchorRefs.current.forEach((anchor) => {
        if (!anchor) return

        gsap.to(anchor, {
          borderColor: 'rgba(61, 47, 35, 0.45)',
          backgroundColor: '#7b6244',
          color: '#f5ebe0',
          scale: 1.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: anchor,
            start: 'top 68%',
            end: 'top 50%',
            scrub: 0.4,
          },
        })
      })

      phraseRefs.current.forEach((phrase) => {
        if (!phrase) return

        gsap.to(phrase, {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: phrase,
            start: 'top 82%',
            end: 'top 58%',
            scrub: 0.35,
          },
        })
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

      <section className="relative z-10 px-5 pt-24 pb-12 sm:px-8 sm:pt-28 md:px-12 lg:px-16">
        <div className="mx-auto max-w-2xl rounded-xl bg-brand-mist px-4 py-2 text-center">
          <p className="font-display text-[11px] tracking-[0.35em] text-brand-earth uppercase">
            Demo journey
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-wide text-brand-void sm:text-4xl lg:text-5xl">
            How it works
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-earth/80 sm:text-base">
            Scroll down as the path winds left and right — a quiet journey from
            preferences to your shelf.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl overflow-visible px-5 sm:px-8 md:px-12">
        {journeyCheckpoints.map((checkpoint, index) => (
          <JourneyStep
            key={checkpoint.id}
            checkpoint={checkpoint}
            layout={stepLayouts[index]}
            panelRef={setPanelRef(index)}
            anchorRef={setAnchorRef(index)}
            phraseRef={
              stepLayouts[index].phraseIndex !== undefined
                ? setPhraseRef(stepLayouts[index].phraseIndex!)
                : undefined
            }
          />
        ))}

        <p className="relative z-10 rounded-lg bg-brand-mist px-4 py-2 pb-28 text-center font-display text-xs italic text-brand-earth/85 sm:pb-32 sm:text-sm">
          &ldquo;Every book is chosen with intention.&rdquo;
        </p>
      </div>
    </div>
  )
}
