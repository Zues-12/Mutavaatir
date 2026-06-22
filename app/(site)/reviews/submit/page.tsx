import type { Metadata } from 'next'
import Footer from '@/components/footer'
import ReviewForm from '@/components/review-form'
import ReviewsPageHero from '@/components/reviews-page-hero'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { publicPageMetadata } from '@/lib/seo'

type SearchParams = Promise<{
  code?: string | string[]
}>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

const reviewTitle = 'Verified Review — Mutavaatir'
const reviewDescription =
  'Submit a verified review for your Mutavaatir monthly book subscription using your unique parcel code.'

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: reviewTitle,
    description: reviewDescription,
    path: '/reviews/submit',
    extraKeywords: ['Mutavaatir review', 'verified subscriber review'],
  }),
  robots: { index: false, follow: false },
}

export default async function ReviewSubmitPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const code = firstParam(params.code)?.trim()

  return (
    <>
      <WebPageJsonLd path="/reviews/submit" name={reviewTitle} description={reviewDescription} />
      <ReviewsPageHero
        title="SHARE YOUR EXPERIENCE"
        description="Only verified Mutavaatir subscribers can submit this form using their unique code."
      />
      <section
        aria-labelledby="review-form-heading"
        className="paper-texture bg-brand-mist py-14 sm:py-16 lg:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="review-form-heading" className="sr-only">
            Verified review form
          </h2>
          <ReviewForm defaultCode={code} />
        </div>
      </section>
      <Footer />
    </>
  )
}
