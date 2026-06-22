export type PricingPlan = {
  id: string
  name: string
  pricePerMonth: number
  total?: number
  savings?: number
  badge?: string
}

export const subscriptionPlans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Subscription',
    pricePerMonth: 1500,
    badge: 'Rs. 1,500 / month',
  },
  {
    id: 'quarterly',
    name: '3-Month Subscription',
    pricePerMonth: 1400,
    total: 4200,
    savings: 300,
    badge: 'Rs. 1,400 / month',
  },
  {
    id: 'biannual',
    name: '6-Month Subscription',
    pricePerMonth: 1300,
    total: 7800,
    savings: 1200,
    badge: 'Rs. 1,300 / month',
  },
  {
    id: 'yearly',
    name: 'Yearly Subscription',
    pricePerMonth: 1200,
    total: 14400,
    savings: 3600,
    badge: 'Rs. 1,200 / month',
  },
]

export const subscriptionIncludes = [
  '1 curated book per month',
  'Bookmarks',
  'Packaged and delivered to your doorstep',
] as const

export function formatRupee(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

const planMonths: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  biannual: 6,
  yearly: 12,
}

export function getPlanMonths(planId: string): number {
  return planMonths[planId] ?? 1
}
