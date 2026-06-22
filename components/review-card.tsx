'use client'

import { format } from 'date-fns'
import { Star } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useRef, useState, type MouseEvent } from 'react'
import type { PublicReview } from '@/lib/review-queries'
import { recommendLabels, type RecommendOption } from '@/lib/reviews'
import { cn } from '@/lib/utils'

const TILT_MAX = 10
const HOVER_SCALE = 1.035

const placeholderTones = [
  'from-brand-earth to-brand-earth/85',
  'from-brand-clay to-brand-earth',
  'from-brand-earth/90 to-brand-clay/90',
  'from-brand-clay/95 to-brand-earth/80',
] as const

function reviewerLabel(review: PublicReview): string {
  return review.display_name?.trim() || 'Verified Reader'
}

function reviewerShortName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Reader'
  if (parts.length === 1) return parts[0]
  const lastInitial = parts[parts.length - 1]?.[0]
  return lastInitial ? `${parts[0]} ${lastInitial}.` : parts[0]
}

function reviewerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'VR'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

function placeholderTone(name: string): (typeof placeholderTones)[number] {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % placeholderTones.length
  }
  return placeholderTones[hash]!
}

function recommendHeading(value: RecommendOption): string {
  if (value === 'yes') return 'Recommends'
  return recommendLabels[value]
}

function ReviewerAvatar({ name }: { name: string }) {
  return (
    <div
      className={cn(
        'relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-linear-to-br',
        placeholderTone(name),
      )}
      aria-hidden
    >
      <span className="font-display text-sm font-semibold tracking-wider text-brand-mist">
        {reviewerInitials(name)}
      </span>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-3.5 w-3.5',
            index < rating
              ? 'fill-brand-earth text-brand-earth'
              : 'fill-transparent text-brand-earth/35',
          )}
          strokeWidth={1.6}
          aria-hidden
        />
      ))}
    </div>
  )
}

type ReviewCardProps = {
  review: PublicReview
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const name = reviewerLabel(review)
  const shortName = reviewerShortName(name)

  const reduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLElement>(null)
  const [isHovered, setIsHovered] = useState(false)

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
          'flex h-full cursor-default flex-col overflow-hidden rounded-lg border border-brand-earth/10 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] select-none sm:p-7',
          isHovered && 'z-10 shadow-[0_16px_40px_rgba(0,0,0,0.1)]',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="inline-block rounded-sm bg-brand-mist/80 px-2.5 py-1 font-display text-[0.65rem] font-semibold tracking-widest text-brand-earth uppercase">
            {recommendHeading(review.would_recommend)}
          </span>
          <StarRating rating={review.rating} />
        </div>

        <div className="my-4 h-px bg-brand-earth/15" aria-hidden />

        <div className="flex items-start gap-3.5">
          <ReviewerAvatar name={name} />
          <div className="min-w-0 pt-0.5">
            <p className="font-display text-lg font-medium tracking-wide text-brand-void sm:text-xl">
              {name}
            </p>
            <p className="mt-1 font-display text-[0.65rem] font-semibold tracking-widest text-brand-earth/80 uppercase">
              Verified reader
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-brand-void/90 sm:text-base">
          {review.feedback}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-earth">
          <time dateTime={review.created_at} className="font-medium text-brand-void">
            {format(new Date(review.created_at), 'MMMM d, yyyy')}
          </time>
          <span aria-hidden>·</span>
          <span>{shortName}</span>
        </div>
      </motion.article>
    </div>
  )
}
