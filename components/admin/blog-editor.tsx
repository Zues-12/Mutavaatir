'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { useCallback, useState } from 'react'
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Link2,
  Link2Off,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Highlighter,
  Eye,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlogImage, BlogImageBubbleMenu, BlogImageToolbarButton } from '@/components/editor/image'
import '@/components/editor/image/blog-image.css'

type BlogEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
  language?: string
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        'flex h-7 w-7 items-center justify-center transition-colors duration-150',
        active
          ? 'bg-brand-earth/40 text-brand-mist'
          : 'text-brand-dust hover:bg-brand-earth/20 hover:text-brand-mist',
        disabled && 'cursor-not-allowed opacity-30',
      )}
    >
      {children}
    </button>
  )
}

function ToolbarSeparator() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-brand-earth/40" aria-hidden />
}

export default function BlogEditor({
  value,
  onChange,
  placeholder = 'Start writing your post…',
  disabled = false,
  language = 'en',
}: BlogEditorProps) {
  const isRtl = language === 'ur' || language === 'ar' || language === 'fa'
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      BlogImage,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        lang: language,
        ...(isRtl ? { dir: 'rtl' } : {}),
      },
    },
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      try {
        onChange(ed.getHTML())
      } catch (error) {
        console.error('[BlogEditor] Failed to serialize editor HTML:', error)
      }
    },
  })

  const openLinkDialog = useCallback(() => {
    if (!editor) return
    const existing = editor.getAttributes('link').href ?? ''
    setLinkUrl(existing)
    setLinkDialogOpen(true)
  }, [editor])

  const applyLink = useCallback(() => {
    if (!editor) return
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run()
    }
    setLinkDialogOpen(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  if (!editor) {
    return (
      <div className="flex min-h-[420px] items-center justify-center border border-brand-earth/30 bg-brand-void/60 text-xs text-brand-earth">
        Loading editor…
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col border border-brand-earth/40', disabled && 'opacity-60')}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-earth/40 bg-[#141414] px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive('highlight')}
          title="Highlight"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline code"
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton
          onClick={openLinkDialog}
          active={editor.isActive('link')}
          title="Insert link"
        >
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove link"
          >
            <Link2Off className="h-3.5 w-3.5" />
          </ToolbarButton>
        )}

        <BlogImageToolbarButton
          editor={editor}
          disabled={disabled}
          uploading={uploading}
          onUploadingChange={setUploading}
          onError={setUploadError}
          renderButton={({ onClick, disabled: isDisabled, title, children }) => (
            <ToolbarButton onClick={onClick} disabled={isDisabled} title={title}>
              {children}
            </ToolbarButton>
          )}
        />

        <ToolbarSeparator />

        <ToolbarButton onClick={() => setPreviewOpen(true)} title="Preview post">
          <Eye className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Link dialog */}
      {linkDialogOpen && (
        <div className="flex items-center gap-2 border-b border-brand-earth/40 bg-[#141414] px-3 py-2">
          <span className="shrink-0 text-xs text-brand-earth uppercase tracking-wider">URL</span>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') setLinkDialogOpen(false)
            }}
            placeholder="https://…"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-xs text-brand-mist placeholder:text-brand-earth/60 outline-none"
          />
          <button
            type="button"
            onClick={applyLink}
            className="shrink-0 text-xs uppercase tracking-wider text-brand-clay hover:text-brand-mist"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkDialogOpen(false)}
            className="shrink-0 text-brand-earth hover:text-brand-dust"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Upload status */}
      {(uploading || uploadError) && (
        <div className="border-b border-brand-earth/30 px-3 py-1.5 text-xs">
          {uploading && <span className="text-brand-clay">Uploading image…</span>}
          {uploadError && <span className="text-red-400">{uploadError}</span>}
        </div>
      )}

      {/* Editor content — lang/dir on wrapper so CSS cascade applies Nastaliq */}
      <EditorContent
        editor={editor}
        className="blog-editor-content scrollbar-brand min-h-[420px] overflow-y-auto"
        lang={language}
        dir={isRtl ? 'rtl' : undefined}
      />

      <BlogImageBubbleMenu editor={editor} />

      {/* Preview modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false)
          }}
        >
          <div className="relative w-full max-w-3xl bg-brand-void border border-brand-earth/40">
            <div className="flex items-center justify-between border-b border-brand-earth/40 px-6 py-4">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-brand-earth">
                Content Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-brand-dust hover:text-brand-mist"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close preview</span>
              </button>
            </div>
            <div
              className="blog-preview-content p-6 sm:p-10"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
