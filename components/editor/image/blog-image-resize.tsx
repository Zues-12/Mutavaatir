'use client'

import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type BlogImageResizeProps = {
  isSelected: boolean
  containerRef: React.RefObject<HTMLElement | null>
  figureRef: React.RefObject<HTMLElement | null>
  onResize: (width: string) => void
  onResizeEnd: (width: string) => void
}

const MIN_WIDTH_PERCENT = 10

export function BlogImageResize({
  isSelected,
  containerRef,
  figureRef,
  onResize,
  onResizeEnd,
}: BlogImageResizeProps) {
  const resizingRef = useRef<{
    side: 'left' | 'right'
    startX: number
    startWidth: number
    containerWidth: number
  } | null>(null)

  const getWidthPercent = useCallback(
    (pixelWidth: number) => {
      const containerWidth = containerRef.current?.offsetWidth ?? pixelWidth
      const percent = Math.round((pixelWidth / containerWidth) * 100)
      return `${Math.min(100, Math.max(MIN_WIDTH_PERCENT, percent))}%`
    },
    [containerRef],
  )

  const handleMouseDown = useCallback(
    (side: 'left' | 'right') => (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const figure = figureRef.current
      const container = containerRef.current
      if (!figure || !container) return

      resizingRef.current = {
        side,
        startX: event.clientX,
        startWidth: figure.offsetWidth,
        containerWidth: container.offsetWidth,
      }
    },
    [containerRef, figureRef],
  )

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const state = resizingRef.current
      const figure = figureRef.current
      if (!state || !figure) return

      const delta =
        state.side === 'right' ? event.clientX - state.startX : state.startX - event.clientX

      const minWidth = state.containerWidth * (MIN_WIDTH_PERCENT / 100)
      const nextWidth = Math.min(state.containerWidth, Math.max(minWidth, state.startWidth + delta))
      const width = getWidthPercent(nextWidth)

      figure.style.width = width
      onResize(width)
    }

    const handleMouseUp = () => {
      const figure = figureRef.current
      if (!resizingRef.current || !figure) return

      const width = figure.style.width || '100%'
      onResizeEnd(width)
      resizingRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [figureRef, getWidthPercent, onResize, onResizeEnd])

  if (!isSelected) return null

  return (
    <>
      <button
        type="button"
        aria-label="Resize image from left"
        className={cn('blog-image-resize-handle blog-image-resize-handle--left')}
        onMouseDown={handleMouseDown('left')}
      />
      <button
        type="button"
        aria-label="Resize image from right"
        className={cn('blog-image-resize-handle blog-image-resize-handle--right')}
        onMouseDown={handleMouseDown('right')}
      />
    </>
  )
}
