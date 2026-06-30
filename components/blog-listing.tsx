'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Search, ArrowUpRight, Star, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PublicBlogPost } from '@/lib/blog-queries'

const POSTS_PER_PAGE = 10

function estimateReadingTime(html: string | null): number {
  if (!html) return 1
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 20))
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function groupByMonth(posts: PublicBlogPost[]): [string, PublicBlogPost[]][] {
  const map = new Map<string, PublicBlogPost[]>()
  for (const post of posts) {
    const key = format(
      new Date(post.publish_date ?? post.created_at),
      'MMMM yyyy',
    ).toUpperCase()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(post)
  }
  return Array.from(map.entries())
}

/* ── Single list item (horizontal card) ─────────────────────────────────── */

function BlogPostTags({ post }: { post: PublicBlogPost }) {
  if (post.categories.length === 0 && !post.featured) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {post.featured && (
        <span className="flex items-center gap-1 bg-brand-clay px-2 py-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-wider text-brand-void">
          <Star className="h-2.5 w-2.5 fill-brand-void" aria-hidden />
          Featured
        </span>
      )}
      {post.categories.slice(0, 2).map((cat) => (
        <span
          key={cat}
          className="border border-brand-earth/35 px-2.5 py-0.5 font-display text-[0.6rem] font-medium uppercase tracking-[0.15em] text-brand-earth"
        >
          {cat}
        </span>
      ))}
    </div>
  )
}

function BlogPostDate({ dayName, dayNum }: { dayName: string; dayNum: string }) {
  return (
    <div className="w-12 shrink-0 text-center sm:w-14">
      <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.15em] text-brand-earth">
        {dayName}
      </p>
      <p className="mt-1 font-display text-3xl font-medium leading-none text-brand-mist sm:text-4xl">
        {dayNum}
      </p>
    </div>
  )
}

function BlogPostThumbnail({ post }: { post: PublicBlogPost }) {
  return (
    <div className="relative h-24 w-32 shrink-0 overflow-hidden sm:h-28 sm:w-36">
      {post.cover_image_url ? (
        <Image
          src={post.cover_image_url}
          alt={post.cover_image_alt ?? post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          sizes="144px"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              'radial-gradient(ellipse at 30% 60%, rgb(123 98 68 / 0.4), rgb(13 13 13 / 0.8))',
          }}
        >
          <span
            className="font-display text-3xl font-medium text-brand-earth/35"
            aria-hidden
          >
            M
          </span>
        </div>
      )}
    </div>
  )
}

function BlogPostArrow() {
  return (
    <ArrowUpRight
      className="h-5 w-5 text-brand-clay/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-clay"
      aria-hidden
    />
  )
}

function BlogListItem({
  post,
  hasDivider,
}: {
  post: PublicBlogPost
  hasDivider: boolean
}) {
  const date = new Date(post.publish_date ?? post.created_at)
  const dayName = format(date, 'EEE').toUpperCase()
  const dayNum = format(date, 'dd')
  const readingTime = estimateReadingTime(null)
  const isRtl = post.language === 'ur' || post.language === 'ar' || post.language === 'fa'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group block border-b border-brand-earth/20 px-5 py-7 transition-colors duration-200 hover:bg-brand-earth/6 sm:px-8 sm:py-8',
        hasDivider && 'lg:border-r lg:border-brand-earth/20',
      )}
    >
      {/* Mobile layout */}
      <div className="flex flex-col sm:hidden">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <BlogPostTags post={post} />
          </div>
          <div className="shrink-0">
            <BlogPostArrow />
          </div>
        </div>

        <div className="mb-4 flex items-start gap-4">
          <BlogPostDate dayName={dayName} dayNum={dayNum} />
          <BlogPostThumbnail post={post} />
        </div>

        <div dir={isRtl ? 'rtl' : undefined} lang={post.language}>
          <h2 className="font-display text-base font-medium leading-snug tracking-wide text-brand-mist transition-colors duration-150 group-hover:text-brand-clay">
            {post.title}
          </h2>

          {(post.subtitle || post.excerpt) && (
            <p className="py-2 line-clamp-3 text-sm leading-relaxed text-brand-dust/80">
              {post.subtitle ?? post.excerpt}
            </p>
          )}

          <p className="mt-3 text-xs text-brand-earth">
            {post.author_name && (
              <span className="text-brand-earth/70">{post.author_name}</span>
            )}
            {post.author_name && <span className="mx-1.5 opacity-40">·</span>}
            <span>{readingTime} min read</span>
          </p>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden items-start gap-6 sm:flex">
        <BlogPostDate dayName={dayName} dayNum={dayNum} />
        <BlogPostThumbnail post={post} />

        <div className="min-w-0 flex-1" dir={isRtl ? 'rtl' : undefined} lang={post.language}>
          <div className="mb-2.5">
            <BlogPostTags post={post} />
          </div>

          <h2 className="font-display text-lg font-medium leading-snug tracking-wide text-brand-mist transition-colors duration-150 group-hover:text-brand-clay">
            {post.title}
          </h2>

          {(post.subtitle || post.excerpt) && (
            <p className="p-2 line-clamp-3 text-sm leading-relaxed text-brand-dust/80">
              {post.subtitle ?? post.excerpt}
            </p>
          )}

          <p className="mt-3 text-xs text-brand-earth">
            {post.author_name && (
              <span className="text-brand-earth/70">{post.author_name}</span>
            )}
            {post.author_name && <span className="mx-1.5 opacity-40">·</span>}
            <span>{readingTime} min read</span>
          </p>
        </div>

        <div className="shrink-0 pt-1">
          <BlogPostArrow />
        </div>
      </div>
    </Link>
  )
}

