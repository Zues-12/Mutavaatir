export const recommendOptions = ['yes', 'no', 'maybe'] as const

export type RecommendOption = (typeof recommendOptions)[number]

export type Review = {
  readonly id: string
  readonly created_at: string
  readonly order_id: string
  readonly tracking_id: string
  readonly rating: number
  readonly feedback: string
  readonly would_recommend: RecommendOption
  readonly display_name: string | null
  readonly comments: string | null
}

export const recommendLabels: Record<RecommendOption, string> = {
  yes: 'Yes',
  no: 'No',
  maybe: 'Maybe',
}

export function isRecommendOption(value: string): value is RecommendOption {
  return (recommendOptions as readonly string[]).includes(value)
}

export const ratingOptions = [1, 2, 3, 4, 5] as const

export function ratingStars(rating: number): string {
  return '⭐'.repeat(rating)
}
