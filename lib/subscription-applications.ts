import { formatRupee, getPlanMonths, subscriptionPlans } from '@/lib/pricing-data'

export const signupStatuses = ['pending', 'rejected'] as const

export const fulfillmentStatuses = ['accepted', 'completed'] as const

export const subscriptionStatuses = [...signupStatuses, ...fulfillmentStatuses] as const

export type SignupStatus = (typeof signupStatuses)[number]
export type FulfillmentStatus = (typeof fulfillmentStatuses)[number]
export type SubscriptionStatus = (typeof subscriptionStatuses)[number]

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
  readonly previous_application_id: string | null
}

export function isSubscriptionStatus(value: string): value is SubscriptionStatus {
  return (subscriptionStatuses as readonly string[]).includes(value)
}

export function isSignupStatus(status: SubscriptionStatus): status is SignupStatus {
  return (signupStatuses as readonly string[]).includes(status)
}

export function isFulfillmentStatus(status: SubscriptionStatus): status is FulfillmentStatus {
  return (fulfillmentStatuses as readonly string[]).includes(status)
}

export function isApprovedSubscription(status: SubscriptionStatus): boolean {
  return isFulfillmentStatus(status)
}

export function isInFulfillmentPipeline(status: SubscriptionStatus): boolean {
  return status === 'accepted'
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

export function formatPlanDuration(planId: string): string {
  const months = getPlanMonths(planId)
  return months === 1 ? '1 month' : `${months} months`
}

export const statusLabels: Record<SubscriptionStatus, string> = {
  pending: 'Pending review',
  rejected: 'Rejected',
  accepted: 'Accepted',
  completed: 'Completed',
}
