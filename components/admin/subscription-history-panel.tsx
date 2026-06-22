'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { linkPreviousApplicationAction } from '@/app/admin/subscribers/actions'
import {
  formatPlanDuration,
  formatPlanPrice,
  getPlanLabel,
  type SubscriptionApplication,
} from '@/lib/subscription-applications'
import {
  orderStatusLabels,
  type SubscriptionOrderWithApplication,
} from '@/lib/subscription-orders'
import { cn } from '@/lib/utils'

type SubscriptionHistoryPanelProps = {
  application: SubscriptionApplication
  historyOrders: readonly SubscriptionOrderWithApplication[]
  linkableApplications: readonly SubscriptionApplication[]
}

const sectionClassName = 'border border-brand-earth/60 bg-brand-void/40 p-5'
const labelClassName =
  'font-display text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brand-earth'
const fieldClassName =
  'w-full border border-brand-earth/60 bg-brand-void px-3 py-2 text-sm text-brand-mist outline-none transition-colors focus:border-brand-clay'

export default function SubscriptionHistoryPanel({
  application,
  historyOrders,
  linkableApplications,
}: SubscriptionHistoryPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  )

  const runLink = (previousApplicationId: string | null, successText: string) => {
    setMessage(null)
    startTransition(async () => {
      const result = await linkPreviousApplicationAction(
        application.id,
        previousApplicationId,
      )
      if (result.ok) {
        setMessage({ type: 'success', text: successText })
        router.refresh()
        return
      }
      setMessage({ type: 'error', text: result.error ?? 'Something went wrong.' })
    })
  }

  return (
    <section className={cn(sectionClassName, 'mb-8')}>
      <header className="mb-5">
        <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-clay">
          Subscriber history
        </p>
        <h2 className="font-display text-xl font-normal tracking-normal text-brand-mist">
          PREVIOUS ORDERS
        </h2>
        <p className="mt-1 text-sm text-brand-dust">
          Link this subscription to a prior one to show past orders for the same subscriber.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2">
          <span className={labelClassName}>Link to previous subscription</span>
          <select
            className={fieldClassName}
            defaultValue={application.previous_application_id ?? ''}
            disabled={pending}
            onChange={(event) => {
              const value = event.target.value
              runLink(
                value || null,
                value ? 'Linked to previous subscription.' : 'Previous link removed.',
              )
            }}
          >
            <option value="">None</option>
            {linkableApplications.map((item) => (
              <option key={item.id} value={item.id}>
                {format(new Date(item.created_at), 'MMM d, yyyy')} —{' '}
                {getPlanLabel(item.plan_id)} ({formatPlanDuration(item.plan_id)})
              </option>
            ))}
          </select>
        </label>
      </div>

      {message ? (
        <p
          role="status"
          className={cn(
            'mb-4 text-sm',
            message.type === 'error' ? 'text-red-300' : 'text-emerald-300',
          )}
        >
          {message.text}
        </p>
      ) : null}

      {historyOrders.length === 0 ? (
        <p className="text-sm text-brand-dust">
          {application.previous_application_id
            ? 'No orders found on linked subscriptions.'
            : 'No linked history yet. Select a previous subscription above, or it will auto-link when the subscriber had a prior delivery.'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {historyOrders.map((order) => (
            <article
              key={order.id}
              className="border border-brand-earth/40 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-brand-mist">
                    Month {order.month_number} · {orderStatusLabels[order.status]}
                  </p>
                  <p className="mt-1 text-xs text-brand-dust">
                    {order.application.full_name} ·{' '}
                    {format(new Date(order.application.created_at), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-brand-earth">
                    {getPlanLabel(order.application.plan_id)} ·{' '}
                    {formatPlanPrice(order.application.plan_id)}
                  </p>
                </div>
                <Link
                  href={`/admin/subscribers/${order.application.id}`}
                  className="text-xs uppercase tracking-wider text-brand-clay hover:text-brand-mist"
                >
                  View subscription
                </Link>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {order.old_read ? (
                  <div>
                    <dt className={labelClassName}>Old read</dt>
                    <dd className="mt-1 text-sm whitespace-pre-wrap text-brand-dust">
                      {order.old_read}
                    </dd>
                  </div>
                ) : null}
                {order.options ? (
                  <div>
                    <dt className={labelClassName}>Options</dt>
                    <dd className="mt-1 text-sm whitespace-pre-wrap text-brand-dust">
                      {order.options}
                    </dd>
                  </div>
                ) : null}
                {order.sent_book ? (
                  <div>
                    <dt className={labelClassName}>Sent book</dt>
                    <dd className="mt-1 text-sm text-brand-mist">{order.sent_book}</dd>
                  </div>
                ) : null}
                {order.tracking_id ? (
                  <div>
                    <dt className={labelClassName}>Tracking ID</dt>
                    <dd className="mt-1 text-sm text-brand-mist">{order.tracking_id}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
