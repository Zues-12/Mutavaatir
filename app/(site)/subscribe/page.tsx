import type { Metadata } from 'next'
import Footer from '@/components/footer'
import SubscribePageHero from '@/components/subscribe-page-hero'
import SubscribeForm from '@/components/subscribe-form'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'
import { isValidPlanId } from '@/lib/subscribe-data'

type SearchParams = Promise<{
  plan?: string | string[]
}>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

const subscribeTitle = 'Subscribe — Mutavaatir monthly book subscription'
const subscribeDescription =
  'Sign up for Mutavaatir and receive a curated book every month. Submit your details and payment screenshot to start your subscription.'

export const metadata: Metadata = publicPageMetadata({
  title: subscribeTitle,
  description: subscribeDescription,
  path: '/subscribe',
  extraKeywords: [
    'Mutavaatir subscribe',
    'book subscription signup Pakistan',
    'monthly book delivery form',
  ],
})

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const planParam = firstParam(params.plan)
  const defaultPlan = planParam && isValidPlanId(planParam) ? planParam : undefined

  return (
    <>
      <WebPageJsonLd
        path="/subscribe"
        name={subscribeTitle}
        description={subscribeDescription}
      />
      <SubscribePageHero />
      <section
        aria-labelledby="subscribe-form-heading"
        className="paper-texture bg-brand-mist py-14 sm:py-16 lg:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="subscribe-form-heading" className="sr-only">
            Subscription sign-up form
          </h2>
          <SubscribeForm defaultPlan={defaultPlan} />
        </div>
      </section>
      <Footer />
    </>
  )
}
