'use client'

import { useCallback, useRef } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'
import type { ImageAlign } from './types'
import { BlogImageResize } from './blog-image-resize'

export function BlogImageNodeView({
  node,
  selected,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) {
  const figureRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  const { src, alt, title, width, align, caption } = node.attrs as {
    src: string
    alt: string | null
    title: string | null
    width: string
    align: ImageAlign
    caption: string | null
  }

  const setContainerRef = useCallback((element: HTMLElement | null) => {
    containerRef.current = element?.closest('.tiptap') ?? element
  }, [])

  const handleSelect = useCallback(() => {
    const pos = getPos()
    if (typeof pos === 'number') {
      editor.chain().focus().setNodeSelection(pos).run()
    }
  }, [editor, getPos])

  const commitWidth = useCallback(
    (nextWidth: string) => {
      updateAttributes({ width: nextWidth })
    },
    [updateAttributes],
  )

  if (!src) return null

  return (
    <NodeViewWrapper
      ref={(element: HTMLElement | null) => {
        figureRef.current = element
        setContainerRef(element)
      }}
      as="figure"
      data-drag-handle
      data-align={align}
      className={cn(
        'blog-image-figure',
        `blog-image-figure--align-${align}`,
        selected && 'blog-image-figure--selected',
      )}
      style={{ width: width || '100%' }}
    >
      <div className="blog-image-figure__inner">
        <img
          src={src}
          alt={alt ?? ''}
          title={title ?? undefined}
          className="blog-image-figure__img"
          draggable={false}
          onClick={handleSelect}
        />
        <BlogImageResize
          isSelected={selected}
          containerRef={containerRef}
          figureRef={figureRef}
          onResize={() => undefined}
          onResizeEnd={commitWidth}
        />
      </div>
      {caption ? <figcaption className="blog-image-figure__caption">{caption}</figcaption> : null}
    </NodeViewWrapper>
  )
}
