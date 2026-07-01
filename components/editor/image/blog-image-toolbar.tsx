'use client'

import { useCallback, useRef } from 'react'
import type { Editor } from '@tiptap/core'
import { ImageIcon } from 'lucide-react'
import { uploadBlogImageAction } from '@/app/admin/blog/actions'

type BlogImageToolbarButtonProps = {
  editor: Editor
  disabled?: boolean
  uploading?: boolean
  onUploadingChange?: (uploading: boolean) => void
  onError?: (error: string | null) => void
  renderButton: (props: {
    onClick: () => void
    disabled: boolean
    title: string
    children: React.ReactNode
  }) => React.ReactNode
}

export function BlogImageToolbarButton({
  editor,
  disabled = false,
  uploading = false,
  onUploadingChange,
  onError,
  renderButton,
}: BlogImageToolbarButtonProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback(
    async (file: File) => {
      onUploadingChange?.(true)
      onError?.(null)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadBlogImageAction(formData)
        if (result.ok) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'image',
              attrs: {
                src: result.url,
                alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
                width: '100%',
                align: 'center',
              },
            })
            .run()
        } else {
          onError?.(result.error)
        }
      } finally {
        onUploadingChange?.(false)
      }
    },
    [editor, onError, onUploadingChange],
  )

  return (
    <>
      {renderButton({
        onClick: () => imageInputRef.current?.click(),
        disabled: disabled || uploading,
        title: uploading ? 'Uploading…' : 'Insert image',
        children: <ImageIcon className="h-3.5 w-3.5" />,
      })}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            void handleImageUpload(file)
            event.target.value = ''
          }
        }}
      />
    </>
  )
}
