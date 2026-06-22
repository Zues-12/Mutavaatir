import { createSupabaseServerClient } from '@/lib/supabase/server'
import { subscriptionPlans } from '@/lib/pricing-data'
import {
  getPlanAmount,
  isApprovedSubscription,
  isInFulfillmentPipeline,
  isSubscriptionStatus,
  type SubscriptionApplication,
  type SubscriptionStatus,
} from '@/lib/subscription-applications'
import {
  parseDateRangeFilter,
  type DateRangeFilter,
} from '@/lib/admin/date-range'

export type { DateRangeFilter } from '@/lib/admin/date-range'
export { formatDateParam, parseDateRangeFilter } from '@/lib/admin/date-range'

const PAYMENT_BUCKET = 'payment-screenshots'

export type PlanBreakdown = {
  readonly planId: string
  readonly total: number
  readonly pending: number
  readonly approved: number
  readonly rejected: number
}

type MutablePlanBreakdown = {
  planId: string
  total: number
  pending: number
  approved: number
  rejected: number
}

export type SubscriptionDashboardStats = {
  readonly pending: number
  readonly inFulfillment: number
  readonly active: number
  readonly rejected: number
  readonly total: number
  readonly approvedRevenue: number
  readonly pendingRevenue: number
  readonly thisMonth: number
  readonly approvedThisMonth: number
  readonly last7Days: number
  readonly approvalRate: number
  readonly byPlan: readonly PlanBreakdown[]
}

type ApplicationRow = {
  status: string
  plan_id: string
  created_at: string
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysAgo(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export async function getSubscriptionDashboardStats(
  dateRange?: DateRangeFilter | null,
): Promise<SubscriptionDashboardStats> {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('subscription_applications')
    .select('status, plan_id, created_at')

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.from.toISOString())
      .lte('created_at', dateRange.to.toISOString())
  }

  const { data, error } = await query

  const emptyPlanMap = (): Record<string, MutablePlanBreakdown> =>
    Object.fromEntries(
      subscriptionPlans.map((plan) => [
        plan.id,
        { planId: plan.id, total: 0, pending: 0, approved: 0, rejected: 0 },
      ]),
    )

  if (error || !data) {
    return {
      pending: 0,
      inFulfillment: 0,
      active: 0,
      rejected: 0,
      total: 0,
      approvedRevenue: 0,
      pendingRevenue: 0,
      thisMonth: 0,
      approvedThisMonth: 0,
      last7Days: 0,
      approvalRate: 0,
      byPlan: subscriptionPlans.map((plan) => ({
        planId: plan.id,
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      })),
    }
  }

  const rows = data as ApplicationRow[]
  const now = new Date()
  const monthStart = startOfMonth(now)
  const weekStart = daysAgo(now, 7)

  let pending = 0
  let inFulfillment = 0
  let active = 0
  let rejected = 0
  let approvedRevenue = 0
  let pendingRevenue = 0
  let thisMonth = 0
  let approvedThisMonth = 0
  let last7Days = 0

  const planMap = emptyPlanMap()

  for (const row of rows) {
    const createdAt = new Date(row.created_at)
    const amount = getPlanAmount(row.plan_id)
    const planStats = planMap[row.plan_id]
    const status = row.status as SubscriptionStatus

    if (planStats) planStats.total += 1

    if (createdAt >= monthStart) {
      thisMonth += 1
      if (isApprovedSubscription(status)) approvedThisMonth += 1
    }

    if (createdAt >= weekStart) {
      last7Days += 1
    }

    if (status === 'pending') {
      pending += 1
      pendingRevenue += amount
      if (planStats) planStats.pending += 1
    }
    if (isApprovedSubscription(status)) {
      approvedRevenue += amount
      if (planStats) planStats.approved += 1
    }
    if (status === 'completed') {
      active += 1
    }
    if (isInFulfillmentPipeline(status)) {
      inFulfillment += 1
    }
    if (status === 'rejected') {
      rejected += 1
      if (planStats) planStats.rejected += 1
    }
  }

  const approved = rows.filter((row) =>
    isApprovedSubscription(row.status as SubscriptionStatus),
  ).length
  const decided = approved + rejected
  const approvalRate = decided > 0 ? Math.round((approved / decided) * 100) : 0

  return {
    pending,
    inFulfillment,
    active,
    rejected,
    total: rows.length,
    approvedRevenue,
    pendingRevenue,
    thisMonth,
    approvedThisMonth,
    last7Days,
    approvalRate,
    byPlan: subscriptionPlans.map((plan) => planMap[plan.id]),
  }
}

export async function listSubscriptionApplications(
  statusFilter?: SubscriptionStatus | 'all',
  planFilter?: string | 'all',
  dateRange?: DateRangeFilter | null,
): Promise<SubscriptionApplication[]> {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('subscription_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  if (planFilter && planFilter !== 'all') {
    query = query.eq('plan_id', planFilter)
  }

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.from.toISOString())
      .lte('created_at', dateRange.to.toISOString())
  }

  const { data, error } = await query

  if (error || !data) return []
  return data as SubscriptionApplication[]
}

export async function getSubscriptionApplication(
  id: string,
): Promise<SubscriptionApplication | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('subscription_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as SubscriptionApplication
}

export async function getPaymentScreenshotUrl(
  path: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.storage
    .from(PAYMENT_BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data?.signedUrl) return null
  return data.signedUrl
}

export function parseStatusFilter(
  value: string | undefined,
): SubscriptionStatus | 'all' {
  if (!value || value === 'all') return 'all'
  return isSubscriptionStatus(value) ? value : 'all'
}

export function parsePlanFilter(value: string | undefined): string | 'all' {
  if (!value || value === 'all') return 'all'
  return subscriptionPlans.some((plan) => plan.id === value) ? value : 'all'
}

export function buildAdminFilterHref(
  basePath: string,
  filters: { status?: string; plan?: string; from?: string; to?: string },
): string {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') {
    params.set('status', filters.status)
  }
  if (filters.plan && filters.plan !== 'all') {
    params.set('plan', filters.plan)
  }
  if (filters.from) {
    params.set('from', filters.from)
  }
  if (filters.to) {
    params.set('to', filters.to)
  }
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}
