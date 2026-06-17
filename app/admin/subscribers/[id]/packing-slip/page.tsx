import type { Metadata } from 'next'
import PrintButton from '@/components/admin/print-button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { getSubscriptionApplication } from '@/lib/admin/subscription-queries'
import { formatPlanPrice, getPlanLabel } from '@/lib/subscription-applications'

export const metadata: Metadata = {
  title: 'Packing slip',
  robots: { index: false, follow: false },
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PackingSlipPage({ params }: PageProps) {
  const { id } = await params
  const application = await getSubscriptionApplication(id)

  if (!application) {
    notFound()
  }

  if (
    application.status !== 'packaging' &&
    application.status !== 'dispatched' &&
    application.status !== 'delivered' &&
    application.status !== 'active'
  ) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-black print:p-6">
      <div className="mb-8 flex items-start justify-between border-b border-black/20 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">Mutavaatir</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-wide">PACKING SLIP</h1>
        </div>
        <p className="text-sm text-black/70">
          {format(new Date(), 'MMM d, yyyy')}
        </p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-black/60">
            Ship to
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            {application.full_name}
            <br />
            {application.address}
            <br />
            {application.phone}
          </p>
          {application.delivery_notes ? (
            <p className="mt-3 text-sm text-black/70">
              <span className="font-medium">Notes:</span> {application.delivery_notes}
            </p>
          ) : null}
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-black/60">
            Order
          </h2>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-black/60">Package ID</dt>
              <dd>{application.package_id ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-black/60">Plan</dt>
              <dd>{getPlanLabel(application.plan_id)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-black/60">Price</dt>
              <dd>{formatPlanPrice(application.plan_id)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mb-8 border border-black/15 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-black/60">
          Contents
        </h2>
        <p className="mt-2 text-lg font-medium">
          {application.book_title ?? 'Book title pending'}
        </p>
        {application.book_author ? (
          <p className="text-sm text-black/70">by {application.book_author}</p>
        ) : null}
        {application.book_notes ? (
          <p className="mt-2 text-sm text-black/70">{application.book_notes}</p>
        ) : null}
      </section>

      <p className="text-xs text-black/50">
        Subscription ref: {application.id}
      </p>

      <div className="mt-8 flex gap-4 print:hidden">
        <PrintButton />
        <Link
          href={`/admin/subscribers/${application.id}`}
          className="px-4 py-2 text-sm uppercase tracking-wider text-black/70"
        >
          Back to subscriber
        </Link>
      </div>
    </div>
  )
}
