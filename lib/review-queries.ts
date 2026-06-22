import { createSupabasePublicClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { ratingOptions, type RecommendOption } from '@/lib/reviews'

export type PublicReview = {
  readonly id: string
  readonly rating: number
  readonly feedback: string
  readonly display_name: string | null
  readonly created_at: string
  readonly would_recommend: RecommendOption
}

export type PublicReviewStats = {
  readonly total: number
  readonly averageRating: number
  readonly counts: Record<(typeof ratingOptions)[number], number>
}

const emptyStats: PublicReviewStats = {
  total: 0,
  averageRating: 0,
  counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}

export async function listPublicReviews(): Promise<PublicReview[]> {
  if (!hasSupabaseEnv()) return []

  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, feedback, display_name, created_at, would_recommend')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data
}

export async function getPublicReviewStats(): Promise<PublicReviewStats> {
  if (!hasSupabaseEnv()) return emptyStats

  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase.from('reviews').select('rating').eq('published', true)

  if (error || !data?.length) return emptyStats

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as PublicReviewStats['counts']
  for (const row of data) {
    const rating = row.rating as (typeof ratingOptions)[number]
    if (rating >= 1 && rating <= 5) counts[rating] += 1
  }

  const total = data.length
  const averageRating =
    Math.round((data.reduce((sum, row) => sum + row.rating, 0) / total) * 10) / 10

  return { total, averageRating, counts }
}
