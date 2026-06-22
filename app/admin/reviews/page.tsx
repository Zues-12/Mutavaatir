import type { Metadata } from 'next'
import { Suspense } from 'react'
import AdminReviewsSection from '@/components/admin/admin-reviews-section'
import DashboardDateRangePicker from '@/components/admin/dashboard-date-range-picker'
import { formatDateRangeLabel, parseDateRangeFilter } from '@/lib/admin/date-range'
import {
  getReviewDashboardStats,
  listDashboardReviews,
} from '@/lib/admin/review-queries'

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'Verified subscriber reviews for Mutavaatir.',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ from?: string; to?: string }>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const fromParam = firstParam(params.from)
  const toParam = firstParam(params.to)
  const dateRange = parseDateRangeFilter(fromParam, toParam)

  const [reviewStats, reviews] = await Promise.all([
    getReviewDashboardStats(dateRange),
    listDashboardReviews(dateRange),
  ])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-end">
        <Suspense
          fallback={
            <div className="inline-flex items-center gap-2 self-start border border-brand-earth/60 bg-brand-void/40 px-3 py-2 text-xs text-brand-dust sm:ml-auto">
              Loading dates…
            </div>
          }
        >
          <DashboardDateRangePicker />
        </Suspense>
      </div>

      <AdminReviewsSection
        reviews={reviews}
        stats={reviewStats}
        dateRange={dateRange}
        variant="page"
      />

      {dateRange ? (
        <p className="mt-6 text-xs uppercase tracking-wider text-brand-earth">
          Showing reviews from {formatDateRangeLabel(dateRange)}
        </p>
      ) : null}
    </div>
  )
}
