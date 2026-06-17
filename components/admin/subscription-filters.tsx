import Link from 'next/link'
import { subscriptionPlans } from '@/lib/pricing-data'
import {
  buildAdminFilterHref,
  type SubscriptionDashboardStats,
} from '@/lib/admin/subscription-queries'
import {
  getPlanLabel,
  statusLabels,
  subscriptionStatuses,
  type SubscriptionStatus,
} from '@/lib/subscription-applications'
import { cn } from '@/lib/utils'

type SubscriptionFiltersProps = {
  basePath: string
  status: SubscriptionStatus | 'all'
  plan: string | 'all'
  stats?: SubscriptionDashboardStats
  from?: string
  to?: string
}

const statusOptions: Array<{ value: SubscriptionStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  ...subscriptionStatuses.map((status) => ({
    value: status,
    label: statusLabels[status],
  })),
]

function statusCount(
  stats: SubscriptionDashboardStats | undefined,
  status: SubscriptionStatus | 'all',
): number | null {
  if (!stats) return null
  if (status === 'all') return stats.total
  if (status === 'pending') return stats.pending
  if (status === 'rejected') return stats.rejected
  if (status === 'active') return stats.active
  if (
    status === 'book_searching' ||
    status === 'book_confirmed' ||
    status === 'packaging' ||
    status === 'dispatched' ||
    status === 'delivered'
  ) {
    return null
  }
  return null
}

export default function SubscriptionFilters({
  basePath,
  status,
  plan,
  stats,
  from,
  to,
}: SubscriptionFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {statusOptions.map((option) => {
          const active = status === option.value
          const count = statusCount(stats, option.value)
          const href = buildAdminFilterHref(basePath, {
            status: option.value,
            plan,
            from,
            to,
          })

          return (
            <Link
              key={option.value}
              href={href}
              role="tab"
              aria-selected={active}
              className={cn(
                'font-display border px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors',
                active
                  ? 'border-brand-clay bg-brand-earth/20 text-brand-mist'
                  : 'border-brand-earth/60 text-brand-dust hover:border-brand-clay/70 hover:text-brand-mist',
              )}
            >
              {option.label}
              {count !== null ? ` (${count})` : ''}
            </Link>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by plan">
        <Link
          href={buildAdminFilterHref(basePath, { status, plan: 'all', from, to })}
          role="tab"
          aria-selected={plan === 'all'}
          className={cn(
            'font-display border px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors',
            plan === 'all'
              ? 'border-brand-clay bg-brand-earth/20 text-brand-mist'
              : 'border-brand-earth/60 text-brand-dust hover:border-brand-clay/70 hover:text-brand-mist',
          )}
        >
          All plans
        </Link>
        {subscriptionPlans.map((subscriptionPlan) => {
          const active = plan === subscriptionPlan.id
          const planStats = stats?.byPlan.find((item) => item.planId === subscriptionPlan.id)
          const href = buildAdminFilterHref(basePath, {
            status,
            plan: subscriptionPlan.id,
            from,
            to,
          })

          return (
            <Link
              key={subscriptionPlan.id}
              href={href}
              role="tab"
              aria-selected={active}
              className={cn(
                'font-display border px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors',
                active
                  ? 'border-brand-clay bg-brand-earth/20 text-brand-mist'
                  : 'border-brand-earth/60 text-brand-dust hover:border-brand-clay/70 hover:text-brand-mist',
              )}
            >
              {getPlanLabel(subscriptionPlan.id)}
              {planStats && planStats.total > 0 ? ` (${planStats.total})` : ''}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
