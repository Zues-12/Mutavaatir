'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  Save,
  Send,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import {
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  uploadBlogImageAction,
  type BlogPostInput,
} from '@/app/admin/blog/actions'
import type { BlogPost } from '@/lib/admin/blog-queries'

const BlogEditor = dynamic(() => import('./blog-editor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center border border-brand-earth/30 bg-brand-void/60 text-xs text-brand-earth">
      Loading editor…
    </div>
  ),
})

type BlogPostFormProps = {
  post?: BlogPost
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseArray(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor?: string
  children: React.ReactNode
  optional?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brand-earth"
    >
      {children}
      {optional && (
        <span className="text-[0.6rem] normal-case tracking-normal text-brand-earth/60">
          optional
        </span>
      )}
    </label>
  )
}

function FieldInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  type = 'text',
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  type?: string
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'w-full border border-brand-earth/40 bg-brand-void/60 px-3 py-2 text-sm text-brand-mist placeholder:text-brand-earth/50 outline-none transition-colors focus:border-brand-clay disabled:opacity-50',
        className,
      )}
    />
  )
}

function FieldTextarea({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  rows = 3,
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className="w-full resize-y border border-brand-earth/40 bg-brand-void/60 px-3 py-2 text-sm text-brand-mist placeholder:text-brand-earth/50 outline-none transition-colors focus:border-brand-clay disabled:opacity-50"
    />
  )
}

function SidebarSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-brand-earth/30 bg-brand-void">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brand-earth">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3 w-3 text-brand-earth/60" />
        ) : (
          <ChevronDown className="h-3 w-3 text-brand-earth/60" />
        )}
      </button>
      {open && <div className="border-t border-brand-earth/20 px-4 pb-4 pt-3">{children}</div>}
    </div>
  )
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(!!post)

  // Form state
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? '')
  const [coverAlt, setCoverAlt] = useState(post?.cover_image_alt ?? '')
  const [authorName, setAuthorName] = useState(post?.author_name ?? '')
  const [authorBio, setAuthorBio] = useState(post?.author_bio ?? '')
  const [authorAvatar, setAuthorAvatar] = useState(post?.author_avatar_url ?? '')
  const [authorTwitter, setAuthorTwitter] = useState(post?.author_twitter ?? '')
  const [authorInstagram, setAuthorInstagram] = useState(post?.author_instagram ?? '')
  const [authorWebsite, setAuthorWebsite] = useState(post?.author_website ?? '')
  const [categories, setCategories] = useState((post?.categories ?? []).join(', '))
  const [tags, setTags] = useState((post?.tags ?? []).join(', '))
  const [language, setLanguage] = useState(post?.language ?? 'en')
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status ?? 'draft')
  const [featured, setFeatured] = useState(post?.featured ?? false)
  const [publishDate, setPublishDate] = useState(
    post?.publish_date ? post.publish_date.split('T')[0] : '',
  )
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? '')

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value)
      if (!slugTouched) {
        setSlug(generateSlug(value))
      }
    },
    [slugTouched],
  )

  const handleSlugChange = useCallback((value: string) => {
    setSlugTouched(true)
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
  }, [])

  const handleCoverUpload = useCallback(async (file: File) => {
    setCoverUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadBlogImageAction(fd)
      if (result.ok) {
        setCoverUrl(result.url)
      } else {
        setError(result.error)
      }
    } finally {
      setCoverUploading(false)
    }
  }, [])

  const buildInput = (): BlogPostInput => ({
    title,
    slug,
    subtitle,
    excerpt,
    content,
    cover_image_url: coverUrl,
    cover_image_alt: coverAlt,
    author_name: authorName,
    author_bio: authorBio,
    author_avatar_url: authorAvatar,
    author_twitter: authorTwitter,
    author_instagram: authorInstagram,
    author_website: authorWebsite,
    categories: parseArray(categories),
    tags: parseArray(tags),
    language,
    status,
    featured,
    seo_title: seoTitle,
    seo_description: seoDescription,
    publish_date: publishDate,
  })

  const handleSave = (saveStatus: 'draft' | 'published') => {
    setError(null)
    const input = { ...buildInput(), status: saveStatus }
    startTransition(async () => {
      if (post) {
        const result = await updateBlogPostAction(post.id, input)
        if (!result.ok) {
          setError(result.error)
        }
      } else {
        const result = await createBlogPostAction(input)
        if (!result.ok) {
          setError(result.error)
        } else {
          router.push(`/admin/blog/${result.id}/edit`)
        }
      }
    })
  }

  const handleDelete = () => {
    if (!post) return
    startTransition(async () => {
      await deleteBlogPostAction(post.id)
    })
  }

  const isPublished = status === 'published'

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="inline-flex items-center gap-1.5 text-xs text-brand-earth transition-colors hover:text-brand-dust"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="font-display uppercase tracking-wider">All Posts</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {post && (
            <button
              type="button"
              onClick={() => (deleteConfirm ? handleDelete() : setDeleteConfirm(true))}
              onBlur={() => setDeleteConfirm(false)}
              disabled={pending}
              className={cn(
                'inline-flex items-center gap-1.5 border px-3 py-2 text-xs uppercase tracking-wider transition-colors',
                deleteConfirm
                  ? 'border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'border-brand-earth/40 text-brand-earth hover:border-red-500/40 hover:text-red-400',
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleteConfirm ? 'Confirm delete' : 'Delete'}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setStatus('draft')
              handleSave('draft')
            }}
            disabled={pending}
            className="inline-flex items-center gap-1.5 border border-brand-earth/50 bg-transparent px-4 py-2 text-xs uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-mist hover:text-brand-mist disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => {
              setStatus('published')
              handleSave('published')
            }}
            disabled={pending}
            className="inline-flex items-center gap-1.5 border border-brand-clay bg-brand-clay/15 px-4 py-2 text-xs uppercase tracking-wider text-brand-clay transition-colors hover:bg-brand-clay/25 hover:text-brand-mist disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {isPublished ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start justify-between gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
          <button type="button" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: main content */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title…"
              disabled={pending}
              className="w-full border border-brand-earth/40 bg-brand-void/60 px-4 py-3 text-xl text-brand-mist placeholder:text-brand-earth/40 outline-none transition-colors focus:border-brand-clay disabled:opacity-50"
            />
          </div>

          {/* Slug */}
          <div>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <div className="flex items-center border border-brand-earth/40 bg-brand-void/60 focus-within:border-brand-clay transition-colors">
              <span className="shrink-0 border-r border-brand-earth/30 px-3 py-2 text-xs text-brand-earth/60 select-none">
                /blog/
              </span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="post-slug"
                disabled={pending}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-mono text-brand-dust placeholder:text-brand-earth/40 outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <FieldLabel htmlFor="subtitle" optional>
              Subtitle
            </FieldLabel>
            <FieldInput
              id="subtitle"
              value={subtitle}
              onChange={setSubtitle}
              placeholder="A short subheading…"
              disabled={pending}
            />
          </div>

          {/* Excerpt */}
          <div>
            <FieldLabel htmlFor="excerpt" optional>
              Excerpt
            </FieldLabel>
            <FieldTextarea
              id="excerpt"
              value={excerpt}
              onChange={setExcerpt}
              placeholder="A brief summary shown in blog listings…"
              disabled={pending}
              rows={2}
            />
          </div>

          {/* Editor */}
          <div>
            <FieldLabel>Content</FieldLabel>
            <BlogEditor
              value={content}
              onChange={setContent}
              disabled={pending}
              placeholder="Start writing your post…"
            />
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="flex flex-col gap-3">
          {/* Status & Featured */}
          <SidebarSection title="Publish">
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="flex items-center gap-3">
                  <Switch
                    id="status-toggle"
                    checked={isPublished}
                    onCheckedChange={(v) => setStatus(v ? 'published' : 'draft')}
                    disabled={pending}
                    className="data-[state=checked]:bg-brand-clay data-[state=unchecked]:bg-brand-earth/40"
                  />
                  <label
                    htmlFor="status-toggle"
                    className={cn(
                      'text-xs font-medium uppercase tracking-wider',
                      isPublished ? 'text-brand-clay' : 'text-brand-dust',
                    )}
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </label>
                </div>
              </div>

              <div>
                <FieldLabel>Featured</FieldLabel>
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured-toggle"
                    checked={featured}
                    onCheckedChange={setFeatured}
                    disabled={pending}
                    className="data-[state=checked]:bg-brand-clay data-[state=unchecked]:bg-brand-earth/40"
                  />
                  <label
                    htmlFor="featured-toggle"
                    className={cn(
                      'text-xs font-medium uppercase tracking-wider',
                      featured ? 'text-brand-clay' : 'text-brand-dust',
                    )}
                  >
                    {featured ? 'Featured' : 'Not featured'}
                  </label>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="publish-date" optional>
                  Publish Date
                </FieldLabel>
                <FieldInput
                  id="publish-date"
                  type="date"
                  value={publishDate}
                  onChange={setPublishDate}
                  disabled={pending}
                  className="scheme-dark"
                />
              </div>
            </div>
          </SidebarSection>

          {/* Cover Image */}
          <SidebarSection title="Cover Image">
            <div className="flex flex-col gap-3">
              {coverUrl ? (
                <div className="group relative aspect-video w-full overflow-hidden border border-brand-earth/30">
                  <Image
                    src={coverUrl}
                    alt={coverAlt || 'Cover image'}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverUrl('')
                      setCoverAlt('')
                    }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading || pending}
                  className="flex aspect-video w-full flex-col items-center justify-center gap-2 border border-dashed border-brand-earth/40 bg-brand-void/40 text-brand-earth transition-colors hover:border-brand-clay hover:text-brand-clay disabled:opacity-50"
                >
                  {coverUploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-xs">Uploading…</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5" />
                      <span className="text-xs">Upload cover image</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleCoverUpload(file)
                    e.target.value = ''
                  }
                }}
              />
              {coverUrl && (
                <FieldInput
                  value={coverAlt}
                  onChange={setCoverAlt}
                  placeholder="Alt text…"
                  disabled={pending}
                />
              )}
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading || pending}
                  className="text-xs text-brand-earth hover:text-brand-dust"
                >
                  Replace image
                </button>
              )}
            </div>
          </SidebarSection>

          {/* Author */}
          <SidebarSection title="Author">
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel htmlFor="author-name">Name</FieldLabel>
                <FieldInput
                  id="author-name"
                  value={authorName}
                  onChange={setAuthorName}
                  placeholder="Author name"
                  disabled={pending}
                />
              </div>
              <div>
                <FieldLabel htmlFor="author-bio" optional>
                  Bio
                </FieldLabel>
                <FieldTextarea
                  id="author-bio"
                  value={authorBio}
                  onChange={setAuthorBio}
                  placeholder="Short bio…"
                  disabled={pending}
                  rows={2}
                />
              </div>
              <div>
                <FieldLabel htmlFor="author-avatar" optional>
                  Avatar URL
                </FieldLabel>
                <FieldInput
                  id="author-avatar"
                  value={authorAvatar}
                  onChange={setAuthorAvatar}
                  placeholder="https://…"
                  disabled={pending}
                />
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-brand-earth/60">
                Socials
              </div>
              <div>
                <FieldLabel htmlFor="author-twitter" optional>
                  Twitter / X
                </FieldLabel>
                <FieldInput
                  id="author-twitter"
                  value={authorTwitter}
                  onChange={setAuthorTwitter}
                  placeholder="@handle or URL"
                  disabled={pending}
                />
              </div>
              <div>
                <FieldLabel htmlFor="author-instagram" optional>
                  Instagram
                </FieldLabel>
                <FieldInput
                  id="author-instagram"
                  value={authorInstagram}
                  onChange={setAuthorInstagram}
                  placeholder="@handle or URL"
                  disabled={pending}
                />
              </div>
              <div>
                <FieldLabel htmlFor="author-website" optional>
                  Website
                </FieldLabel>
                <FieldInput
                  id="author-website"
                  value={authorWebsite}
                  onChange={setAuthorWebsite}
                  placeholder="https://…"
                  disabled={pending}
                />
              </div>
            </div>
          </SidebarSection>

          {/* Taxonomy */}
          <SidebarSection title="Taxonomy">
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel htmlFor="categories" optional>
                  Categories
                </FieldLabel>
                <FieldInput
                  id="categories"
                  value={categories}
                  onChange={setCategories}
                  placeholder="Books, Culture, Literature"
                  disabled={pending}
                />
                <p className="mt-1 text-[0.6rem] text-brand-earth/60">Comma-separated</p>
              </div>
              <div>
                <FieldLabel htmlFor="tags" optional>
                  Tags
                </FieldLabel>
                <FieldInput
                  id="tags"
                  value={tags}
                  onChange={setTags}
                  placeholder="urdu, fiction, review"
                  disabled={pending}
                />
                <p className="mt-1 text-[0.6rem] text-brand-earth/60">Comma-separated</p>
              </div>
              <div>
                <FieldLabel htmlFor="language">Language</FieldLabel>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={pending}
                  className="w-full border border-brand-earth/40 bg-brand-void/60 px-3 py-2 text-sm text-brand-mist outline-none transition-colors focus:border-brand-clay disabled:opacity-50 scheme-dark"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="fa">Persian (فارسی)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </SidebarSection>

          {/* SEO */}
          <SidebarSection title="SEO" defaultOpen={false}>
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel htmlFor="seo-title" optional>
                  SEO Title
                </FieldLabel>
                <FieldInput
                  id="seo-title"
                  value={seoTitle}
                  onChange={setSeoTitle}
                  placeholder="Overrides post title for search engines"
                  disabled={pending}
                />
                <p className="mt-1 text-right text-[0.6rem] text-brand-earth/60">
                  {seoTitle.length}/60
                </p>
              </div>
              <div>
                <FieldLabel htmlFor="seo-desc" optional>
                  SEO Description
                </FieldLabel>
                <FieldTextarea
                  id="seo-desc"
                  value={seoDescription}
                  onChange={setSeoDescription}
                  placeholder="Meta description for search engines…"
                  disabled={pending}
                  rows={3}
                />
                <p className="mt-1 text-right text-[0.6rem] text-brand-earth/60">
                  {seoDescription.length}/160
                </p>
              </div>
            </div>
          </SidebarSection>

          {/* Last updated */}
          {post && (
            <p className="text-[0.6rem] text-brand-earth/50">
              Last updated:{' '}
              {new Date(post.updated_at).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
