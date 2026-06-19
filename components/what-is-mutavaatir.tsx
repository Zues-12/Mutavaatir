'use client'

import Image from 'next/image'
import { BookOpen, Award, Gift, Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const highlights = [
  {
    icon: BookOpen,
    title: 'HANDPICKED',
    subtitle: 'JUST FOR YOU',
  },
  {
    icon: Award,
    title: 'ORIGINAL COPIES',
    subtitle: 'ALWAYS',
  },
  {
    icon: Gift,
    title: 'YOURS TO',
    subtitle: 'KEEP FOREVER',
  },
  {
    icon: Heart,
    title: 'CURATED WITH',
    subtitle: 'INTENTION',
  },
] as const

export default function WhatIsMutavaatir() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="what-is-mutavaatir-heading"
      className="paper-texture bg-brand-mist py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,420px)_1fr] lg:gap-10">
          <div className="relative overflow-hidden bg-brand-void">
            <Image
              src="/home-img1.webp"
              alt="Books and reading decor"
              width={960}
              height={960}
              className="h-full w-full object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h2
                id="what-is-mutavaatir-heading"
                className="font-display text-4xl leading-none font-medium tracking-tight text-brand-void sm:text-5xl"
              >
                WHAT IS MUTAVAATIR?
              </h2>
              <div className="mt-4 h-px w-14 bg-brand-earth/45" aria-hidden />
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-earth sm:text-xl">
                Mutavaatir is a monthly surprise book subscription.<br/> You tell us what you love to
                read, <br/> we handpick a book just for you <br/> and deliver it to your doorstep.
              </p>
            </div>

            <ul className="mt-7 grid grid-cols-2 border-t border-brand-earth/25 sm:mt-8 lg:grid-cols-4">
              {highlights.map((item, index) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className={[
                      'flex min-h-28 flex-col items-center justify-center gap-3 px-3 py-5 text-center',
                      index !== highlights.length - 1 ? 'lg:border-r lg:border-brand-earth/25' : '',
                      index % 2 === 0 ? 'border-r border-brand-earth/25' : '',
                      index < 2 ? 'border-b border-brand-earth/25 lg:border-b-0' : '',
                    ].join(' ')}
                  >
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center"
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.72, y: 10 }}
                      whileInView={
                        prefersReducedMotion
                          ? undefined
                          : { opacity: 1, scale: 1, y: 0 }
                      }
                      viewport={{ once: true, amount: 0.55 }}
                      transition={{
                        duration: 1.15,
                        ease: [0.22, 1, 0.36, 1],
                        delay: index * 0.14,
                      }}
                    >
                      <Icon className="h-8 w-8 text-brand-earth" strokeWidth={1.4} aria-hidden />
                    </motion.div>
                    <p className="font-display text-sm leading-tight tracking-wide text-brand-void sm:text-base">
                      {item.title}
                      <br />
                      <span className="text-brand-earth">{item.subtitle}</span>
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
