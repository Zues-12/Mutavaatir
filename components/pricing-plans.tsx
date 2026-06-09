'use client'

import { BookMarked, Check, Package, Truck } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useRef, useState, type MouseEvent } from 'react'
import {
  formatRupee,
  subscriptionIncludes,
  subscriptionPlans,
  type PricingPlan,
} from '@/lib/pricing-data'
import { cn } from '@/lib/utils'

const featureIcons = [BookMarked, Package, Truck] as const

const TILT_MAX = 10
const HOVER_SCALE = 1.035

function PricingCard({ plan }: { plan: PricingPlan }) {
  const reduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const isBestValue = plan.id === 'yearly'

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale = useMotionValue(1)

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 22 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 22 })
  const springScale = useSpring(scale, { stiffness: 400, damping: 28 })

  const resetTilt = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
    setIsHovered(false)
  }, [rotateX, rotateY, scale])

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (reduceMotion || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5

      rotateY.set(x * TILT_MAX * 2)
      rotateX.set(-y * TILT_MAX * 2)
    },
    [reduceMotion, rotateX, rotateY],
  )

  const handleMouseEnter = useCallback(() => {
    if (reduceMotion) return
    setIsHovered(true)
    scale.set(HOVER_SCALE)
  }, [reduceMotion, scale])

  const handleMouseLeave = useCallback(() => {
    if (reduceMotion) return
    resetTilt()
  }, [reduceMotion, resetTilt])

  const tiltStyle = reduceMotion
    ? undefined
    : {
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
        transformStyle: 'preserve-3d' as const,
      }

  return (
    <div className={cn('h-full', !reduceMotion && '[perspective:1200px]')}>
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className={cn(
          'flex h-full cursor-default flex-col overflow-hidden rounded-lg border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] select-none sm:flex-row',
          isBestValue
            ? 'border-brand-clay/40 ring-1 ring-brand-clay/20'
            : 'border-brand-earth/10',
          isHovered && 'z-10 shadow-[0_16px_40px_rgba(0,0,0,0.1)]',
        )}
      >
        <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-7 lg:p-8">
          <div>
            <span className="inline-block rounded-sm bg-brand-mist/80 px-2.5 py-1 font-display text-[0.65rem] font-semibold tracking-widest text-brand-earth uppercase">
              {plan.badge}
            </span>
            <h3 className="mt-4 font-display text-2xl font-medium tracking-wide text-brand-void sm:text-[1.65rem]">
              {plan.name}
            </h3>
            {plan.total ? (
              <p className="mt-2 text-sm leading-relaxed text-brand-earth">
                {formatRupee(plan.total)} total
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-brand-earth">
                Pay as you go — cancel anytime.
              </p>
            )}
            {plan.savings ? (
              <p className="mt-1 text-sm font-medium text-brand-clay">
                You save {formatRupee(plan.savings)}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            className="font-display w-fit cursor-pointer bg-brand-void px-6 py-3 text-xs font-semibold tracking-widest text-brand-mist transition-colors duration-300 hover:bg-brand-earth sm:text-sm"
          >
            SUBSCRIBE NOW
          </button>
        </div>

        <div
          className="hidden w-px shrink-0 bg-brand-earth/15 sm:block"
          aria-hidden
        />

        <div className="border-t border-brand-earth/10 p-6 sm:w-[42%] sm:border-t-0 sm:p-7 lg:p-8">
          <p className="font-display text-[0.65rem] font-semibold tracking-widest text-brand-earth/80 uppercase">
            Includes:
          </p>
          <ul className="mt-4 space-y-3">
            {subscriptionIncludes.map((feature, index) => {
              const Icon = featureIcons[index] ?? Check
              return (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mist/70 text-brand-earth">
                    <Icon className="h-3 w-3" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed text-brand-void/90">
                    {feature}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.article>
    </div>
  )
}

export default function PricingPlans() {
  return (
    <section
      aria-labelledby="pricing-plans-heading"
      className="bg-brand-mist py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-plans-heading"
            className="font-display text-2xl font-medium tracking-wide text-brand-void sm:text-3xl"
          >
            Mutavaatir Subscriptions
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-earth">
            All plans include one curated book per month, bookmarks, and doorstep
            delivery — packaged with care.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-7">
          {subscriptionPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
