import Link from 'next/link'
import { format } from 'date-fns'
import { Star } from 'lucide-react'
import {
  formatRecommendLabel,
  type DashboardReview,
} from '@/lib/admin/review-queries'
import { getPlanLabel } from '@/lib/subscription-applications'
import { ratingStars } from '@/lib/reviews'
import { cn } from '@/lib/utils'
import ReviewPublishedToggle from '@/components/admin/review-published-toggle'
import ReviewFeaturedToggle from '@/components/admin/review-featured-toggle'

function RecommendBadge({ value }: { value: DashboardReview['would_recommend'] }) {
  const tone =
    value === 'yes'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : value === 'no'
        ? 'border-red-500/40 bg-red-500/10 text-red-300'
        : 'border-amber-500/40 bg-amber-500/10 text-amber-200'

  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider',
        tone,
      )}
    >
      {formatRecommendLabel(value)}
    </span>
  )
}

type AdminReviewsTableProps = {
  reviews: readonly DashboardReview[]
  emptyMessage?: string
}

export default function AdminReviewsTable({
  reviews,
  emptyMessage = 'No verified reviews yet.',
}: AdminReviewsTableProps) {
  if (reviews.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-brand-dust">{emptyMessage}</p>
    )
  }

  return (
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
              Rating
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Feedback
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Recommend
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Code
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Published
            </th>
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Featured
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-earth/30">
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="align-top transition-colors duration-150 hover:bg-brand-earth/10"
            >
              <td className="px-5 py-4 text-brand-earth sm:px-6">
                <time dateTime={review.created_at}>
                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                </time>
                <p className="mt-0.5 text-xs text-brand-earth/80">
                  {format(new Date(review.created_at), 'h:mm a')}
                </p>
              </td>
              <td className="px-5 py-4 sm:px-6">
                {review.order ? (
                  <>
                    <Link
                      href={`/admin/subscribers/${review.order.application.id}`}
                      className="font-medium text-brand-mist hover:text-brand-clay"
                    >
                      {review.display_name ?? review.order.application.full_name}
                    </Link>
                    {review.display_name ? (
                      <p className="mt-0.5 text-xs text-brand-earth">
                        {review.order.application.full_name}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-brand-dust">
                      {review.order.application.email}
                    </p>
                    <p className="text-xs text-brand-earth">
                      {getPlanLabel(review.order.application.plan_id)} · Month{' '}
                      {review.order.month_number}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-brand-mist">
                      {review.display_name ?? review.submitter_email ?? 'Legacy review'}
                    </p>
                    {review.display_name && review.submitter_email ? (
                      <p className="mt-0.5 text-xs text-brand-dust">{review.submitter_email}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-brand-earth">Imported from Google Form</p>
                  </>
                )}
              </td>
              <td className="px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-brand-clay" aria-hidden />
                  <span className="text-brand-mist">{review.rating}/5</span>
                </div>
                <p className="mt-1 text-xs" aria-hidden="true">
                  {ratingStars(review.rating)}
                </p>
              </td>
              <td className="max-w-md px-5 py-4 text-brand-dust sm:px-6">
                <p className="whitespace-pre-wrap leading-relaxed">{review.feedback}</p>
                {review.comments ? (
                  <p className="mt-2 text-xs text-brand-earth">
                    <span className="uppercase tracking-wider">Comments:</span>{' '}
                    {review.comments}
                  </p>
                ) : null}
              </td>
              <td className="px-5 py-4 sm:px-6">
                <RecommendBadge value={review.would_recommend} />
              </td>
              <td className="px-5 py-4 font-mono text-xs text-brand-earth sm:px-6">
                {review.tracking_id}
              </td>
              <td className="px-5 py-4 sm:px-6">
                <ReviewPublishedToggle reviewId={review.id} published={review.published} />
              </td>
              <td className="px-5 py-4 sm:px-6">
                <ReviewFeaturedToggle reviewId={review.id} featured={review.featured} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
