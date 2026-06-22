import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { DateRangeFilter } from '@/lib/admin/date-range'
import type { Review, RecommendOption } from '@/lib/reviews'

export type DashboardReview = Review & {
  readonly order: {
    readonly month_number: number
    readonly application: {
      readonly id: string
      readonly full_name: string
      readonly email: string
      readonly plan_id: string
    }
  } | null
}

type ReviewRow = Review & {
  order: NonNullable<DashboardReview['order']> | NonNullable<DashboardReview['order']>[] | null
}

function normalizeReview(row: ReviewRow): DashboardReview {
  const orderRaw = Array.isArray(row.order) ? row.order[0] : row.order

  if (!orderRaw?.application) {
    return {
      ...row,
      published: Boolean(row.published),
      featured: Boolean(row.featured),
      order: null,
    }
  }

  const application = Array.isArray(orderRaw.application)
    ? orderRaw.application[0]
    : orderRaw.application

  if (!application) {
    return {
      ...row,
      published: Boolean(row.published),
      featured: Boolean(row.featured),
      order: null,
    }
  }

  return {
    ...row,
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    order: {
      month_number: orderRaw.month_number,
      application,
    },
  }
}

export type ReviewDashboardStats = {
  readonly total: number
  readonly averageRating: number
  readonly wouldRecommendYes: number
}

export async function getReviewDashboardStats(
  dateRange?: DateRangeFilter | null,
): Promise<ReviewDashboardStats> {
  const supabase = await createSupabaseServerClient()

  let query = supabase.from('reviews').select('rating, would_recommend')

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.from.toISOString())
      .lte('created_at', dateRange.to.toISOString())
  }

  const { data, error } = await query

  if (error || !data?.length) {
    return { total: 0, averageRating: 0, wouldRecommendYes: 0 }
  }

  const total = data.length
  const averageRating =
    Math.round((data.reduce((sum, row) => sum + row.rating, 0) / total) * 10) / 10
  const wouldRecommendYes = data.filter((row) => row.would_recommend === 'yes').length

  return { total, averageRating, wouldRecommendYes }
}

export async function listDashboardReviews(
  dateRange?: DateRangeFilter | null,
  limit?: number,
): Promise<DashboardReview[]> {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('reviews')
    .select(
      `
      *,
      order:subscription_orders!order_id (
        month_number,
        application:subscription_applications!application_id (
          id,
          full_name,
          email,
          plan_id
        )
      )
    `,
    )
    .order('created_at', { ascending: false })

  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.from.toISOString())
      .lte('created_at', dateRange.to.toISOString())
  }

  const { data, error } = await query

  if (error || !data) return []

  return data.map((row) => normalizeReview(row as ReviewRow))
}

export function formatRecommendLabel(value: RecommendOption): string {
  switch (value) {
    case 'yes':
      return 'Yes'
    case 'no':
      return 'No'
    case 'maybe':
      return 'Maybe'
  }
}
