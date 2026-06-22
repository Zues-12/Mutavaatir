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
  }
}

export type ReviewDashboardStats = {
  readonly total: number
  readonly averageRating: number
  readonly wouldRecommendYes: number
}

type ReviewRow = Review & {
  order: DashboardReview['order'] | DashboardReview['order'][] | null
}

function normalizeReview(row: ReviewRow): DashboardReview | null {
  const order = Array.isArray(row.order) ? row.order[0] : row.order
  if (!order?.application) return null

  const application = Array.isArray(order.application) ? order.application[0] : order.application
  if (!application) return null

  return {
    ...row,
    order: {
      month_number: order.month_number,
      application,
    },
  }
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

  return data
    .map((row) => normalizeReview(row as ReviewRow))
    .filter((row): row is DashboardReview => row !== null)
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
