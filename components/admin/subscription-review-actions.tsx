'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, RotateCcw, X } from 'lucide-react'
import { OriginButton, originCircleColors } from '@/components/origin-button'
import { cn } from '@/lib/utils'
import {
  markSubscriptionPendingAction,
  updateSubscriptionStatusAction,
} from '@/app/admin/subscribers/actions'
import { isSignupStatus, type SubscriptionStatus } from '@/lib/subscription-applications'

type SubscriptionReviewActionsProps = {
  id: string
  status: SubscriptionStatus
  compact?: boolean
  className?: string
}

export default function SubscriptionReviewActions({
  id,
  status,
  compact = false,
  className,
}: SubscriptionReviewActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  )

  if (!isSignupStatus(status)) {
    return null
  }

  const run = (action: () => Promise<{ ok: boolean; error?: string }>, successText: string) => {
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

  const buttonClass = cn(
    'font-display inline-flex items-center gap-1.5 border px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors disabled:opacity-50',
    compact && 'px-2 py-1',
  )

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {status === 'pending' ? (
          <OriginButton
            type="button"
            disabled={pending}
            circleColor={originCircleColors.mist}
            onClick={() =>
              run(
                () => updateSubscriptionStatusAction(id, 'book_searching'),
                'Payment verified. Book sourcing started.',
              )
            }
            className={cn(
              buttonClass,
              'border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400 hover:text-emerald-100',
            )}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Verify
          </OriginButton>
        ) : null}

        {status !== 'rejected' ? (
          <OriginButton
            type="button"
            disabled={pending}
            circleColor={originCircleColors.mist}
            onClick={() =>
              run(() => updateSubscriptionStatusAction(id, 'rejected'), 'Application rejected.')
            }
            className={cn(
              buttonClass,
              'border-red-500/50 bg-red-500/10 text-red-200 hover:border-red-400 hover:text-red-100',
            )}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Reject
          </OriginButton>
        ) : null}

        {status === 'rejected' ? (
          <OriginButton
            type="button"
            disabled={pending}
            circleColor={originCircleColors.mist}
            onClick={() => run(() => markSubscriptionPendingAction(id), 'Marked as pending.')}
            className={cn(
              buttonClass,
              'border-brand-earth/60 bg-transparent text-brand-dust hover:border-brand-clay hover:text-brand-mist',
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            {compact ? 'Reset' : 'Mark pending'}
          </OriginButton>
        ) : null}
      </div>

      {message ? (
        <p
          role="status"
          className={cn(
            'text-xs',
            message.type === 'error' ? 'text-red-300' : 'text-emerald-300',
            compact && 'max-w-56',
          )}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  )
}
