'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Swap these paths for your themed book cover assets in /public/book-covers/ */
const BOOK_COVERS = [
  '/mutavaatir-product.jpg',
  '/home-img1.png',
  '/month-experience.png',
  '/mutavaatir-product.jpg',
  '/home-img1.png',
  '/month-experience.png',
  '/mutavaatir-product.jpg',
  '/home-img1.png',
  '/month-experience.png',
  '/mutavaatir-product.jpg',
  '/home-img1.png',
  '/month-experience.png',
  '/mutavaatir-product.jpg',
  '/home-img1.png',
  '/month-experience.png',
  '/mutavaatir-product.jpg',
] as const

type AnimationPhase = 'initial' | 'images' | 'reveal'

const imageEase = [0.43, 0.01, 0.17, 1] as const
const textSpring = { type: 'spring' as const, bounce: 0, duration: 0.4 }

function AnimatedWords({
  text,
  phase,
  className,
  startDelay = 0,
}: {
  text: string
  phase: AnimationPhase
  className?: string
  startDelay?: number
}) {
  const words = text.split(' ')
  const visible = phase === 'reveal'

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={
            visible
              ? { opacity: 1, filter: 'blur(0px)', y: 0 }
              : { opacity: 0, filter: 'blur(10px)', y: 10 }
          }
          transition={{
            ...textSpring,
            delay: visible ? startDelay + index * 0.06 : 0,
          }}
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

function BookCover({
  src,
  alt,
  index,
  phase,
}: {
  src: string
  alt: string
  index: number
  phase: AnimationPhase
}) {
  const showImages = phase !== 'initial'
  const column = index % 4
  const stagger = column * 0.08 + Math.floor(index / 4) * 0.05

  return (
    <motion.div
      className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)]"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={
        showImages
          ? { opacity: 0.9, scale: 1 }
          : { opacity: 0, scale: 0.6 }
      }
      transition={{
        delay: showImages ? 0.3 + stagger : 0,
        duration: 0.6,
        ease: imageEase,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 22vw, (max-width: 1024px) 18vw, 14vw"
        priority={index < 8}
      />
    </motion.div>
  )
}

export default function HeroLoadAnimation() {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<AnimationPhase>(
    prefersReducedMotion ? 'reveal' : 'initial',
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    const imagesTimer = window.setTimeout(() => setPhase('images'), 1200)
    const revealTimer = window.setTimeout(() => setPhase('reveal'), 1900)

    return () => {
      window.clearTimeout(imagesTimer)
      window.clearTimeout(revealTimer)
    }
  }, [prefersReducedMotion])

  const revealGrid = phase === 'reveal'

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[min(90vh,820px)] w-full items-center justify-center overflow-hidden bg-brand-void"
      aria-labelledby="hero-heading"
    >
      {/* Book cover grid — size and spacing stay fixed; only a mask clears the center for text */}
      <div
        className={`pointer-events-none absolute -inset-12 flex items-center justify-center transition-[mask-image,-webkit-mask-image] duration-[1.5s] ease-[cubic-bezier(0.42,-0.01,0.06,0.98)] sm:-inset-16 md:-inset-24 ${
          revealGrid
            ? '[mask-image:linear-gradient(0deg,transparent_0%,black_22%,black_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(0deg,transparent_0%,black_22%,black_78%,transparent_100%)]'
            : '[mask-image:linear-gradient(0deg,black_0%,black_100%)] [-webkit-mask-image:linear-gradient(0deg,black_0%,black_100%)]'
        }`}
        aria-hidden
      >
        <div className="grid w-full grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4 md:gap-8">
          {BOOK_COVERS.map((src, coverIndex) => (
            <div
              key={coverIndex}
              className={
                coverIndex % 4 === 1 || coverIndex % 4 === 2
                  ? 'translate-y-6 md:translate-y-10'
                  : coverIndex % 4 === 0
                    ? '-translate-y-4 md:-translate-y-6'
                    : ''
              }
            >
              <BookCover
                src={src}
                alt=""
                index={coverIndex}
                phase={phase}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Center vignette — deepens on reveal so text sits over a clear band, not shrunken covers */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        initial={false}
        animate={{
          background: revealGrid
            ? 'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.55) 45%, rgba(13,13,13,0.2) 70%, transparent 100%)'
            : 'radial-gradient(ellipse at center, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.85) 55%, rgba(13,13,13,1) 100%)',
        }}
        transition={{ duration: 1.5, ease: [0.42, -0.01, 0.06, 0.98] }}
      />

      {/* Headline + copy */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <h1
          id="hero-heading"
          className="font-display text-3xl leading-tight font-normal tracking-normal text-brand-mist sm:text-5xl lg:text-6xl"
        >
          <AnimatedWords
            text="A BOOK CHOSEN FOR YOU"
            phase={phase}
            startDelay={0.15}
          />
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-dust sm:mt-5 sm:text-lg lg:text-xl">
          <AnimatedWords
            text="Mutavaatir is a monthly book subscription box that brings you handpicked books based on meaning, value and timeless reading."
            phase={phase}
            startDelay={0.35}
          />
        </p>

        <motion.div
          id="pricing"
          className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={
            phase === 'reveal'
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 12 }
          }
          transition={{ ...textSpring, delay: phase === 'reveal' ? 0.9 : 0 }}
        >
          <button
            type="button"
            className="font-display bg-brand-clay px-7 py-3.5 text-sm font-medium tracking-wide text-brand-void shadow-md transition-all duration-300 hover:bg-brand-mist hover:shadow-lg lg:text-[0.95rem]"
          >
            SUBSCRIBE NOW
          </button>
          <button
            type="button"
            className="font-display border-2 border-brand-clay px-8 py-4 text-xs font-medium tracking-normal text-brand-dust transition-all duration-300 hover:border-brand-mist hover:text-brand-mist"
          >
            LEARN MORE
          </button>
        </motion.div>
      </div>
    </section>
  )
}
