import { Node, type CommandProps, type RawCommands } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'
import type { ImageAlign, SetBlogImageOptions } from './types'

function parseWidthFromElement(element: Element): string | null {
  const img = (element.tagName === 'IMG' ? element : element.querySelector('img')) as HTMLElement | null
  if (!img) return null

  const dataWidth = img.getAttribute('data-width')
  if (dataWidth?.endsWith('%')) return dataWidth

  const styleWidth = img.style.width
  if (styleWidth?.endsWith('%')) return styleWidth

  return null
}

function parseImageAttrs(element: Element) {
  const img = element.tagName === 'IMG' ? element : element.querySelector('img')
  if (!img) return false

  const figure = element.tagName === 'FIGURE' ? element : img.closest('figure')
  const captionEl = figure?.querySelector('figcaption')
  const align =
    (figure?.getAttribute('data-align') as ImageAlign | null) ??
    (figure?.className.match(/blog-image-figure--align-(left|center|right)/)?.[1] as ImageAlign | undefined) ??
    'center'

  return {
    src: img.getAttribute('src'),
    alt: img.getAttribute('alt'),
    title: img.getAttribute('title'),
    width: parseWidthFromElement(element) ?? '100%',
    align,
    caption: captionEl?.textContent?.trim() || null,
  }
}

function buildImageDomSpec(node: {
  attrs: Record<string, unknown>
}): [string, Record<string, string>, ...Array<string | [string, Record<string, string>, string?]>] {
  const width = typeof node.attrs.width === 'string' ? node.attrs.width : '100%'
  const align: ImageAlign =
    node.attrs.align === 'left' || node.attrs.align === 'right' ? node.attrs.align : 'center'
  const caption =
    typeof node.attrs.caption === 'string' && node.attrs.caption.trim().length > 0
      ? node.attrs.caption.trim()
      : null

  const figureAttrs: Record<string, string> = {
    class: `blog-image-figure blog-image-figure--align-${align}`,
    'data-align': align,
    style: `width: ${width}`,
  }

  const imgAttrs: Record<string, string> = {
    class: 'blog-image-figure__img',
    src: typeof node.attrs.src === 'string' ? node.attrs.src : '',
    alt: typeof node.attrs.alt === 'string' ? node.attrs.alt : '',
    'data-width': width,
    style: 'width: 100%',
  }

  if (typeof node.attrs.title === 'string' && node.attrs.title.length > 0) {
    imgAttrs.title = node.attrs.title
  }

  const imgNode: [string, Record<string, string>] = ['img', imgAttrs]

  if (!caption) {
    return ['figure', figureAttrs, imgNode]
  }

  const captionNode: [string, Record<string, string>, string] = [
    'figcaption',
    { class: 'blog-image-figure__caption' },
    caption,
  ]

  return ['figure', figureAttrs, imgNode, captionNode]
}

export const BlogImageExtension = Node.create({
  name: 'image',
  group: 'block',
  draggable: true,
  atom: true,
  selectable: true,

  addOptions() {
    return {
      allowBase64: false,
    }
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: '100%',
        rendered: false,
        parseHTML: (element) => parseWidthFromElement(element) ?? '100%',
      },
      align: {
        default: 'center' as ImageAlign,
        rendered: false,
        parseHTML: (element) => {
          const figure = element.tagName === 'FIGURE' ? element : element.closest('figure')
          const align = figure?.getAttribute('data-align')
          if (align === 'left' || align === 'center' || align === 'right') return align
          return 'center'
        },
      },
      caption: {
        default: null,
        rendered: false,
        parseHTML: (element) => {
          const figure = element.tagName === 'FIGURE' ? element : element.closest('figure')
          const caption = figure?.querySelector('figcaption')?.textContent?.trim()
          return caption || null
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (node) => parseImageAttrs(node as Element),
      },
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (node) => parseImageAttrs(node as Element),
      },
    ]
  },

  renderHTML({ node }) {
    return buildImageDomSpec(node)
  },

  addCommands() {
    return {
      setImage:
        (options: SetBlogImageOptions) =>
        ({ commands }: CommandProps) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              width: '100%',
              align: 'center',
              caption: null,
              ...options,
            },
          }),
    } as Partial<RawCommands>
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { selection } = this.editor.state
        if (selection instanceof NodeSelection && selection.node.type.name === this.name) {
          const pos = selection.from + selection.node.nodeSize
          return this.editor.chain().focus().insertContentAt(pos, { type: 'paragraph' }).run()
        }
        return false
      },
      Backspace: () => {
        const { selection } = this.editor.state
        if (selection instanceof NodeSelection && selection.node.type.name === this.name) {
          return this.editor.chain().focus().deleteSelection().run()
        }
        return false
      },
      Delete: () => {
        const { selection } = this.editor.state
        if (selection instanceof NodeSelection && selection.node.type.name === this.name) {
          return this.editor.chain().focus().deleteSelection().run()
        }
        return false
      },
    }
  },
})
