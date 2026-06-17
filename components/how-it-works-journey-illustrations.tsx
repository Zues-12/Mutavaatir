import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import type { JourneyIllustrationId } from '@/lib/how-it-works-journey-data'

type IllustrationProps = {
  className?: string
}

const stroke = '#7b6244'
const fillLight = '#e3d4c5'
const fillMid = '#bfab92'
const fillAccent = '#9f8666'

function PreferencesIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="48" y="28" width="104" height="144" rx="10" fill={fillLight} stroke={stroke} strokeWidth="2" />
      <path d="M64 52h72M64 72h52M64 92h60M64 112h44" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="58" cy="52" r="3" fill={fillAccent} />
      <circle cx="58" cy="72" r="3" fill={fillAccent} />
      <circle cx="58" cy="92" r="3" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M132 130l28 28"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M148 114l12 12-8 8-12-12 8-8z"
        fill={fillMid}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M36 156c8-12 20-18 32-18s24 6 32 18"
        stroke={fillAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

function CuratingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M52 148V72c0-6 5-10 11-10h30c6 0 11 4 11 10v76" fill={fillLight} stroke={stroke} strokeWidth="2" />
      <path d="M52 88h52" stroke={stroke} strokeWidth="2" />
      <path d="M78 62v26" stroke={stroke} strokeWidth="2" />
      <path d="M104 148V80c0-6 5-10 11-10h18c6 0 11 4 11 10v68" fill={fillMid} stroke={stroke} strokeWidth="2" />
      <path d="M104 96h40" stroke={stroke} strokeWidth="2" />
      <path
        d="M128 44l4 14 14 4-14 4-4 14-4-14-14-4 14-4 4-14z"
        fill={fillAccent}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M36 56l-10-6 10-6 6-10 6 10 10 6-10 6-6 10-6-10z"
        fill={fillLight}
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M162 68l6-10 6 10 10 6-10 6-6 10-6-10-10-6 10-6z"
        fill={fillLight}
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M118 28c0 0 8 6 8 14s-8 14-8 14"
        stroke={fillAccent}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

function LibraryIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M36 156V64c0-4 3-8 8-8h24v100H36z"
        fill={fillMid}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M68 56h96c4 0 8 4 8 8v92H68V56z"
        fill={fillLight}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M84 72v68M100 72v68M116 72v68M132 72v68M148 72v68" stroke={stroke} strokeWidth="1.5" opacity="0.45" />
      <path d="M44 80h16M44 96h16M44 112h16M44 128h16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M100 36c0 0-16 8-16 20 0 8 6 14 16 14s16-6 16-14c0-12-16-20-16-20z"
        fill={fillAccent}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="156" cy="44" r="14" fill={fillLight} stroke={stroke} strokeWidth="1.5" />
      <path d="M150 44h12M156 38v12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="100" cy="168" rx="56" ry="6" fill={fillAccent} opacity="0.25" />
    </svg>
  )
}

function PackingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M44 88l56-28 56 28v68l-56 28-56-28V88z"
        fill={fillLight}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M100 60v124M44 88l56 28 56-28" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M72 104v40l28 14 28-14v-40"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M88 72c0-8 6-14 12-14s12 6 12 14"
        stroke={fillAccent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="100" cy="58" r="6" fill={fillAccent} stroke={stroke} strokeWidth="1.5" />
      <path
        d="M94 52c4-6 12-6 12 0"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="76" y="108" width="48" height="10" rx="2" fill={fillMid} stroke={stroke} strokeWidth="1.2" />
      <path
        d="M28 148c12-4 24-6 36-6s24 2 36 6"
        stroke={fillAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

function DeliveryIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M20 148h160" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <path d="M32 148v-8M56 148v-12M80 148v-6M120 148v-10M160 148v-8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
      <rect x="28" y="88" width="72" height="44" rx="6" fill={fillLight} stroke={stroke} strokeWidth="2" />
      <path d="M100 100h44l16 20v12H100V100z" fill={fillMid} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <rect x="108" y="108" width="28" height="16" rx="2" fill={fillLight} stroke={stroke} strokeWidth="1.5" />
      <circle cx="52" cy="132" r="10" fill={fillLight} stroke={stroke} strokeWidth="2" />
      <circle cx="52" cy="132" r="4" fill={stroke} opacity="0.3" />
      <circle cx="136" cy="132" r="10" fill={fillLight} stroke={stroke} strokeWidth="2" />
      <circle cx="136" cy="132" r="4" fill={stroke} opacity="0.3" />
      <path
        d="M44 76h20l8-12h28"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M156 72c6 0 10 4 10 10v6"
        stroke={fillAccent}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M164 56l8 8-8 8"
        stroke={fillAccent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  )
}

function ReadingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M48 148c0-28 22-50 52-50s52 22 52 50"
        fill={fillLight}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M72 98c0-16 12-28 28-28s28 12 28 28" fill={fillMid} stroke={stroke} strokeWidth="2" />
      <path
        d="M56 148c16-8 32-12 44-12s28 4 44 12"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M68 120c8-20 24-32 32-32s24 12 32 32"
        fill={fillLight}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M100 88v64" stroke={stroke} strokeWidth="2" />
      <path d="M68 120h64" stroke={stroke} strokeWidth="1.5" opacity="0.35" />
      <path d="M76 132h16M108 132h16M76 144h24" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path
        d="M36 64c6-8 14-12 22-12"
        stroke={fillAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M148 56c8 4 14 12 16 22"
        stroke={fillAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="156" cy="44" r="3" fill={fillAccent} opacity="0.6" />
      <circle cx="40" cy="48" r="2" fill={fillAccent} opacity="0.4" />
    </svg>
  )
}

const illustrationMap: Record<
  JourneyIllustrationId,
  ComponentType<IllustrationProps>
> = {
  preferences: PreferencesIllustration,
  curating: CuratingIllustration,
  searching: LibraryIllustration,
  packing: PackingIllustration,
  delivery: DeliveryIllustration,
  reading: ReadingIllustration,
}

export function JourneyCheckpointIllustration({
  id,
  className,
  variant = 'default',
}: {
  id: JourneyIllustrationId
  className?: string
  variant?: 'default' | 'background'
}) {
  const Illustration = illustrationMap[id]

  return (
    <div
      className={cn(
        'pointer-events-none select-none',
        variant === 'background' && 'opacity-[0.18] blur-[0.3px]',
        variant === 'default' && 'opacity-90',
        className,
      )}
    >
      <Illustration className="h-full w-full" />
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
