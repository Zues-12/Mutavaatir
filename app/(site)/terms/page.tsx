import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/footer'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'

const termsTitle = 'Terms & Conditions — Mutavaatir'
const termsDescription =
  'Terms and conditions for Mutavaatir monthly book subscriptions, including payment, delivery, and cancellation policies.'

export const metadata: Metadata = publicPageMetadata({
  title: termsTitle,
  description: termsDescription,
  path: '/terms',
})

const sections = [
  {
    title: 'Subscription Service',
    body:
      'Mutavaatir provides a monthly book subscription service. Subscribers receive one curated book per month for the duration of their selected plan.',
  },
  {
    title: 'Payment & Verification',
    body:
      'Payment must be made via the methods listed on the subscribe page. Your subscription is confirmed only after we verify your payment screenshot. Processing may take up to 48 hours.',
  },
  {
    title: 'Delivery',
    body:
      'Books are delivered to the address provided at sign-up. Please ensure your address and delivery notes are accurate. Mutavaatir is not responsible for delays caused by incorrect delivery information.',
  },
  {
    title: 'Book Selection',
    body:
      'Books are selected based on your reading preferences when provided. If no preferences are given, books are chosen at random. We do our best to avoid sending books you have already read when that information is shared.',
  },
  {
    title: 'Cancellations & Refunds',
    body:
      'For multi-month plans, cancellations apply to future renewals only. Refunds are handled on a case-by-case basis for verified payment issues or undelivered orders. Contact us via Instagram or the details on our website.',
  },
  {
    title: 'Contact',
    body:
      'For questions about your subscription, reach out through the suggestions field on the subscribe form or via our Instagram account.',
  },
] as const

export default function TermsPage() {
  return (
    <>
      <WebPageJsonLd path="/terms" name={termsTitle} description={termsDescription} />
      <section className="border-b border-brand-earth/40 bg-brand-void py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl font-medium tracking-wide text-brand-clay sm:text-5xl">
              TERMS &amp; CONDITIONS
            </h1>
            <div className="mx-auto mt-6 h-px w-16 bg-brand-dust/70" aria-hidden />
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-brand-mist">
              Please read these terms before submitting your subscription.
            </p>
          </div>
        </section>

        <section className="bg-brand-mist py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="font-display text-xl font-medium tracking-wide text-brand-void">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-earth sm:text-base">
                  {section.body}
                </p>
              </article>
            ))}

            <p className="pt-4 text-center text-sm text-brand-earth">
              <Link
                href="/subscribe"
                className="font-display uppercase tracking-wider text-brand-void underline decoration-brand-clay/60 underline-offset-4 transition-colors hover:text-brand-clay"
              >
                ← Back to subscribe
              </Link>
            </p>
          </div>
        </section>

      <Footer />
    </>
  )
}
