'use client'

import { useCallback, useState } from 'react'
import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Captions,
  ImageIcon,
  TextCursorInput,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImageAlign } from './types'

type BlogImageBubbleMenuProps = {
  editor: Editor
}

type EditMode = 'caption' | 'alt' | null

function BubbleButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => {
        event.preventDefault()
        onClick()
      }}
      className={cn('blog-image-bubble-menu__button', active && 'is-active')}
    >
      {children}
    </button>
  )
}

export function BlogImageBubbleMenu({ editor }: BlogImageBubbleMenuProps) {
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [editValue, setEditValue] = useState('')

  const imageState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const attrs = currentEditor.getAttributes('image')
      return {
        isActive: currentEditor.isActive('image'),
        align: (attrs.align as ImageAlign | undefined) ?? 'center',
        caption: (attrs.caption as string | null | undefined) ?? '',
        alt: (attrs.alt as string | null | undefined) ?? '',
      }
    },
  })

  const align = imageState?.align ?? 'center'

  const shouldShow = useCallback(
    ({ editor: currentEditor }: { editor: Editor }) => currentEditor.isActive('image'),
    [],
  )

  const startEdit = useCallback(
    (mode: Exclude<EditMode, null>) => {
      setEditMode(mode)
      setEditValue(mode === 'caption' ? imageState?.caption ?? '' : imageState?.alt ?? '')
    },
    [imageState?.alt, imageState?.caption],
  )

  const applyEdit = useCallback(() => {
    if (editMode === 'caption') {
      editor
        .chain()
        .focus()
        .updateAttributes('image', { caption: editValue.trim() || null })
        .run()
    } else if (editMode === 'alt') {
      editor.chain().focus().updateAttributes('image', { alt: editValue.trim() || null }).run()
    }
    setEditMode(null)
    setEditValue('')
  }, [editMode, editValue, editor])

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      className="blog-image-bubble-menu"
    >
      <BubbleButton
        title="Align left"
        active={align === 'left'}
        onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()}
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </BubbleButton>
      <BubbleButton
        title="Align center"
        active={align === 'center'}
        onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()}
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </BubbleButton>
      <BubbleButton
        title="Align right"
        active={align === 'right'}
        onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()}
      >
        <AlignRight className="h-3.5 w-3.5" />
      </BubbleButton>

      <BubbleButton title="Edit caption" onClick={() => startEdit('caption')}>
        <Captions className="h-3.5 w-3.5" />
      </BubbleButton>
      <BubbleButton title="Edit alt text" onClick={() => startEdit('alt')}>
        <TextCursorInput className="h-3.5 w-3.5" />
      </BubbleButton>
      <BubbleButton
        title="Remove image"
        onClick={() => editor.chain().focus().deleteSelection().run()}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </BubbleButton>

      {editMode ? (
        <div className="blog-image-bubble-menu__edit">
          <ImageIcon className="h-3 w-3 shrink-0 text-brand-earth" aria-hidden />
          <input
            type="text"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') applyEdit()
              if (event.key === 'Escape') {
                setEditMode(null)
                setEditValue('')
              }
            }}
            placeholder={editMode === 'caption' ? 'Image caption…' : 'Alt text…'}
            autoFocus
            className="blog-image-bubble-menu__input"
          />
          <button type="button" onClick={applyEdit} className="blog-image-bubble-menu__apply">
            Apply
          </button>
        </div>
      ) : null}
    </BubbleMenu>
  )
}
