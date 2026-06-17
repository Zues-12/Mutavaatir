import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  CalendarDays,
  Clock,
  DollarSign,
  Percent,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import DashboardDateRangePicker from '@/components/admin/dashboard-date-range-picker'
import SubscriptionFilters from '@/components/admin/subscription-filters'
import SubscriptionReviewActions from '@/components/admin/subscription-review-actions'
import SubscriptionStatusBadge from '@/components/admin/subscription-status-badge'
import { formatDateRangeLabel } from '@/lib/admin/date-range'
import {
  buildAdminFilterHref,
  getSubscriptionDashboardStats,
  listSubscriptionApplications,
  parseDateRangeFilter,
  parsePlanFilter,
  parseStatusFilter,
} from '@/lib/admin/subscription-queries'
import { formatPlanPrice, getPlanLabel } from '@/lib/subscription-applications'
import { formatRupee } from '@/lib/pricing-data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of Mutavaatir subscriptions and applications.',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ status?: string; plan?: string; from?: string; to?: string }>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const statusFilter = parseStatusFilter(firstParam(params.status))
  const planFilter = parsePlanFilter(firstParam(params.plan))
  const fromParam = firstParam(params.from)
  const toParam = firstParam(params.to)
  const dateRange = parseDateRangeFilter(fromParam, toParam)
  const rangeLabel = formatDateRangeLabel(dateRange)

  const [stats, applications] = await Promise.all([
    getSubscriptionDashboardStats(dateRange),
    listSubscriptionApplications(statusFilter, planFilter, dateRange),
  ])

  const statCards = [
    {
      label: 'Active subscriptions',
      value: String(stats.active),
      hint: `${stats.inFulfillment} in fulfillment pipeline`,
      icon: Users,
      tone: 'text-emerald-300',
    },
    {
      label: 'Pending review',
      value: String(stats.pending),
      hint: formatRupee(stats.pendingRevenue) + ' potential revenue',
      icon: Clock,
      tone: stats.pending > 0 ? 'text-amber-200' : 'text-brand-dust',
    },
    {
      label: 'Approved revenue',
      value: formatRupee(stats.approvedRevenue),
      hint: dateRange ? 'In selected period' : 'Sum of approved plan totals',
      icon: DollarSign,
      tone: 'text-brand-mist',
    },
    {
      label: dateRange ? 'In period' : 'This month',
      value: dateRange ? String(stats.total) : String(stats.thisMonth),
      hint: dateRange
        ? rangeLabel
        : `${stats.last7Days} in the last 7 days`,
      icon: CalendarDays,
      tone: 'text-brand-dust',
    },
    {
      label: 'Approval rate',
      value: `${stats.approvalRate}%`,
      hint: `${stats.approvedThisMonth} approved this month · ${stats.rejected} rejected`,
      icon: Percent,
      tone: stats.approvalRate >= 50 ? 'text-emerald-300' : 'text-brand-dust',
    },
    {
      label: 'In fulfillment',
      value: String(stats.inFulfillment),
      hint: 'Sourcing through delivery',
      icon: XCircle,
      tone: 'text-brand-dust',
    },
  ] as const

  const activePlans = stats.byPlan.filter((item) => item.total > 0)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.35em] text-brand-clay">
            Overview
          </p>
          <h1 className="font-display text-3xl font-normal leading-tight tracking-normal text-brand-mist sm:text-4xl lg:text-5xl">
            DASHBOARD
          </h1>
          <div className="h-px w-12 bg-brand-clay" aria-hidden />
          <p className="max-w-2xl text-sm leading-relaxed text-brand-dust sm:text-base">
            Live subscription applications. Filter by date range, status, or plan,
            and verify payments directly from this table.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="inline-flex items-center gap-2 self-start border border-brand-earth/60 bg-brand-void/40 px-3 py-2 text-xs text-brand-dust sm:self-auto">
              Loading dates…
            </div>
          }
        >
          <DashboardDateRangePicker />
        </Suspense>
      </header>

      <section aria-label="Key metrics" className="mb-10">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 lg:gap-5">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <li
                key={stat.label}
                className="group relative flex flex-col gap-4 border border-brand-earth/60 bg-brand-void/40 p-5 transition-colors duration-200 hover:border-brand-clay/70"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.65rem] font-medium uppercase tracking-[0.25em] text-brand-earth">
                    {stat.label}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-earth/30 text-brand-clay transition-colors group-hover:bg-brand-earth/50">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
                <p className="font-display text-3xl font-normal leading-none tracking-normal text-brand-mist">
                  {stat.value}
                </p>
                <p className={cn('inline-flex items-center gap-1 text-xs', stat.tone)}>
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{stat.hint}</span>
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      {activePlans.length > 0 ? (
        <section aria-label="Plan breakdown" className="mb-10">
          <h2 className="font-display mb-4 text-sm font-medium uppercase tracking-[0.25em] text-brand-clay">
            By plan
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activePlans.map((planStats) => (
              <li
                key={planStats.planId}
                className="border border-brand-earth/60 bg-brand-void/40 p-4"
              >
                <Link
                  href={buildAdminFilterHref('/admin', {
                    status: statusFilter,
                    plan: planStats.planId,
                    from: fromParam,
                    to: toParam,
                  })}
                  className="group block"
                >
                  <p className="font-display text-sm text-brand-mist group-hover:text-brand-clay">
                    {getPlanLabel(planStats.planId)}
                  </p>
                  <p className="mt-2 text-2xl text-brand-mist">{planStats.total}</p>
                  <p className="mt-1 text-xs text-brand-dust">
                    {planStats.approved} approved · {planStats.pending} pending ·{' '}
                    {planStats.rejected} rejected
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SubscriptionFilters
        basePath="/admin"
        status={statusFilter}
        plan={planFilter}
        stats={stats}
        from={fromParam}
        to={toParam}
      />

      <section
        aria-labelledby="applications-heading"
        className="mt-6 border border-brand-earth/60 bg-brand-void/40"
      >
        <header className="flex flex-col gap-2 border-b border-brand-earth/60 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-clay">
              Activity
            </p>
            <h2
              id="applications-heading"
              className="font-display text-xl font-normal tracking-normal text-brand-mist sm:text-2xl"
            >
              APPLICATIONS
            </h2>
          </div>
          <p className="text-xs uppercase tracking-wider text-brand-earth">
            {applications.length}{' '}
            {applications.length === 1 ? 'result' : 'results'}
            {dateRange ? ` · ${rangeLabel}` : ''}
          </p>
        </header>

        {applications.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-brand-dust">
            No applications match the current filters.
          </p>
        ) : (
          <div className="scrollbar-brand overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-earth/40 text-[0.65rem] uppercase tracking-[0.2em] text-brand-earth">
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                    Submitted
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                    Subscriber
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                    Plan
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-earth/30">
                {applications.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors duration-150 hover:bg-brand-earth/10"
                  >
                    <td className="px-5 py-4 text-brand-earth sm:px-6">
                      <time dateTime={row.created_at}>
                        {format(new Date(row.created_at), 'MMM d, yyyy')}
                      </time>
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <Link
                        href={`/admin/subscribers/${row.id}`}
                        className="text-brand-mist hover:text-brand-clay"
                      >
                        {row.full_name}
                      </Link>
                      <p className="mt-0.5 text-xs text-brand-dust">{row.email}</p>
                    </td>
                    <td className="px-5 py-4 text-brand-dust sm:px-6">
                      {getPlanLabel(row.plan_id)}
                      <p className="mt-0.5 text-xs text-brand-earth">
                        {formatPlanPrice(row.plan_id)}
                      </p>
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <SubscriptionStatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <SubscriptionReviewActions
                        id={row.id}
                        status={row.status}
                        compact
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {stats.pending > 0 ? (
        <p className="mt-8 text-sm text-amber-200">
          {stats.pending} application{stats.pending === 1 ? '' : 's'} awaiting review.{' '}
          <Link
            href={buildAdminFilterHref('/admin', {
              status: 'pending',
              plan: planFilter,
              from: fromParam,
              to: toParam,
            })}
            className="underline hover:text-amber-100"
          >
            Show pending only
          </Link>
        </p>
      ) : null}
    </div>
  )
}
