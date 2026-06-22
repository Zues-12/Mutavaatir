'use client'

import { useId } from 'react'

const MASK_FONT_SIZE = 'max(5.5rem, calc(100vw / 4.75))'

/** Which part of the video shows through the text (like background-position). */
const VIDEO_OBJECT_POSITION = '50% 60%'

/** Zoom the video; values > 1 crop in tighter on the center (or object-position anchor). */
const VIDEO_SCALE = 1

const WRAPPER_CLASS =
  'pointer-events-none absolute bottom-0 left-0 right-0 z-0 w-full translate-y-1/3 select-none overflow-hidden opacity-22'

export default function FooterTextVideoMaskDefault() {
  const maskId = useId().replace(/:/g, '')

  return (
    <div
      className={WRAPPER_CLASS}
      style={{ fontSize: MASK_FONT_SIZE, height: '1.1em' }}
      aria-hidden
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              style={{
                fontSize: MASK_FONT_SIZE,
                fontFamily: 'var(--font-oswald), Oswald, ui-sans-serif, sans-serif',
                fontWeight: 500,
                letterSpacing: '-0.025em',
              }}
            >
              MUTAVAATIR
            </text>
          </mask>
        </defs>
      </svg>

      <video
        src="/footer-vid2.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: VIDEO_OBJECT_POSITION,
          transform: VIDEO_SCALE === 1 ? undefined : `scale(${VIDEO_SCALE})`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      />
    </div>
  )
}
