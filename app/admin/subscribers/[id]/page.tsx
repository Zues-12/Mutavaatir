import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import SubscriptionReviewActions from '@/components/admin/subscription-review-actions'
import SubscriptionStatusBadge from '@/components/admin/subscription-status-badge'
import SubscriptionWorkflowPanel from '@/components/admin/subscription-workflow-panel'
import SubscriptionWorkflowStepper from '@/components/admin/subscription-workflow-stepper'
import {
  getPaymentScreenshotUrl,
  getSubscriptionApplication,
} from '@/lib/admin/subscription-queries'
import {
  formatPlanPrice,
  getPlanLabel,
  isWorkflowStatus,
  sourcingResultLabels,
} from '@/lib/subscription-applications'

export const metadata: Metadata = {
  title: 'Subscription details',
  robots: { index: false, follow: false },
}

type PageProps = {
  params: Promise<{ id: string }>
}

function DetailField({
  label,
  value,
  multiline = false,
}: {
  label: string
  value: string | null | undefined
  multiline?: boolean
}) {
  if (!value) return null

  return (
    <div className="flex flex-col gap-1.5">
      <dt className="font-display text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brand-earth">
        {label}
      </dt>
      <dd
        className={
          multiline
            ? 'text-sm leading-relaxed whitespace-pre-wrap text-brand-dust'
            : 'text-sm text-brand-mist'
        }
      >
        {value}
      </dd>
    </div>
  )
}

export default async function AdminSubscriberDetailPage({ params }: PageProps) {
  const { id } = await params
  const application = await getSubscriptionApplication(id)

  if (!application) {
    notFound()
  }

  const screenshotUrl = await getPaymentScreenshotUrl(
    application.payment_screenshot_path,
  )

  const showSourcingContext =
    application.status === 'book_searching' || isWorkflowStatus(application.status)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href="/admin/subscribers"
        className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-brand-dust transition-colors hover:text-brand-mist"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to subscribers
      </Link>

      <header className="mb-8 flex flex-col gap-4 border-b border-brand-earth/60 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <SubscriptionStatusBadge status={application.status} />
          <h1 className="font-display text-3xl font-normal tracking-normal text-brand-mist sm:text-4xl">
            {application.full_name}
          </h1>
          <p className="text-sm text-brand-dust">
            Submitted{' '}
            <time dateTime={application.created_at}>
              {format(new Date(application.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </time>
          </p>
          {application.reviewed_at ? (
            <p className="text-xs text-brand-earth">
              Payment verified{' '}
              <time dateTime={application.reviewed_at}>
                {format(new Date(application.reviewed_at), "MMM d, yyyy 'at' h:mm a")}
              </time>
            </p>
          ) : null}
        </div>
        <SubscriptionReviewActions id={application.id} status={application.status} />
      </header>

      {isWorkflowStatus(application.status) ? (
        <SubscriptionWorkflowStepper status={application.status} className="mb-8" />
      ) : null}

      <SubscriptionWorkflowPanel application={application} />

      {showSourcingContext ? (
        <section className="mb-8 border border-brand-earth/60 bg-brand-void/40 p-6">
          <h2 className="font-display mb-4 text-lg font-normal tracking-normal text-brand-mist">
            SOURCING CONTEXT
          </h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            <DetailField
              label="Reading preferences"
              value={application.reading_preferences}
              multiline
            />
            <DetailField label="Books read" value={application.books_read} multiline />
            <DetailField label="Suggestions" value={application.suggestions} multiline />
            <DetailField label="Delivery address" value={application.address} multiline />
            <DetailField label="Delivery notes" value={application.delivery_notes} multiline />
            {application.sourcing_result ? (
              <DetailField
                label="Sourcing outcome"
                value={sourcingResultLabels[application.sourcing_result]}
              />
            ) : null}
          </dl>
        </section>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,20rem)]">
        <section className="border border-brand-earth/60 bg-brand-void/40 p-6">
          <h2 className="font-display mb-6 text-lg font-normal tracking-normal text-brand-mist">
            APPLICATION DETAILS
          </h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            <DetailField label="Email" value={application.email} />
            <DetailField label="Phone" value={application.phone} />
            <DetailField label="Plan" value={getPlanLabel(application.plan_id)} />
            <DetailField label="Price" value={formatPlanPrice(application.plan_id)} />
            <DetailField label="Referral source" value={application.referral_source} />
            <DetailField label="Instagram" value={application.instagram_username} />
          </dl>
        </section>

        <section className="border border-brand-earth/60 bg-brand-void/40 p-6">
          <h2 className="font-display mb-4 text-lg font-normal tracking-normal text-brand-mist">
            PAYMENT SCREENSHOT
          </h2>
          {screenshotUrl ? (
            <a
              href={screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden border border-brand-earth/50"
            >
              <Image
                src={screenshotUrl}
                alt="Payment screenshot"
                width={400}
                height={600}
                className="h-auto w-full object-contain"
                unoptimized
              />
            </a>
          ) : (
            <p className="text-sm text-brand-earth">
              Could not load payment screenshot.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
