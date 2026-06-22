export const recommendOptions = ['yes', 'no', 'maybe'] as const

export type RecommendOption = (typeof recommendOptions)[number]

export const reviewSources = ['verified_form', 'legacy_import'] as const

export type ReviewSource = (typeof reviewSources)[number]

export type Review = {
  readonly id: string
  readonly created_at: string
  readonly order_id: string | null
  readonly tracking_id: string
  readonly rating: number
  readonly feedback: string
  readonly would_recommend: RecommendOption
  readonly display_name: string | null
  readonly comments: string | null
  readonly submitter_email: string | null
  readonly source: ReviewSource
  readonly published: boolean
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
