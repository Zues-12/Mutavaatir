import { cn } from '@/lib/utils'
import {
  statusLabels,
  workflowSteps,
  type SubscriptionStatus,
} from '@/lib/subscription-applications'

type SubscriptionWorkflowStepperProps = {
  status: SubscriptionStatus
  className?: string
}

function stepIndex(status: SubscriptionStatus): number {
  const index = workflowSteps.findIndex((step) => step.status === status)
  return index >= 0 ? index : -1
}

export default function SubscriptionWorkflowStepper({
  status,
  className,
}: SubscriptionWorkflowStepperProps) {
  if (status === 'pending' || status === 'rejected') {
    return null
  }

  const currentIndex = stepIndex(status)

  return (
    <ol
      className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6', className)}
      aria-label="Subscription workflow progress"
    >
      {workflowSteps.map((step, index) => {
        const isComplete = currentIndex > index
        const isCurrent = currentIndex === index

        return (
          <li
            key={step.status}
            className={cn(
              'border px-3 py-2 text-center',
              isCurrent
                ? 'border-brand-clay bg-brand-earth/20 text-brand-mist'
                : isComplete
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-brand-earth/50 text-brand-earth',
            )}
          >
            <p className="font-display text-[0.6rem] font-medium uppercase tracking-[0.2em]">
              {step.label}
            </p>
            <p className="mt-1 text-[0.65rem] text-brand-dust">
              {isCurrent ? statusLabels[step.status] : isComplete ? 'Done' : '—'}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