/* ── Month section header ────────────────────────────────────────────────── */

function MonthHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 px-5 py-4 sm:px-8 sm:py-5">
      <span className="inline-block bg-brand-earth px-4 py-1.5 font-display text-xs font-medium uppercase tracking-[0.25em] text-brand-void">
        {label}
      </span>
      <div className="h-px flex-1 bg-brand-earth/20" aria-hidden />
    </div>
  )
}

/* ── Pagination controls ─────────────────────────────────────────────────── */

function Pagination({
  currentPage,
  totalPages,
  onPage,
}: {
  currentPage: number
  totalPages: number
  onPage: (page: number) => void
}) {
  if (totalPages <= 1) return null

  // Build page number list with ellipsis
  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('…')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1 sm:gap-1.5"
    >
      <button
        type="button"
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center border border-brand-earth/30 text-brand-earth transition-colors hover:border-brand-dust hover:text-brand-dust disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-xs text-brand-earth/50"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'flex h-9 w-9 items-center justify-center border font-display text-xs uppercase tracking-wider transition-colors',
              p === currentPage
                ? 'border-brand-clay bg-brand-clay/15 text-brand-clay'
                : 'border-brand-earth/30 text-brand-earth hover:border-brand-dust hover:text-brand-dust',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center border border-brand-earth/30 text-brand-earth transition-colors hover:border-brand-dust hover:text-brand-dust disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */

type BlogListingProps = {
  posts: readonly PublicBlogPost[]
}

export default function BlogListing({ posts }: BlogListingProps) {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts as PublicBlogPost[]
    return (posts as PublicBlogPost[]).filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q)) ||
        (p.author_name && p.author_name.toLowerCase().includes(q)),
    )
  }, [posts, query])

  // Reset to page 1 whenever the search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    [filtered, currentPage],
  )

  const grouped = useMemo(() => groupByMonth(paginated), [paginated])

  return (
    <section className="bg-brand-void py-14 sm:py-16 lg:py-20" aria-label="Blog posts">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Search bar ── */}
        <div className="relative mb-10 sm:mb-12">
          <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
            <Search className="h-5 w-5 text-brand-earth" aria-hidden />
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH FOR POST"
            aria-label="Search posts"
            className="w-full border border-brand-earth/40 bg-brand-void py-4 pl-13 pr-12 font-display text-sm uppercase tracking-[0.2em] text-brand-mist placeholder:text-brand-earth/55 outline-none transition-colors focus:border-brand-clay"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-brand-earth hover:text-brand-dust"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ── Empty states ── */}
        {posts.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="h-px w-12 bg-brand-earth/40" />
            <p className="font-display text-sm uppercase tracking-[0.25em] text-brand-earth">
              Coming soon
            </p>
            <p className="max-w-sm text-sm text-brand-dust/70">
              Our first posts are on their way. Check back soon.
            </p>
          </div>
        )}

        {posts.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="font-display text-xs uppercase tracking-[0.25em] text-brand-earth">
              No results
            </p>
            <p className="text-sm text-brand-dust/60">
              Nothing matched{' '}
              <span className="text-brand-dust">"{query}"</span>
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-2 font-display text-xs uppercase tracking-wider text-brand-clay hover:text-brand-mist"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ── Month groups ── */}
        {grouped.map(([month, monthPosts]) => (
          <div key={month} className="mb-10 last:mb-0 sm:mb-14">
            <MonthHeader label={month} />

            {/* 2-column grid on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {monthPosts.map((post, i) => (
                <BlogListItem
                  key={post.id}
                  post={post}
                  /* Add right divider to left-column items, unless it's a lone last item */
                  hasDivider={
                    i % 2 === 0 &&
                    !(i === monthPosts.length - 1 && monthPosts.length % 2 === 1)
                  }
                />
              ))}
            </div>
          </div>
        ))}

        {/* Pagination */}
        {filtered.length > 0 && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPage={(p) => {
                setCurrentPage(p)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />

            <p className="mt-5 text-center font-display text-[0.6rem] uppercase tracking-[0.3em] text-brand-earth/40">
              {(currentPage - 1) * POSTS_PER_PAGE + 1}–
              {Math.min(currentPage * POSTS_PER_PAGE, filtered.length)} of{' '}
              {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
              {query && ` matching "${query}"`}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
