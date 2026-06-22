'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { setReviewFeaturedAction } from '@/app/admin/reviews/actions'
import { cn } from '@/lib/utils'

type ReviewFeaturedToggleProps = {
  reviewId: string
  featured: boolean
}

export default function ReviewFeaturedToggle({ reviewId, featured }: ReviewFeaturedToggleProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [checked, setChecked] = useState(featured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setChecked(featured)
  }, [featured])

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <Switch
          id={`review-featured-${reviewId}`}
          checked={checked}
          disabled={pending}
          onCheckedChange={(next) => {
            setError(null)
            setChecked(next)
            startTransition(async () => {
              const result = await setReviewFeaturedAction(reviewId, next)
              if (!result.ok) {
                setChecked(!next)
                setError(result.error)
                return
              }
              router.refresh()
            })
          }}
          className="data-[state=checked]:bg-brand-clay data-[state=unchecked]:bg-brand-earth/40"
          aria-label={checked ? 'Featured on homepage' : 'Not featured on homepage'}
        />
        <label
          htmlFor={`review-featured-${reviewId}`}
          className={cn(
            'text-xs font-medium uppercase tracking-wider',
            checked ? 'text-brand-clay' : 'text-brand-dust',
          )}
        >
          {checked ? 'Featured' : 'Hidden'}
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
