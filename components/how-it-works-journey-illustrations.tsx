import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  journeyIllustrationSources,
  type JourneyIllustrationId,
} from '@/lib/how-it-works-journey-data'

type IllustrationProps = {
  className?: string
}

const stroke = '#7b6244'
const fillAccent = '#9f8666'

/** Tint black SVG Repo assets to brand-earth (#7b6244). */
const brandEarthSvgFilter =
  'brightness(0) saturate(100%) invert(48%) sepia(15%) saturate(750%) hue-rotate(349deg) brightness(95%) contrast(90%)'

const softSvgShadow = 'drop-shadow(0 18px 36px rgba(123, 98, 68, 0.1))'

const readingIllustrationPlacements = [
  {
    className:
      'absolute left-0 top-[6%] h-[40%] w-[38%] -rotate-6 sm:top-[4%] sm:h-[42%] sm:w-[36%]',
  },
  {
    className:
      'absolute right-0 top-0 h-[46%] w-[40%] rotate-[4deg] sm:h-[48%] sm:w-[38%]',
  },
  {
    className:
      'absolute bottom-0 left-[18%] h-[44%] w-[42%] rotate-[-3deg] sm:left-[20%] sm:h-[46%] sm:w-[40%]',
  },
] as const

function BrandSvgImage({ src, className }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      className={cn('object-contain object-center', className)}
      style={{ filter: `${brandEarthSvgFilter} ${softSvgShadow}` }}
      sizes="(max-width: 768px) 120px, 160px"
      aria-hidden
    />
  )
}

export function JourneyCheckpointIllustration({
  id,
  className,
}: {
  id: JourneyIllustrationId
  className?: string
}) {
  const sources = journeyIllustrationSources[id]
  const srcList = Array.isArray(sources) ? sources : [sources]

  if (srcList.length === 1) {
    return (
      <div
        className={cn(
          'pointer-events-none relative h-full w-full select-none opacity-95',
          className,
        )}
      >
        <BrandSvgImage src={srcList[0]} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'pointer-events-none relative h-full w-full select-none opacity-95',
        className,
      )}
    >
      {srcList.map((src, index) => (
        <div
          key={src}
          className={cn(
            'relative',
            readingIllustrationPlacements[index]?.className,
          )}
        >
          <BrandSvgImage src={src} />
        </div>
      ))}
    </div>
  )
}

export function JourneyDecorDots({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {[
        [12, 12],
        [36, 12],
        [60, 12],
        [84, 12],
        [108, 12],
        [12, 36],
        [60, 36],
        [108, 36],
        [12, 60],
        [36, 60],
        [84, 60],
        [108, 60],
        [12, 84],
        [60, 84],
        [108, 84],
        [12, 108],
        [36, 108],
        [60, 108],
        [84, 108],
        [108, 108],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i % 3 === 0 ? 2.5 : 1.5}
          fill={stroke}
          opacity={i % 4 === 0 ? 0.2 : 0.1}
        />
      ))}
    </svg>
  )
}

export function JourneyDecorSwirl({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M8 40c0-12 8-20 20-20 10 0 16 6 16 14 0 8-6 12-14 12-6 0-10-4-10-8"
        stroke={fillAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M40 8c12 0 20 8 20 20 0 10-6 16-14 16-8 0-12-6-12-14"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  )
}
