'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  activateSubscriptionAction,
  confirmBookAction,
  markDeliveredAction,
  markDispatchedAction,
  resumeBookSearchAction,
  savePackageIdAction,
  setSourcingResultAction,
  startPackagingAction,
} from '@/app/admin/subscribers/actions'
import { OriginButton, originCircleColors } from '@/components/origin-button'
import {
  courierOptions,
  sourcingResultLabels,
  sourcingResults,
  type SubscriptionApplication,
  type SourcingResult,
} from '@/lib/subscription-applications'
import { cn } from '@/lib/utils'

type SubscriptionWorkflowPanelProps = {
  application: SubscriptionApplication
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

function ActionButton({
  children,
  disabled,
  onClick,
  tone = 'default',
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
  tone?: 'default' | 'primary' | 'danger'
}) {
  const toneClass =
    tone === 'primary'
      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400'
      : tone === 'danger'
        ? 'border-red-500/50 bg-red-500/10 text-red-200 hover:border-red-400'
        : 'border-brand-earth/60 text-brand-dust hover:border-brand-clay hover:text-brand-mist'

  return (
    <OriginButton
      type="button"
      disabled={disabled}
      circleColor={originCircleColors.mist}
      onClick={onClick}
      className={cn(
        'font-display inline-flex items-center gap-1.5 border px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors disabled:opacity-50',
        toneClass,
      )}
    >
      {children}
    </OriginButton>
  )
}

export default function SubscriptionWorkflowPanel({
  application,
}: SubscriptionWorkflowPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  )

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

  if (application.status === 'pending' || application.status === 'rejected') {
    return null
  }

  return (
    <section className={cn(sectionClassName, 'mb-8')}>
      <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-clay">
            Operations
          </p>
          <h2 className="font-display text-xl font-normal tracking-normal text-brand-mist">
            WORKFLOW
          </h2>
        </div>
        <WorkflowMessage message={message} />
      </header>

      {application.status === 'book_searching' ? (
        <BookSearchingSection
          application={application}
          pending={pending}
          onSourcing={(result) =>
            run(
              () => setSourcingResultAction(application.id, result, null),
              `Marked as ${sourcingResultLabels[result].toLowerCase()}.`,
            )
          }
          onConfirm={(form) =>
            runForm((data) => confirmBookAction(application.id, data), form, 'Book confirmed.')
          }
          onResume={() =>
            run(() => resumeBookSearchAction(application.id), 'Resumed book search.')
          }
        />
      ) : null}

      {application.status === 'book_confirmed' ? (
        <div className="flex flex-col gap-4">
          <ConfirmedBookSummary application={application} />
          <ActionButton
            disabled={pending}
            tone="primary"
            onClick={() =>
              run(() => startPackagingAction(application.id), 'Moved to packaging.')
            }
          >
            Start packaging
          </ActionButton>
        </div>
      ) : null}

      {application.status === 'packaging' ? (
        <PackagingSection
          application={application}
          pending={pending}
          onSavePackage={(form) =>
            runForm(
              (data) => savePackageIdAction(application.id, data),
              form,
              'Package ID saved.',
            )
          }
          onDispatch={(form) =>
            runForm(
              (data) => markDispatchedAction(application.id, data),
              form,
              'Marked as dispatched.',
            )
          }
        />
      ) : null}

      {application.status === 'dispatched' ? (
        <DispatchedSection
          application={application}
          pending={pending}
          onDelivered={() =>
            run(() => markDeliveredAction(application.id), 'Marked as delivered.')
          }
        />
      ) : null}

      {application.status === 'delivered' ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-brand-dust">
            Delivery recorded
            {application.delivered_at
              ? ` on ${format(new Date(application.delivered_at), 'MMM d, yyyy')}`
              : ''}
            . Activate the subscription to mark it ongoing.
          </p>
          <ActionButton
            disabled={pending}
            tone="primary"
            onClick={() =>
              run(() => activateSubscriptionAction(application.id), 'Subscription is now active.')
            }
          >
            Activate subscription
          </ActionButton>
        </div>
      ) : null}

      {application.status === 'active' ? (
        <p className="text-sm text-emerald-300">
          This subscription is active and ongoing. Renewal and pause controls will be added in a
          later phase.
        </p>
      ) : null}
    </section>
  )
}

function ConfirmedBookSummary({ application }: { application: SubscriptionApplication }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      <div>
        <dt className={labelClassName}>Book</dt>
        <dd className="mt-1 text-sm text-brand-mist">{application.book_title}</dd>
      </div>
      {application.book_author ? (
        <div>
          <dt className={labelClassName}>Author</dt>
          <dd className="mt-1 text-sm text-brand-mist">{application.book_author}</dd>
        </div>
      ) : null}
      {application.book_notes ? (
        <div className="sm:col-span-2">
          <dt className={labelClassName}>Notes</dt>
          <dd className="mt-1 text-sm text-brand-dust">{application.book_notes}</dd>
        </div>
      ) : null}
    </dl>
  )
}

