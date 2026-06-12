'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { TermsSection } from '@/lib/terms-data'
import { cn } from '@/lib/utils'

const INACTIVE_OPACITY = 0.22
const SCRUB_AMOUNT = 0.7
const LG_MEDIA_QUERY = '(min-width: 1024px)'

function useMinWidthLg() {
  const [isLg, setIsLg] = useState(false)

  useLayoutEffect(() => {
    const media = window.matchMedia(LG_MEDIA_QUERY)
    const update = () => setIsLg(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isLg
}

function getElementFont(el: HTMLElement) {
  const style = window.getComputedStyle(el)
  return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
}

function wrapLineIfNeeded(line: string, maxWidth: number, font: string) {
  if (maxWidth <= 0) return [line]

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return [line]

  context.font = font
  if (context.measureText(line).width <= maxWidth) return [line]

  const words = line.split(/\s+/).filter(Boolean)
  const wrapped: string[] = []
  let currentLine = ''

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    if (context.measureText(candidate).width > maxWidth && currentLine) {
      wrapped.push(currentLine)
      currentLine = word
    } else {
      currentLine = candidate
    }
  }

  if (currentLine) wrapped.push(currentLine)
  return wrapped.length > 0 ? wrapped : [line]
}

function resolveDisplayLines(sourceLines: string[], maxWidth: number, font: string) {
  return sourceLines.flatMap((line) => wrapLineIfNeeded(line, maxWidth, font))
}

type TermsScrollBlockProps = {
  section: TermsSection
  index: number
  isLast: boolean
  animate: boolean
}

function TermsScrollBlock({ section, index, isLast, animate }: TermsScrollBlockProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLUListElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[]>(section.lines)
  const isLg = useMinWidthLg()
  const showIntro = animate && index === 0 && isLg

  useLayoutEffect(() => {
    if (!animate) {
      setLines(section.lines)
      return
    }

    const listEl = linesRef.current
    if (!listEl) return

    const measureLines = () => {
      const width = listEl.clientWidth
      const font = getElementFont(listEl)
      setLines(resolveDisplayLines(section.lines, width, font))
    }

    measureLines()

    const observer = new ResizeObserver(measureLines)
    observer.observe(listEl)

    return () => observer.disconnect()
  }, [animate, section.lines])

  useLayoutEffect(() => {
    if (!animate) return

    const sectionEl = sectionRef.current
    const listEl = linesRef.current
    if (!sectionEl || !listEl) return

    const lineNodes = Array.from(listEl.querySelectorAll<HTMLElement>('[data-term-line]'))
    if (lineNodes.length === 0) return

    const fontSizePx = parseFloat(window.getComputedStyle(listEl).fontSize) || 20
    const lineHeightRaw = window.getComputedStyle(listEl).lineHeight
    const lineHeightPx =
      lineHeightRaw === 'normal'
        ? fontSizePx * 1.55
        : parseFloat(lineHeightRaw) || fontSizePx * 1.55

    const vpH = window.innerHeight
    const vpY = vpH / 2
    const at = `${vpY}px`
    const before = `${vpY + lineHeightPx}px`

    const scrollRunway = Math.max(0, lineNodes.length - 1) * lineHeightPx
    const viewportPadding = vpH * (isLg ? 0.72 : 0.3)
    sectionEl.style.minHeight = `${scrollRunway + viewportPadding}px`

    const ctx = gsap.context(() => {
      const introEl = introRef.current

      if (showIntro && introEl) {
        gsap.set(introEl, { opacity: 1 })
        if (lineNodes[0]) gsap.set(lineNodes[0], { opacity: INACTIVE_OPACITY })

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 58%',
            end: '+=300',
            scrub: SCRUB_AMOUNT,
          },
        })
          .to(introEl, { opacity: 0, ease: 'none' })
          .to(lineNodes[0] ?? introEl, { opacity: 1, ease: 'none' }, '<0.15')
      } else if (lineNodes[0]) {
        gsap.set(lineNodes[0], { opacity: 1 })
      }

      lineNodes.forEach((el, lineIndex) => {
        if (lineIndex === 0) return

        gsap.fromTo(
          el,
          { opacity: INACTIVE_OPACITY },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: `center ${before}`,
              end: `center ${at}`,
              scrub: SCRUB_AMOUNT,
            },
          },
        )
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => {
      sectionEl.style.minHeight = ''
      ctx.revert()
    }
  }, [animate, isLg, lines, section.lines, showIntro])

  const headingId = `terms-section-${index}`

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={cn(
        animate
          ? 'pb-8 last:pb-12 sm:pb-12 sm:last:pb-16 lg:pb-44 lg:last:pb-52'
          : 'py-8 sm:py-12',
        showIntro && 'lg:min-h-[92vh]',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
          animate
            ? 'grid grid-cols-1 items-start gap-3 sm:gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20'
            : 'max-w-3xl space-y-4',
        )}
      >
        <div
          className={cn(
            animate &&
              'sticky top-21 z-20 -mx-4 w-[calc(100%+2rem)] self-start sm:-mx-6 sm:w-[calc(100%+3rem)] lg:contents',
          )}
        >
          <h2
            id={headingId}
            className={cn(
              'font-display font-medium tracking-wide text-brand-void',
              animate
                ? 'bg-brand-mist px-4 py-3 text-3xl sm:px-6 sm:text-4xl sm:py-3.5 lg:sticky lg:top-[calc(50vh-2.75rem)] lg:z-auto lg:bg-transparent lg:px-0 lg:py-0 lg:text-5xl lg:leading-[1.08] xl:text-6xl'
                : 'text-xl sm:text-2xl',
            )}
          >
            {section.title}
          </h2>
          {animate ? (
            <div
              aria-hidden
              className="pointer-events-none h-10 bg-linear-to-b from-brand-mist from-15% via-brand-mist/75 via-45% to-transparent sm:h-12 lg:hidden"
            />
          ) : null}
        </div>

        {animate ? (
          <div className="relative lg:pt-[calc(50vh-2.75rem)]">
            {showIntro ? (
              <div
                ref={introRef}
                className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-start gap-4"
              >
                <p className="sr-only">Scroll to read the terms.</p>
                <p
                  aria-hidden
                  className="font-display text-sm font-medium uppercase tracking-[0.22em] text-brand-earth/80 sm:text-base mt-6"
                >
                  Scroll to read
                </p>
                <ChevronDown
                  className="h-5 w-5 text-brand-clay motion-safe:animate-[terms-scroll-cue_2.1s_ease-in-out_infinite]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
            ) : null}

            <ul
              ref={linesRef}
              className="m-0 -mt-5 list-none p-0 text-lg leading-[1.55] text-brand-earth sm:-mt-6 sm:text-xl lg:mt-0 lg:text-2xl lg:leading-[1.55] xl:text-[1.75rem]"
            >
              {lines.map((line, lineIndex) => (
                <li
                  key={`${section.title}-${lineIndex}-${line}`}
                  data-term-line=""
                  className="will-change-[opacity]"
                  style={
                    showIntro || lineIndex > 0 ? { opacity: INACTIVE_OPACITY } : undefined
                  }
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-3 text-sm leading-relaxed text-brand-earth sm:text-base">
            {section.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {isLast && !animate ? (
        <p className="mx-auto mt-10 max-w-3xl px-4 text-center text-sm text-brand-earth sm:px-6">
          <Link
            href="/subscribe"
            className="font-display uppercase tracking-wider text-brand-void underline decoration-brand-clay/60 underline-offset-4 transition-colors hover:text-brand-clay"
          >
            ← Back to subscribe
          </Link>
        </p>
      ) : null}
    </section>
  )
}

type TermsScrollContentProps = {
  sections: TermsSection[]
}

export default function TermsScrollContent({ sections }: TermsScrollContentProps) {
  const rootRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    gsap.registerPlugin(ScrollTrigger)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [prefersReducedMotion])

  const animate = !prefersReducedMotion

  return (
    <section
      ref={rootRef}
      aria-label="Terms and conditions"
      className="bg-brand-mist py-4 sm:py-2 lg:py-16"
    >
      <div className="sr-only">
        {sections.map((section) => `${section.title}. ${section.lines.join(' ')}`).join(' ')}
      </div>

      {sections.map((section, index) => (
        <TermsScrollBlock
          key={section.title}
          section={section}
          index={index}
          isLast={index === sections.length - 1}
          animate={animate}
        />
      ))}

      {animate ? (
        <p className="mx-auto max-w-7xl px-4 pt-8 text-center text-sm text-brand-earth sm:px-6 lg:px-8">
          <Link
            href="/subscribe"
            className="font-display uppercase tracking-wider text-brand-void underline decoration-brand-clay/60 underline-offset-4 transition-colors hover:text-brand-clay"
          >
            ← Back to subscribe
          </Link>
        </p>
      ) : null}
    </section>
  )
}
