import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Clock, Globe, Instagram, Twitter, ExternalLink, Star, Tag } from 'lucide-react'
import Footer from '@/components/footer'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import {
  getPublicBlogPost,
  listPublishedBlogSlugs,
  estimateReadingTime,
} from '@/lib/blog-queries'
import { publicPageMetadata } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site'
import { cn } from '@/lib/utils'

type Params = Promise<{ slug: string }>

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

export async function generateStaticParams() {
  const slugs = await listPublishedBlogSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublicBlogPost(slug)
  if (!post) return {}

  const title = post.seo_title ?? post.title
  const description =
    post.seo_description ?? post.excerpt ?? `Read "${post.title}" on Mutavaatir Editorial.`

  const base = publicPageMetadata({
    title: `${title} — Mutavaatir Editorial`,
    description,
    path: `/blog/${post.slug}`,
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.publish_date ?? post.created_at,
      authors: [post.author_name],
      ...(post.cover_image_url
        ? {
            images: [
              {
                url: post.cover_image_url,
                alt: post.cover_image_alt ?? post.title,
                width: 1200,
                height: 630,
              },
            ],
          }
        : {}),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getPublicBlogPost(slug)

  if (!post) notFound()

  const publishedDate = post.publish_date ?? post.created_at
  const readingTime = estimateReadingTime(post.content)
  const isRtl = post.language === 'ur' || post.language === 'ar' || post.language === 'fa'

  const authorSocials = [
    post.author_twitter && {
      label: 'Twitter / X',
      href: post.author_twitter.startsWith('http')
        ? post.author_twitter
        : `https://twitter.com/${post.author_twitter.replace('@', '')}`,
      icon: Twitter,
    },
    post.author_instagram && {
      label: 'Instagram',
      href: post.author_instagram.startsWith('http')
        ? post.author_instagram
        : `https://instagram.com/${post.author_instagram.replace('@', '')}`,
      icon: Instagram,
    },
    post.author_website && {
      label: 'Website',
      href: post.author_website,
      icon: ExternalLink,
    },
  ].filter(Boolean) as {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  }[]

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt ?? undefined,
            datePublished: publishedDate,
            dateModified: publishedDate,
            author: { '@type': 'Person', name: post.author_name, url: post.author_website ?? undefined },
            image: post.cover_image_url ?? undefined,
            url: `${getSiteUrl()}/blog/${post.slug}`,
            publisher: { '@type': 'Organization', name: 'Mutavaatir', url: getSiteUrl() },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-brand-void" aria-labelledby="post-title">
        {post.cover_image_url && (
          <>
            <div className="pointer-events-none absolute inset-0 z-0 opacity-75" aria-hidden>
              <Image
                src={post.cover_image_url}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
                quality={85}
              />
            </div>
            {/* Stronger scrim at bottom where text sits */}
            <div
              className="pointer-events-none absolute inset-0 z-1"
              aria-hidden
              style={{
                background:
                  'linear-gradient(to bottom, rgb(13 13 13 / 0.45) 0%, rgb(13 13 13 / 0.35) 35%, rgb(13 13 13 / 0.82) 75%, rgb(13 13 13 / 0.96) 100%)',
              }}
            />
          </>
        )}

        {!post.cover_image_url && (
          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 0% 100%, rgb(123 98 68 / 0.25) 0%, transparent 65%)',
            }}
          />
        )}

        {/* Hero content — full max-w-7xl, left-aligned */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-18 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-28">
          {/* Title */}
          <h1
            id="post-title"
            className="max-w-4xl font-display text-3xl font-medium leading-tight tracking-wide text-brand-mist sm:text-4xl lg:text-5xl xl:text-6xl"
            lang={post.language}
            dir={isRtl ? 'rtl' : undefined}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed text-brand-dust/90 sm:text-lg lg:text-xl"
              lang={post.language}
              dir={isRtl ? 'rtl' : undefined}
            >
              {post.subtitle}
            </p>
          )}

          {/* Divider */}
          <div className="mt-7 h-px w-12 bg-brand-earth/50" aria-hidden />

          {/* Meta row */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-earth">
            {post.author_name && (
              <span
                className="font-medium text-brand-dust"
                lang={post.language}
                dir={isRtl ? 'rtl' : undefined}
              >
                {post.author_name}
              </span>
            )}
            <time dateTime={publishedDate}>
              {format(new Date(publishedDate), 'MMMM d, yyyy')}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {readingTime} min read
            </span>
            {post.language !== 'en' && (
              <span className="flex items-center gap-1.5" lang={post.language} dir={isRtl ? 'rtl' : undefined}>
                <Globe className="h-3.5 w-3.5" aria-hidden />
                {LANG_LABELS[post.language] ?? post.language.toUpperCase()}
              </span>
            )}
          </div>

          {/* Categories + featured — bottom of hero */}
          {(post.categories.length > 0 || post.featured) && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {post.featured && (
                <span className="flex items-center gap-1 border border-brand-clay bg-brand-clay px-3 py-1 font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-brand-void">
                  <Star className="h-2.5 w-2.5 fill-brand-void" aria-hidden />
                  Featured
                </span>
              )}
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="border border-brand-clay/40 px-3 py-1 font-display text-[0.62rem] font-medium uppercase tracking-[0.2em] text-brand-clay"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Content + Sidebar ─────────────────────────────────────────────── */}
      <section className="bg-brand-void py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/*
            English: [article 1fr | sidebar 300px] — sidebar RIGHT
            Urdu/RTL: [sidebar 300px | article 1fr] — sidebar LEFT
            We swap the grid template AND use explicit column placement so the
            sidebar always occupies the narrow column and the article the wide one.
          */}
          <div
            className={cn(
              'grid grid-cols-1 gap-10 lg:gap-16 xl:gap-20',
              isRtl
                ? 'lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]'
                : 'lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]',
            )}
          >

            {/* ── Article body ── */}
            <article className={cn(isRtl && 'lg:col-start-2 lg:row-start-1')}>
              {post.content ? (
                <div
                  className="blog-preview-content p-0!"
                  lang={post.language}
                  dir={isRtl ? 'rtl' : undefined}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-sm text-brand-earth/60">No content available.</p>
              )}
            </article>

            {/* ── Sticky sidebar ── */}
            <aside
              className={cn(
                'flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start',
                isRtl && 'lg:col-start-1 lg:row-start-1',
              )}
            >

              {/* Author card */}
              {(post.author_name || post.author_bio) && (
                <div className="border border-brand-earth/25 bg-brand-void p-5">
                  <p className="mb-4 font-display text-[0.6rem] uppercase tracking-[0.3em] text-brand-earth">
                    Author
                  </p>
                  <div className="flex items-start gap-4">
                    {post.author_avatar_url ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden">
                        <Image
                          src={post.author_avatar_url}
                          alt={post.author_name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-earth/20">
                        <span className="font-display text-lg font-medium text-brand-clay">
                          {post.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className="font-display text-sm font-medium tracking-wide text-brand-mist"
                        lang={post.language}
                      >
                        {post.author_name}
                      </p>
                      {post.author_bio && (
                        <p
                          className="mt-1.5 text-xs leading-relaxed text-brand-dust/80"
                          lang={post.language}
                        >
                          {post.author_bio}
                        </p>
                      )}
                      {authorSocials.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {authorSocials.map(({ label, href, icon: Icon }) => (
                            <a
                              key={href}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${post.author_name} on ${label}`}
                              className="flex items-center gap-1 text-[0.68rem] text-brand-earth transition-colors hover:text-brand-clay"
                            >
                              <Icon className="h-3 w-3" strokeWidth={1.6} aria-hidden />
                              {label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Categories */}
              {post.categories.length > 0 && (
                <div className="border border-brand-earth/25 p-5">
                  <p className="mb-3 font-display text-[0.6rem] uppercase tracking-[0.3em] text-brand-earth">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((cat) => (
                      <span
                        key={cat}
                        className="border border-brand-clay/30 px-2.5 py-1 font-display text-[0.62rem] font-medium uppercase tracking-[0.15em] text-brand-clay"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="border border-brand-earth/25 p-5">
                  <p className="mb-3 flex items-center gap-2 font-display text-[0.6rem] uppercase tracking-[0.3em] text-brand-earth">
                    <Tag className="h-3 w-3" aria-hidden />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-brand-earth/30 px-2 py-0.5 text-xs text-brand-earth/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Publish info */}
              <div className="border border-brand-earth/25 p-5 text-xs text-brand-earth">
                <p className="mb-3 font-display text-[0.6rem] uppercase tracking-[0.3em]">
                  Published
                </p>
                <p className="text-brand-dust">
                  {format(new Date(publishedDate), 'MMMM d, yyyy')}
                </p>
                <p className="mt-1 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" aria-hidden />
                  {readingTime} min read
                </p>
                {post.language !== 'en' && (
                  <p className="mt-1 flex items-center gap-1.5" lang={post.language}>
                    <Globe className="h-3 w-3" aria-hidden />
                    {LANG_LABELS[post.language] ?? post.language.toUpperCase()}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/blog"
                  className="flex items-center justify-center gap-2 border border-brand-earth/40 py-3 font-display text-xs uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-mist hover:text-brand-mist"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Editorial
                </Link>
                <Link
                  href="/subscribe"
                  className="flex items-center justify-center border border-brand-clay bg-brand-clay/10 py-3 font-display text-xs uppercase tracking-wider text-brand-clay transition-colors hover:bg-brand-clay/20 hover:text-brand-mist"
                >
                  Subscribe to Mutavaatir
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
