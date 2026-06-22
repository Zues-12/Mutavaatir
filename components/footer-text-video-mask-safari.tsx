'use client'

const MASK_FONT_SIZE = 'max(5.5rem, calc(100vw / 4.75))'
const VIDEO_OBJECT_POSITION = '50% 60%'
const VIDEO_SCALE = 1

const WRAPPER_CLASS =
  'pointer-events-none absolute bottom-0 left-0 right-0 z-0 w-full translate-y-1/3 select-none overflow-hidden opacity-22'

/** Inline SVG mask — Safari often fails on fragment refs + webm for masked video. */
const MASK_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid meet"><rect width="100%" height="100%" fill="black"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Oswald, ui-sans-serif, sans-serif" font-size="200" font-weight="500" letter-spacing="-0.025em">MUTAVAATIR</text></svg>`,
)}")`

const VIDEO_MASK_STYLE = {
  objectPosition: VIDEO_OBJECT_POSITION,
  transform: VIDEO_SCALE === 1 ? undefined : `scale(${VIDEO_SCALE})`,
  maskImage: MASK_DATA_URI,
  WebkitMaskImage: MASK_DATA_URI,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
} as const

export default function FooterTextVideoMaskSafari() {
  return (
    <div
      className={WRAPPER_CLASS}
      style={{ fontSize: MASK_FONT_SIZE, height: '1.1em' }}
      aria-hidden
    >
      <video
        src="/footer-vid2.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={VIDEO_MASK_STYLE}
      />
    </div>
  )
}
