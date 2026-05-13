import { BookMarked, Boxes, Sparkles, Library, HeartHandshake } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ComparisonItem = {
  readonly icon: LucideIcon
  readonly mutavaatir: string
  readonly generic: string
}

const comparisonItems: ComparisonItem[] = [
  {
    icon: BookMarked,
    mutavaatir: 'Curated personally for you',
    generic: 'Endless searching',
  },
  {
    icon: Boxes,
    mutavaatir: 'Surprise experience every month',
    generic: 'Predictable and routine',
  },
  {
    icon: Sparkles,
    mutavaatir: 'Personalized to your taste',
    generic: 'Generic recommendations',
  },
  {
    icon: Library,
    mutavaatir: 'Books are yours forever',
    generic: 'Temporary or rented',
  },
  {
    icon: HeartHandshake,
    mutavaatir: 'Meaningful connection with books',
    generic: 'Transactional experience',
  },
]

export default function WhatMakesDifferent() {
  return (
    <section aria-labelledby="difference-heading" className="bg-brand-void py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-8">
          <div className="max-w-[16rem]">
            <h2
              id="difference-heading"
              className="font-display text-4xl leading-tight font-medium tracking-tight text-brand-mist sm:text-5xl"
            >
              WHAT MAKES
              <br />
              MUTAVAATIR
              <br />
              DIFFERENT?
            </h2>
            <div className="mt-4 h-px w-12 bg-brand-clay/80" aria-hidden />
          </div>

          <div className="scrollbar-brand overflow-x-auto">
            <div className="min-w-[680px] border border-brand-earth/35 bg-brand-void/40">
              <div className="grid grid-cols-[56px_1fr_1fr] border-b border-brand-earth/35">
                <div className="border-r border-brand-earth/35" aria-hidden />
                <div className="border-r border-brand-earth/35 bg-brand-earth/85 px-4 py-2 text-center">
                  <p className="font-display text-lg tracking-wide text-brand-mist">MUTAVAATIR</p>
                </div>
                <div className="px-4 py-2 text-center">
                  <p className="font-display text-lg tracking-wide text-brand-dust/90">
                    GENERIC BOOK BUYING
                  </p>
                </div>
              </div>

              <ul>
                {comparisonItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.mutavaatir}
                      className="grid grid-cols-[56px_1fr_1fr] border-b border-brand-earth/25 last:border-b-0"
                    >
                      <div className="flex items-center justify-center border-r border-brand-earth/30">
                        <Icon className="h-5 w-5 text-brand-clay" strokeWidth={1.6} aria-hidden />
                      </div>
                      <p className="border-r border-brand-earth/30 px-4 py-3 text-xl leading-tight text-brand-mist">
                        {item.mutavaatir}
                      </p>
                      <p className="px-4 py-3 text-xl leading-tight text-brand-dust/85">
                        {item.generic}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
