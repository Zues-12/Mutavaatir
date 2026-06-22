import Link from 'next/link'
import { MessageSquareQuote, Star, ThumbsUp } from 'lucide-react'
import AdminReviewsTable from '@/components/admin/admin-reviews-table'
import {
  type DashboardReview,
  type ReviewDashboardStats,
} from '@/lib/admin/review-queries'
import { formatDateRangeLabel, type DateRangeFilter } from '@/lib/admin/date-range'
import { cn } from '@/lib/utils'

type AdminReviewsSectionProps = {
  reviews: readonly DashboardReview[]
  stats: ReviewDashboardStats
  dateRange?: DateRangeFilter | null
  variant?: 'dashboard' | 'page'
  viewAllHref?: string
}

export default function AdminReviewsSection({
  reviews,
  stats,
  dateRange = null,
  variant = 'dashboard',
  viewAllHref,
}: AdminReviewsSectionProps) {
  const rangeLabel = formatDateRangeLabel(dateRange)
  const isPage = variant === 'page'
  const HeadingTag = isPage ? 'h1' : 'h2'

  const statCards = [
    {
      label: 'Total reviews',
      value: String(stats.total),
      icon: MessageSquareQuote,
      tone: 'text-brand-mist',
    },
    {
      label: 'Average rating',
      value: stats.total > 0 ? `${stats.averageRating}/5` : '—',
      icon: Star,
      tone: 'text-brand-clay',
    },
    {
      label: 'Would recommend',
      value: stats.total > 0 ? String(stats.wouldRecommendYes) : '—',
      icon: ThumbsUp,
      tone: 'text-emerald-300',
    },
  ] as const

  return (
    <section
      aria-labelledby="reviews-heading"
      className={cn(isPage ? '' : 'mt-10 border border-brand-earth/60 bg-brand-void/40')}
    >
      {isPage ? (
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.35em] text-brand-clay">
              Feedback
            </p>
            <HeadingTag
              id="reviews-heading"
              className="font-display text-3xl font-normal leading-tight tracking-normal text-brand-mist sm:text-4xl"
            >
              REVIEWS
            </HeadingTag>
            <div className="h-px w-12 bg-brand-clay" aria-hidden />
            <p className="max-w-2xl text-sm leading-relaxed text-brand-dust sm:text-base">
              Verified reviews submitted by subscribers using their monthly parcel code.
            </p>
          </div>
          <p className="text-xs uppercase tracking-wider text-brand-earth">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            {dateRange ? ` · ${rangeLabel}` : ''}
          </p>
        </header>
      ) : (
        <header className="flex flex-col gap-4 border-b border-brand-earth/60 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-clay">
              Feedback
            </p>
            <HeadingTag
              id="reviews-heading"
              className="font-display text-xl font-normal tracking-normal text-brand-mist sm:text-2xl"
            >
              VERIFIED REVIEWS
            </HeadingTag>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <dl className="flex flex-wrap gap-4 text-xs uppercase tracking-wider text-brand-earth">
              <div>
                <dt className="sr-only">Total reviews</dt>
                <dd className="text-brand-mist">{stats.total} total</dd>
              </div>
              {stats.total > 0 ? (
                <>
                  <div>
                    <dt className="sr-only">Average rating</dt>
                    <dd className="text-brand-mist">{stats.averageRating} avg</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Would recommend yes</dt>
                    <dd className="text-brand-mist">{stats.wouldRecommendYes} recommend</dd>
                  </div>
                </>
              ) : null}
            </dl>
            {viewAllHref ? (
              <Link
                href={viewAllHref}
                className="font-display border border-brand-earth/60 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-mist"
              >
                View all
              </Link>
            ) : null}
          </div>
        </header>
      )}

      {isPage ? (
        <ul className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <li
                key={stat.label}
                className="flex flex-col gap-4 border border-brand-earth/60 bg-brand-void/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.65rem] font-medium uppercase tracking-[0.25em] text-brand-earth">
                    {stat.label}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-earth/30 text-brand-clay">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
                <p className={cn('font-display text-3xl font-normal leading-none', stat.tone)}>
                  {stat.value}
                </p>
              </li>
            )
          })}
        </ul>
      ) : null}

      <div className={cn(isPage && 'border border-brand-earth/60 bg-brand-void/40')}>
        <AdminReviewsTable
          reviews={reviews}
          emptyMessage={
            dateRange
              ? 'No verified reviews in the selected period.'
              : 'No verified reviews yet.'
          }
        />
      </div>
    </section>
  )
}
