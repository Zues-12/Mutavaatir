import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import SubscriptionFilters from '@/components/admin/subscription-filters'
import SubscriptionReviewActions from '@/components/admin/subscription-review-actions'
import SubscriptionStatusBadge from '@/components/admin/subscription-status-badge'
import {
  getSubscriptionDashboardStats,
  listSubscriptionApplications,
  parsePlanFilter,
  parseStatusFilter,
} from '@/lib/admin/subscription-queries'
import { formatPlanPrice, getPlanLabel } from '@/lib/subscription-applications'

export const metadata: Metadata = {
  title: 'Subscribers',
  description: 'Review and verify Mutavaatir subscription applications.',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ status?: string; plan?: string }>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const statusFilter = parseStatusFilter(firstParam(params.status))
  const planFilter = parsePlanFilter(firstParam(params.plan))

  const [stats, applications] = await Promise.all([
    getSubscriptionDashboardStats(),
    listSubscriptionApplications(statusFilter, planFilter),
  ])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.35em] text-brand-clay">
            Subscriptions
          </p>
          <h1 className="font-display text-3xl font-normal leading-tight tracking-normal text-brand-mist sm:text-4xl">
            SUBSCRIBERS
          </h1>
          <div className="h-px w-12 bg-brand-clay" aria-hidden />
          <p className="max-w-2xl text-sm leading-relaxed text-brand-dust sm:text-base">
            Review payment screenshots, verify subscriptions, or reject applications.
          </p>
        </div>
        <p className="text-xs uppercase tracking-wider text-brand-earth">
          {applications.length} {applications.length === 1 ? 'application' : 'applications'}
        </p>
      </header>

      <SubscriptionFilters
        basePath="/admin/subscribers"
        status={statusFilter}
        plan={planFilter}
        stats={stats}
      />

      <section className="mt-6 border border-brand-earth/60 bg-brand-void/40">
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
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition-colors duration-150 hover:bg-brand-earth/10"
                  >
                    <td className="px-5 py-4 text-brand-earth sm:px-6">
                      <time dateTime={application.created_at}>
                        {format(new Date(application.created_at), 'MMM d, yyyy')}
                      </time>
                      <p className="mt-0.5 text-xs text-brand-earth/80">
                        {format(new Date(application.created_at), 'h:mm a')}
                      </p>
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <Link
                        href={`/admin/subscribers/${application.id}`}
                        className="font-medium text-brand-mist hover:text-brand-clay"
                      >
                        {application.full_name}
                      </Link>
                      <p className="mt-0.5 text-xs text-brand-dust">{application.email}</p>
                      <p className="text-xs text-brand-earth">{application.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-brand-dust sm:px-6">
                      <p>{getPlanLabel(application.plan_id)}</p>
                      <p className="mt-0.5 text-xs text-brand-earth">
                        {formatPlanPrice(application.plan_id)}
                      </p>
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <SubscriptionStatusBadge status={application.status} />
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <SubscriptionReviewActions
                        id={application.id}
                        status={application.status}
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
    </div>
  )
}