function BookSearchingSection({
  application,
  pending,
  onSourcing,
  onConfirm,
  onResume,
}: {
  application: SubscriptionApplication
  pending: boolean
  onSourcing: (result: SourcingResult) => void
  onConfirm: (form: HTMLFormElement) => void
  onResume: () => void
}) {
  const canConfirm =
    application.sourcing_result === 'found' ||
    application.sourcing_result === 'alternative_suggested'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm text-brand-dust">
          Use the subscriber&apos;s preferences and past reads below to source a book. Mark an
          outcome, then confirm the selected title.
        </p>
        <div className="flex flex-wrap gap-2">
          {sourcingResults.map((result) => (
            <ActionButton
              key={result}
              disabled={pending}
              tone={application.sourcing_result === result ? 'primary' : 'default'}
              onClick={() => onSourcing(result)}
            >
              {sourcingResultLabels[result]}
            </ActionButton>
          ))}
        </div>
        {application.sourcing_result ? (
          <p className="mt-2 text-xs text-brand-earth">
            Current outcome: {sourcingResultLabels[application.sourcing_result]}
          </p>
        ) : null}
      </div>

      {application.sourcing_result === 'not_available' ? (
        <ActionButton disabled={pending} onClick={onResume}>
          Resume searching
        </ActionButton>
      ) : null}

      {canConfirm ? (
        <form
          className="grid gap-4 border border-brand-earth/40 p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onConfirm(event.currentTarget)
          }}
        >
          <p className="font-display text-sm text-brand-mist">Confirm selected book</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={labelClassName}>Title</span>
              <input
                name="book_title"
                required
                defaultValue={application.book_title ?? ''}
                className={fieldClassName}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className={labelClassName}>Author</span>
              <input
                name="book_author"
                defaultValue={application.book_author ?? ''}
                className={fieldClassName}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span className={labelClassName}>Notes</span>
            <textarea
              name="book_notes"
              rows={3}
              defaultValue={application.book_notes ?? ''}
              className={fieldClassName}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="font-display inline-flex w-fit items-center border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-200 transition-colors hover:border-emerald-400 disabled:opacity-50"
          >
            Confirm book
          </button>
        </form>
      ) : null}
    </div>
  )
}

function PackagingSection({
  application,
  pending,
  onSavePackage,
  onDispatch,
}: {
  application: SubscriptionApplication
  pending: boolean
  onSavePackage: (form: HTMLFormElement) => void
  onDispatch: (form: HTMLFormElement) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <ConfirmedBookSummary application={application} />

      <form
        className="grid gap-4 border border-brand-earth/40 p-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSavePackage(event.currentTarget)
        }}
      >
        <p className="font-display text-sm text-brand-mist">Package details</p>
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Package ID</span>
          <input
            name="package_id"
            required
            defaultValue={application.package_id ?? ''}
            className={fieldClassName}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={pending}
            className="font-display inline-flex items-center border border-brand-earth/60 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-mist disabled:opacity-50"
          >
            Save package ID
          </button>
          <Link
            href={`/admin/subscribers/${application.id}/packing-slip`}
            target="_blank"
            className="font-display inline-flex items-center border border-brand-earth/60 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-mist"
          >
            Generate packing slip
          </Link>
        </div>
      </form>

      <form
        className="grid gap-4 border border-brand-earth/40 p-4"
        onSubmit={(event) => {
          event.preventDefault()
          onDispatch(event.currentTarget)
        }}
      >
        <p className="font-display text-sm text-brand-mist">Dispatch shipment</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClassName}>Tracking number</span>
            <input
              name="tracking_number"
              required
              defaultValue={application.tracking_number ?? ''}
              className={fieldClassName}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClassName}>Courier</span>
            <select
              name="courier"
              required
              defaultValue={application.courier ?? ''}
              className={fieldClassName}
            >
              <option value="">Select courier</option>
              {courierOptions.map((courier) => (
                <option key={courier} value={courier}>
                  {courier}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Estimated delivery</span>
          <input
            type="date"
            name="estimated_delivery_date"
            defaultValue={application.estimated_delivery_date ?? ''}
            className={fieldClassName}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="font-display inline-flex w-fit items-center border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-200 transition-colors hover:border-emerald-400 disabled:opacity-50"
        >
          Mark dispatched
        </button>
      </form>
    </div>
  )
}

function DispatchedSection({
  application,
  pending,
  onDelivered,
}: {
  application: SubscriptionApplication
  pending: boolean
  onDelivered: () => void
}) {
  const isDelayed =
    application.estimated_delivery_date &&
    new Date(application.estimated_delivery_date) < new Date() &&
    application.status === 'dispatched'

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className={labelClassName}>Tracking</dt>
          <dd className="mt-1 text-sm text-brand-mist">{application.tracking_number}</dd>
        </div>
        <div>
          <dt className={labelClassName}>Courier</dt>
          <dd className="mt-1 text-sm text-brand-mist">{application.courier}</dd>
        </div>
        {application.estimated_delivery_date ? (
          <div>
            <dt className={labelClassName}>Estimated delivery</dt>
            <dd className="mt-1 text-sm text-brand-mist">
              {format(new Date(application.estimated_delivery_date), 'MMM d, yyyy')}
            </dd>
          </div>
        ) : null}
        {application.dispatched_at ? (
          <div>
            <dt className={labelClassName}>Dispatched</dt>
            <dd className="mt-1 text-sm text-brand-mist">
              {format(new Date(application.dispatched_at), 'MMM d, yyyy')}
            </dd>
          </div>
        ) : null}
      </dl>

      {isDelayed ? (
        <p className="text-sm text-amber-200">
          This shipment appears delayed based on the estimated delivery date.
        </p>
      ) : (
        <p className="text-sm text-brand-dust">Shipment is in transit.</p>
      )}

      <ActionButton disabled={pending} tone="primary" onClick={onDelivered}>
        Mark delivered
      </ActionButton>
    </div>
  )
}
