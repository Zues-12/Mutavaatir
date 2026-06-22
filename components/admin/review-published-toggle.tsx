'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { setReviewPublishedAction } from '@/app/admin/reviews/actions'
import { cn } from '@/lib/utils'

type ReviewPublishedToggleProps = {
  reviewId: string
  published: boolean
}

export default function ReviewPublishedToggle({ reviewId, published }: ReviewPublishedToggleProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [checked, setChecked] = useState(published)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setChecked(published)
  }, [published])

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <Switch
          id={`review-published-${reviewId}`}
          checked={checked}
          disabled={pending}
          onCheckedChange={(next) => {
            setError(null)
            setChecked(next)
            startTransition(async () => {
              const result = await setReviewPublishedAction(reviewId, next)
              if (!result.ok) {
                setChecked(!next)
                setError(result.error)
                return
              }
              router.refresh()
            })
          }}
          className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-brand-earth/40"
          aria-label={checked ? 'Published on site' : 'Not published on site'}
        />
        <label
          htmlFor={`review-published-${reviewId}`}
          className={cn(
            'text-xs font-medium uppercase tracking-wider',
            checked ? 'text-emerald-300' : 'text-brand-dust',
          )}
        >
          {checked ? 'Published' : 'Draft'}
        </label>
      </div>
      {error ? (
        <p role="alert" className="max-w-40 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
