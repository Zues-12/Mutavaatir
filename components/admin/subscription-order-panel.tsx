'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  markOrderDeliveredAction,
  markOrderInTransitAction,
  saveOrderFieldsAction,
} from '@/app/admin/subscribers/actions'
import { OriginButton, originCircleColors } from '@/components/origin-button'
import { getPlanMonths } from '@/lib/pricing-data'
import {
  getActiveOrder,
  orderStatusLabels,
  type SubscriptionOrder,
} from '@/lib/subscription-orders'
import { cn } from '@/lib/utils'

type SubscriptionOrderPanelProps = {
  planId: string
  orders: readonly SubscriptionOrder[]
}

const fieldClassName =
  'w-full border border-brand-earth/60 bg-brand-void px-3 py-2 text-sm text-brand-mist outline-none transition-colors focus:border-brand-clay'
const labelClassName =
  'font-display text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brand-earth'
const sectionClassName = 'border border-brand-earth/60 bg-brand-void/40 p-5'

function WorkflowMessage({
  message,
}: {
  message: { type: 'error' | 'success'; text: string } | null
}) {
  if (!message) return null
  return (
    <p
      role="status"
      className={cn(
        'text-sm',
        message.type === 'error' ? 'text-red-300' : 'text-emerald-300',
      )}
    >
      {message.text}
    </p>
  )
}

export default function SubscriptionOrderPanel({
  planId,
  orders,
}: SubscriptionOrderPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  )

  const planMonths = getPlanMonths(planId)
  const activeOrder = getActiveOrder(orders)

  const run = (
    action: () => Promise<{ ok: boolean; error?: string }>,
    successText: string,
  ) => {
    setMessage(null)
    startTransition(async () => {
      const result = await action()
      if (result.ok) {
        setMessage({ type: 'success', text: successText })
        router.refresh()
        return
      }
      setMessage({ type: 'error', text: result.error ?? 'Something went wrong.' })
    })
  }

  const runForm = (
    action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>,
    form: HTMLFormElement,
    successText: string,
  ) => {
    setMessage(null)
    const formData = new FormData(form)
    startTransition(async () => {
      const result = await action(formData)
      if (result.ok) {
        setMessage({ type: 'success', text: successText })
        router.refresh()
        return
      }
      setMessage({ type: 'error', text: result.error ?? 'Something went wrong.' })
    })
  }

  if (!activeOrder) {
    return (
      <section className={cn(sectionClassName, 'mb-8')}>
        <p className="text-sm text-brand-dust">No orders yet for this subscription.</p>
      </section>
    )
  }

  const canMarkInTransit = activeOrder.status === 'pending'
  const canMarkDelivered =
    activeOrder.status === 'in_transit' || activeOrder.status === 'pending'

  return (
    <section className={cn(sectionClassName, 'mb-8')}>
      <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-clay">
            Fulfillment
          </p>
          <h2 className="font-display text-xl font-normal tracking-normal text-brand-mist">
            CURRENT ORDER
          </h2>
          <p className="mt-1 text-sm text-brand-dust">
            Month {activeOrder.month_number} of {planMonths} ·{' '}
            {orderStatusLabels[activeOrder.status]}
          </p>
        </div>
        <WorkflowMessage message={message} />
      </header>

      <form
        key={activeOrder.id}
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          runForm(
            (data) => saveOrderFieldsAction(activeOrder.id, data),
            event.currentTarget,
            'Order details saved.',
          )
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClassName}>Old read</span>
            <textarea
              name="old_read"
              rows={3}
              defaultValue={activeOrder.old_read ?? ''}
              placeholder="Optional — set manually"
              className={fieldClassName}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClassName}>Options</span>
            <textarea
              name="options"
              rows={3}
              defaultValue={activeOrder.options ?? ''}
              placeholder="Set manually"
              className={fieldClassName}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Sent book</span>
          <input
            name="sent_book"
            defaultValue={activeOrder.sent_book ?? ''}
            placeholder="Set manually"
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-2 sm:max-w-md">
          <span className={labelClassName}>Tracking ID</span>
          <input
            name="tracking_id"
            defaultValue={activeOrder.tracking_id ?? ''}
            className={fieldClassName}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={pending}
            className="font-display inline-flex items-center border border-brand-earth/60 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-mist disabled:opacity-50"
          >
            Save details
          </button>

          {canMarkInTransit ? (
            <OriginButton
              type="button"
              disabled={pending}
              circleColor={originCircleColors.mist}
              onClick={() =>
                run(
                  () => markOrderInTransitAction(activeOrder.id),
                  'Order marked in transit.',
                )
              }
              className="font-display inline-flex items-center border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-cyan-200 transition-colors hover:border-cyan-400 disabled:opacity-50"
            >
              Mark in transit
            </OriginButton>
          ) : null}

          {canMarkDelivered ? (
            <OriginButton
              type="button"
              disabled={pending}
              circleColor={originCircleColors.mist}
              onClick={() =>
                run(
                  () => markOrderDeliveredAction(activeOrder.id),
                  activeOrder.month_number < planMonths
                    ? 'Delivered. Next month order opened.'
                    : 'Delivered. Subscription completed.',
                )
              }
              className="font-display inline-flex items-center border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-200 transition-colors hover:border-emerald-400 disabled:opacity-50"
            >
              Mark delivered
            </OriginButton>
          ) : null}
        </div>
      </form>

      {orders.length > 1 ? (
        <div className="mt-8 border-t border-brand-earth/40 pt-6">
          <h3 className="font-display mb-4 text-sm font-normal tracking-normal text-brand-mist">
            ALL ORDERS IN THIS SUBSCRIPTION
          </h3>
          <ol className="flex flex-col gap-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className={cn(
                  'border px-4 py-3',
                  order.id === activeOrder.id
                    ? 'border-brand-clay bg-brand-earth/10'
                    : 'border-brand-earth/40',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-brand-mist">
                    Month {order.month_number} · {orderStatusLabels[order.status]}
                  </p>
                  {order.sent_book ? (
                    <p className="text-xs text-brand-dust">{order.sent_book}</p>
                  ) : null}
                </div>
                {order.tracking_id ? (
                  <p className="mt-1 text-xs text-brand-earth">
                    Tracking: {order.tracking_id}
                  </p>
                ) : null}
                {order.delivered_at ? (
                  <p className="mt-1 text-xs text-brand-earth">
                    Delivered {format(new Date(order.delivered_at), 'MMM d, yyyy')}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}
