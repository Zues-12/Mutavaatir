'use client'

import type { LucideIcon } from 'lucide-react'
import {
  ArrowDown,
  BookOpenText,
  ClipboardList,
  PackageOpen,
  Wand2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

type HowItWorksStep = {
  readonly number: string
  readonly icon: LucideIcon
  readonly tag: string
  readonly title: string
  readonly description: string
  readonly image: string
}

const steps: HowItWorksStep[] = [
  {
    number: '01',
    icon: ClipboardList,
    tag: 'Your preferences',
    title: 'Submit your form',
    description:
      'Fill out our short form to help us know your reading preferences.',
    image: '/home-img1.png',
  },
  {
    number: '02',
    icon: Wand2,
    tag: 'Curated for you',
    title: 'We pick your book',
    description:
      'We handpick a book just for you based on your set preferences.',
    image: '/mutavaatir-product.jpg',
  },
  {
    number: '03',
    icon: PackageOpen,
    tag: 'Delivered with care',
    title: 'We pack & ship',
    description:
      'Your book is packed with care and shipped right to your doorstep.',
    image: '/month-experience.png',
  },
  {
    number: '04',
    icon: BookOpenText,
    tag: 'Yours to keep',
    title: 'You read & enjoy',
    description:
      'Unbox, read, and enjoy a story picked just for you — yours to keep forever.',
    image: '/how-side.png',
  },
]

const CARD_TRANSITION = {
  duration: 0.8,
  ease: [0.44, 0, 0.56, 1] as const,
}

/** Expanded card height when one step is open (rest split equally). */
const ACTIVE_HEIGHT_PERCENT = 72
const COLLAPSED_HEIGHT_PERCENT = (100 - ACTIVE_HEIGHT_PERCENT) / (steps.length - 1)

function getCardHeightPercent(
  activeIndex: number | null,
  index: number,
  total: number,
): string {
  if (activeIndex === null) {
    return `${100 / total}%`
  }
  if (activeIndex === index) {
    return `${ACTIVE_HEIGHT_PERCENT}%`
  }
  return `${COLLAPSED_HEIGHT_PERCENT}%`
}

function getImageScale(
  isExpanded: boolean,
  isCollapsed: boolean,
  isHovered: boolean,
): number {
  if (isExpanded) return 1.08
  if (isCollapsed) return 1.12
  if (isHovered) return 1.06
  return 1
}

type ExpandableStepCardProps = {
  step: HowItWorksStep
  index: number
  activeIndex: number | null
  total: number
  onSelect: (index: number) => void
}

function ExpandableStepCard({
  step,
  index,
  activeIndex,
  total,
  onSelect,
}: ExpandableStepCardProps) {
  const Icon = step.icon
  const [isHovered, setIsHovered] = useState(false)
  const isExpanded = activeIndex === index
  const isCollapsed = activeIndex !== null && !isExpanded
  const showCollapsedTitle = !isExpanded

  return (
    <motion.li
      layout
      className={`relative list-none ${
        isExpanded
          ? 'min-h-[22rem] sm:min-h-[26rem]'
          : isCollapsed
            ? 'min-h-[8.5rem] sm:min-h-[10rem]'
            : 'min-h-[10rem] sm:min-h-[12rem]'
      }`}
      animate={{ height: getCardHeightPercent(activeIndex, index, total) }}
      transition={CARD_TRANSITION}
    >
      <motion.button
        type="button"
        layout
        onClick={() => onSelect(index)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-expanded={isExpanded}
        className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[2rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-clay/60 md:rounded-[2.25rem]"
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: getImageScale(isExpanded, isCollapsed, isHovered),
          }}
          transition={CARD_TRANSITION}
        >
          <Image
            src={step.image}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
            priority={index === 0}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-linear-to-b from-black/15 via-black/10 to-black/65"
          animate={{
            opacity: isCollapsed ? 0.82 : isExpanded ? 0.72 : 0.68,
          }}
          transition={CARD_TRANSITION}
          aria-hidden
        />

        <div
          className={`relative z-10 flex h-full flex-col justify-between transition-all duration-500 ${
            isCollapsed ? 'p-5 md:p-6' : 'p-6 md:p-8'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 backdrop-blur-md ${
                isCollapsed ? 'px-3.5 py-2.5 md:px-4' : 'px-4 py-2.5 md:px-5 md:py-3'
              }`}
            >
              <Icon
                className={`text-white ${isCollapsed ? 'size-4 md:size-5' : 'size-5 md:size-6'}`}
                strokeWidth={1.5}
                aria-hidden
              />
              <span
                className={`font-display font-semibold tracking-wide text-white uppercase ${
                  isCollapsed ? 'text-[11px] md:text-xs' : 'text-xs md:text-sm'
                }`}
              >
                {step.tag}
              </span>
            </div>

            <span
              className={`flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/20 backdrop-blur-md ${
                isCollapsed ? 'size-11' : 'size-12'
              }`}
            >
              <ArrowDown
                className={`size-4 text-white transition-transform duration-500 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
                aria-hidden
              />
            </span>
          </div>

          <div className="mt-auto">
            {showCollapsedTitle && (
              <motion.h3
                layout
                className={`font-display leading-tight font-medium tracking-wide text-white capitalize ${
                  isCollapsed
                    ? 'text-xl md:text-2xl'
                    : 'text-2xl md:text-3xl lg:text-[2.75rem]'
                }`}
              >
                <span className="mr-2 text-brand-dust/90">{step.number}</span>
                {step.title}
              </motion.h3>
            )}

            <motion.div
              initial={false}
              animate={{
                opacity: isExpanded ? 1 : 0,
                maxHeight: isExpanded ? 320 : 0,
                marginTop: isExpanded ? 12 : 0,
              }}
              transition={CARD_TRANSITION}
              className="overflow-hidden"
            >
              <h3 className="font-display text-2xl leading-tight font-medium tracking-wide text-white capitalize md:text-3xl lg:text-4xl">
                <span className="mr-2 text-brand-dust/90">{step.number}</span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base lg:text-lg">
                {step.description}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.button>
    </motion.li>
  )
}

export default function HowItWorksExpandableSteps() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="w-full">
      <motion.ol
        layout
        className="m-0 flex h-[min(112rem,98vh)] min-h-[58rem] list-none flex-col gap-3 p-0 sm:min-h-[62rem] sm:gap-3.5"
        role="list"
      >
        {steps.map((step, index) => (
          <ExpandableStepCard
            key={step.number}
            step={step}
            index={index}
            activeIndex={activeIndex}
            total={steps.length}
            onSelect={handleSelect}
          />
        ))}
      </motion.ol>

      <p className="mt-8 text-center font-display text-sm italic text-brand-earth md:mt-10 md:text-base">
        &ldquo;Every book is chosen with intention.&rdquo;
      </p>
    </div>
  )
}
