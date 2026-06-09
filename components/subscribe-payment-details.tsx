import { paymentMethods } from '@/lib/subscribe-data'

export default function SubscribePaymentDetails() {
  return (
    <aside
      aria-labelledby="payment-details-heading"
      className="rounded-lg border border-brand-earth/10 border-l-4 border-l-brand-clay bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10"
    >
      <h2
        id="payment-details-heading"
        className="font-display text-2xl font-medium tracking-wide text-brand-void sm:text-3xl"
      >
        Payment Details
      </h2>
      <p className="mt-3 text-base leading-relaxed text-brand-earth sm:text-lg">
        Once payment is made, upload a screenshot below. Your subscription will be
        confirmed shortly after verification.
      </p>

      <ul className="mt-7 grid gap-5 sm:grid-cols-2">
        {paymentMethods.map((method) => (
          <li
            key={method.id}
            className="rounded-sm border border-brand-earth/10 bg-brand-mist/25 px-5 py-5"
          >
            <p className="font-display text-xs font-semibold tracking-widest text-brand-clay uppercase sm:text-sm">
              {method.name}
            </p>
            <p className="mt-2.5 text-base text-brand-void sm:text-[1.05rem]">
              <span className="text-brand-earth">Title:</span> {method.accountTitle}
            </p>
            <p className="mt-1.5 text-base text-brand-void sm:text-[1.05rem]">
              <span className="text-brand-earth">Number:</span>{' '}
              <span className="font-medium">{method.accountNumber}</span>
            </p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
