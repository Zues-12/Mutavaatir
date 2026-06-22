import { cn } from '@/lib/utils'
import { statusLabels, type SubscriptionStatus } from '@/lib/subscription-applications'

const statusToneMap: Record<SubscriptionStatus, string> = {
  pending: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  rejected: 'border-red-500/40 bg-red-500/10 text-red-300',
  accepted: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
  completed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
}

type SubscriptionStatusBadgeProps = {
  status: SubscriptionStatus
  className?: string
}

export default function SubscriptionStatusBadge({
  status,
  className,
}: SubscriptionStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider',
        statusToneMap[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
