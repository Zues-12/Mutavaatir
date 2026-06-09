import { formatRupee, subscriptionPlans } from '@/lib/pricing-data'

export const paymentMethods = [
  {
    id: 'nayapay',
    name: 'Nayapay',
    accountTitle: 'Zunair Saeed',
    accountNumber: '03164104567',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    accountTitle: 'Zunair Syed',
    accountNumber: '03164104567',
  },
] as const

export const subscriptionPlanOptions = subscriptionPlans.map((plan) => ({
  id: plan.id,
  label:
    plan.id === 'monthly'
      ? `Monthly – ${formatRupee(plan.pricePerMonth)}`
      : plan.total
        ? `${plan.name.replace(' Subscription', '')} – ${formatRupee(plan.total)}`
        : plan.name,
}))

export const validPlanIds = subscriptionPlans.map((plan) => plan.id)

export function isValidPlanId(value: string): value is (typeof validPlanIds)[number] {
  return (validPlanIds as readonly string[]).includes(value)
}
