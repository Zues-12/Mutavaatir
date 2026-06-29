import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Star, Clock } from 'lucide-react'
import { estimateReadingTime, type PublicBlogPost } from '@/lib/blog-queries'
import { cn } from '@/lib/utils'

const LANG_LABELS: Record<string, string> = {
  en: 'English',
  ur: 'اردو',
  ar: 'العربية',
  fa: 'فارسی',
  hi: 'हिन्दी',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
}

type BlogPostCardProps = {
  post: PublicBlogPost
  featured?: boolean
  contentHtml?: string | null
}

export default function BlogPostCard({ post, featured = false, contentHtml }: BlogPostCardProps) {
  const publishedDate = post.publish_date ?? post.created_at
  const readingTime = estimateReadingTime(contentHtml ?? null)
  const isRtl = post.language === 'ur' || post.language === 'ar' || post.language === 'fa'

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden border border-brand-earth/20 bg-brand-void transition-all duration-300 hover:border-brand-earth/50',
        featured && 'border-brand-earth/40',
      )}
      lang={post.language}
      dir={isRtl ? 'rtl' : undefined}
    >
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-3/2 shrink-0 overflow-hidden bg-brand-void"
        tabIndex={-1}
        aria-hidden
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Fallback gradient when no cover image */
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 120% 80% at 30% 60%, rgb(123 98 68 / 0.35) 0%, transparent 65%), linear-gradient(160deg, #111 0%, #0d0d0d 100%)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-display text-4xl font-medium leading-none tracking-tighter text-brand-earth/30 sm:text-5xl"
                aria-hidden
              >
                M
              </span>
            </div>
          </div>
        )}

        {/* Overlay gradient at bottom for text legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: 'linear-gradient(to top, rgb(13 13 13 / 0.7), transparent)',
          }}
          aria-hidden
        />

        {post.featured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 bg-brand-clay px-2 py-0.5">
            <Star className="h-3 w-3 fill-brand-void text-brand-void" aria-hidden />
            <span className="font-display text-[0.6rem] font-semibold uppercase tracking-wider text-brand-void">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="border border-brand-earth/30 px-2 py-0.5 font-display text-[0.58rem] font-medium uppercase tracking-[0.18em] text-brand-clay"
              >
                {cat}
              </span>
            ))}
            {post.language !== 'en' && (
              <span className="border border-brand-earth/20 px-2 py-0.5 font-display text-[0.58rem] uppercase tracking-[0.18em] text-brand-earth">
                {LANG_LABELS[post.language] ?? post.language.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="font-display text-lg font-medium leading-snug tracking-wide text-brand-mist transition-colors duration-200 group-hover:text-brand-clay sm:text-xl">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>

        {/* Subtitle */}
        {post.subtitle && (
          <p className="mt-1.5 text-sm leading-snug text-brand-dust/80 line-clamp-1">
            {post.subtitle}
          </p>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-2.5 text-sm leading-relaxed text-brand-dust line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Footer meta */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-brand-earth">
          {post.author_name && (
            <span className="font-medium text-brand-dust">{post.author_name}</span>
          )}
          <span aria-hidden>·</span>
          <time dateTime={publishedDate}>
            {format(new Date(publishedDate), 'MMM d, yyyy')}
          </time>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {readingTime} min read
          </span>
        </div>
      </div>
    </article>
  )
}
