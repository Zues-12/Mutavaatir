import { formatRupee, subscriptionPlans } from '@/lib/pricing-data'

export const signupStatuses = ['pending', 'rejected'] as const

export const workflowStatuses = [
  'book_searching',
  'book_confirmed',
  'packaging',
  'dispatched',
  'delivered',
  'active',
] as const

export const subscriptionStatuses = [...signupStatuses, ...workflowStatuses] as const

export type SignupStatus = (typeof signupStatuses)[number]
export type WorkflowStatus = (typeof workflowStatuses)[number]
export type SubscriptionStatus = (typeof subscriptionStatuses)[number]

export const sourcingResults = ['found', 'not_available', 'alternative_suggested'] as const
export type SourcingResult = (typeof sourcingResults)[number]

export type SubscriptionApplication = {
  readonly id: string
  readonly created_at: string
  readonly status: SubscriptionStatus
  readonly email: string
  readonly full_name: string
  readonly phone: string
  readonly address: string
  readonly delivery_notes: string | null
  readonly plan_id: string
  readonly reading_preferences: string | null
  readonly books_read: string | null
  readonly referral_source: string | null
  readonly instagram_username: string | null
  readonly suggestions: string | null
  readonly payment_screenshot_path: string
  readonly terms_accepted: boolean
  readonly reviewed_at: string | null
  readonly reviewed_by: string | null
  readonly sourcing_result: SourcingResult | null
  readonly sourcing_notes: string | null
  readonly book_title: string | null
  readonly book_author: string | null
  readonly book_notes: string | null
  readonly package_id: string | null
  readonly tracking_number: string | null
  readonly courier: string | null
  readonly estimated_delivery_date: string | null
  readonly dispatched_at: string | null
  readonly delivered_at: string | null
  readonly workflow_updated_at: string | null
}

export function isSubscriptionStatus(value: string): value is SubscriptionStatus {
  return (subscriptionStatuses as readonly string[]).includes(value)
}

export function isSourcingResult(value: string): value is SourcingResult {
  return (sourcingResults as readonly string[]).includes(value)
}

export function isSignupStatus(status: SubscriptionStatus): status is SignupStatus {
  return (signupStatuses as readonly string[]).includes(status)
}

export function isWorkflowStatus(status: SubscriptionStatus): status is WorkflowStatus {
  return (workflowStatuses as readonly string[]).includes(status)
}

export function isInFulfillmentPipeline(status: SubscriptionStatus): boolean {
  return (
    status === 'book_searching' ||
    status === 'book_confirmed' ||
    status === 'packaging' ||
    status === 'dispatched' ||
    status === 'delivered'
  )
}

export function isApprovedSubscription(status: SubscriptionStatus): boolean {
  return isWorkflowStatus(status)
}

export function getPlanLabel(planId: string): string {
  const plan = subscriptionPlans.find((item) => item.id === planId)
  if (!plan) return planId
  return plan.name.replace(' Subscription', '')
}

export function getPlanAmount(planId: string): number {
  const plan = subscriptionPlans.find((item) => item.id === planId)
  if (!plan) return 0
  return plan.total ?? plan.pricePerMonth
}

export function formatPlanPrice(planId: string): string {
  const plan = subscriptionPlans.find((item) => item.id === planId)
  if (!plan) return '—'
  if (plan.total) {
    return `${formatRupee(plan.total)} total (${formatRupee(plan.pricePerMonth)}/mo)`
  }
  return `${formatRupee(plan.pricePerMonth)}/month`
}

export const statusLabels: Record<SubscriptionStatus, string> = {
  pending: 'Pending review',
  rejected: 'Rejected',
  book_searching: 'Book searching',
  book_confirmed: 'Book confirmed',
  packaging: 'Packaging',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  active: 'Active',
}

export const sourcingResultLabels: Record<SourcingResult, string> = {
  found: 'Found',
  not_available: 'Not available',
  alternative_suggested: 'Alternative suggested',
}

export const courierOptions = ['TCS', 'Leopards', 'PostEx', 'M&P', 'Other'] as const

export const workflowSteps: ReadonlyArray<{
  readonly status: WorkflowStatus
  readonly label: string
}> = [
  { status: 'book_searching', label: 'Sourcing' },
  { status: 'book_confirmed', label: 'Confirmed' },
  { status: 'packaging', label: 'Packaging' },
  { status: 'dispatched', label: 'Dispatched' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'active', label: 'Active' },
]
