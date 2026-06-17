import { cn } from '@/lib/utils'
import {
  statusLabels,
  type SubscriptionStatus,
} from '@/lib/subscription-applications'

const statusToneMap: Record<SubscriptionStatus, string> = {
  pending: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  rejected: 'border-red-500/40 bg-red-500/10 text-red-300',
  book_searching: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
  book_confirmed: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200',
  packaging: 'border-violet-500/40 bg-violet-500/10 text-violet-200',
  dispatched: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
  delivered: 'border-teal-500/40 bg-teal-500/10 text-teal-200',
  active: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
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
