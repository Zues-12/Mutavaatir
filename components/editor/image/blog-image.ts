'use client'

import { ReactNodeViewRenderer } from '@tiptap/react'
import { BlogImageExtension } from './blog-image-extension'
import { BlogImageNodeView } from './blog-image-node-view'

export const BlogImage = BlogImageExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(BlogImageNodeView, {
      stopEvent: ({ event }) => {
        const target = event.target as HTMLElement | null
        return Boolean(target?.closest('.blog-image-resize-handle'))
      },
    })
  },
})
