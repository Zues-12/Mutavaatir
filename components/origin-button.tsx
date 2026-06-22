'use client'

import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import {
  useCallback,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { cn } from '@/lib/utils'

export const originCircleColors = {
  mist: '#e3d4c5',
  earth: '#7b6244',
  clay: '#9f8666',
  dust: '#bfab92',
  void: '#0d0d0d',
} as const

type OriginHoverOptions = {
  circleColor: string
  disabled?: boolean
}

function useOriginHover({ circleColor, disabled = false }: OriginHoverOptions) {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [maxDimension, setMaxDimension] = useState(800)

  const scale = useMotionValue(0)
  const smoothScale = useSpring(scale, { stiffness: 85, damping: 18, restDelta: 0.001 })
  const easedScale = useTransform(smoothScale, [0, 1], [0, 1], {
    ease: (t) => t * t,
  })

  const updateCursorPos = useCallback((event: MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setCursorPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }, [])

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled || reduceMotion) return
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      setMaxDimension(Math.max(rect.width, rect.height) * 2)
      updateCursorPos(event)
      scale.set(1)
    },
    [disabled, reduceMotion, scale, updateCursorPos],
  )

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      updateCursorPos(event)
      scale.set(0)
    },
    [scale, updateCursorPos],
  )

  const showCircle = !disabled && !reduceMotion

  return {
    containerRef,
    cursorPos,
    maxDimension,
    easedScale,
    circleColor,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove: updateCursorPos,
    showCircle,
  }
}

export function OriginCircle({
  cursorPos,
  maxDimension,
  easedScale,
  circleColor,
}: {
  cursorPos: { x: number; y: number }
  maxDimension: number
  easedScale: MotionValue<number>
  circleColor: string
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute z-0 rounded-full"
      style={{
        left: cursorPos.x,
        top: cursorPos.y,
        width: maxDimension,
        height: maxDimension,
        backgroundColor: circleColor,
        scale: easedScale,
        x: '-50%',
        y: '-50%',
      }}
    />
  )
}

function OriginContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'relative z-10 inline-flex w-full items-center justify-center gap-[inherit]',
        className,
      )}
    >
      {children}
    </span>
  )
}

export type OriginHoverShellProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
  circleColor?: string
}

export function OriginHoverShell({
  children,
  className,
  contentClassName,
  circleColor = originCircleColors.clay,
}: OriginHoverShellProps) {
  const hover = useOriginHover({ circleColor })

  return (
    <div
      ref={hover.containerRef as RefObject<HTMLDivElement>}
      onMouseEnter={hover.handleMouseEnter}
      onMouseLeave={hover.handleMouseLeave}
      onMouseMove={hover.handleMouseMove}
      className={cn('group relative overflow-hidden', className)}
    >
      {hover.showCircle ? (
        <OriginCircle
          cursorPos={hover.cursorPos}
          maxDimension={hover.maxDimension}
          easedScale={hover.easedScale}
          circleColor={hover.circleColor}
        />
      ) : null}
      <div className={cn('relative z-10', contentClassName)}>{children}</div>
    </div>
  )
}

export type OriginButtonProps = ComponentProps<'button'> & {
  circleColor?: string
  labelClassName?: string
}

export function OriginButton({
  circleColor = originCircleColors.mist,
  className,
  labelClassName,
  children,
  disabled,
  onMouseEnter,
  onMouseLeave,
  type,
  ...props
}: OriginButtonProps) {
  const hover = useOriginHover({
    circleColor,
    disabled: Boolean(disabled),
  })

  return (
    <button
      ref={hover.containerRef as RefObject<HTMLButtonElement>}
      type={type ?? 'button'}
      disabled={disabled}
      onMouseEnter={(event) => {
        hover.handleMouseEnter(event)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        hover.handleMouseLeave(event)
        onMouseLeave?.(event)
      }}
      className={cn('group relative overflow-hidden', className)}
      {...props}
    >
      {hover.showCircle ? (
        <OriginCircle
          cursorPos={hover.cursorPos}
          maxDimension={hover.maxDimension}
          easedScale={hover.easedScale}
          circleColor={hover.circleColor}
        />
      ) : null}
      <OriginContent className={labelClassName}>{children}</OriginContent>
    </button>
  )
}

export type OriginLinkProps = ComponentProps<typeof Link> & {
  circleColor?: string
  labelClassName?: string
}

export function OriginLink({
  circleColor = originCircleColors.mist,
  className,
  labelClassName,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: OriginLinkProps) {
  const hover = useOriginHover({
    circleColor,
  })

  return (
    <Link
      ref={hover.containerRef as RefObject<HTMLAnchorElement>}
      onMouseEnter={(event) => {
        hover.handleMouseEnter(event)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        hover.handleMouseLeave(event)
        onMouseLeave?.(event)
      }}
      className={cn('group relative inline-flex overflow-hidden', className)}
      {...props}
    >
      {hover.showCircle ? (
        <OriginCircle
          cursorPos={hover.cursorPos}
          maxDimension={hover.maxDimension}
          easedScale={hover.easedScale}
          circleColor={hover.circleColor}
        />
      ) : null}
      <OriginContent className={labelClassName}>{children}</OriginContent>
    </Link>
  )
}
