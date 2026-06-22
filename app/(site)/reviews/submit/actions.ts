'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { isRecommendOption } from '@/lib/reviews'
import type { ReviewSubmitState } from './types'

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim()
  return text || null
}

export async function submitReviewAction(
  _prev: ReviewSubmitState,
  formData: FormData,
): Promise<ReviewSubmitState> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error:
        'Reviews are temporarily unavailable. Please try again later or contact Mutavaatir.',
    }
  }

  const trackingId = String(formData.get('review_code') ?? '').trim()
  const ratingRaw = String(formData.get('rating') ?? '').trim()
  const feedback = String(formData.get('feedback') ?? '').trim()
  const wouldRecommend = String(formData.get('would_recommend') ?? '').trim()
  const displayName = optionalText(formData.get('display_name'))
  const comments = optionalText(formData.get('comments'))

  if (!trackingId) {
    return { ok: false, error: 'Please enter your review code.' }
  }

  const rating = Number(ratingRaw)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Please select a rating from 1 to 5 stars.' }
  }

  if (!feedback) {
    return { ok: false, error: 'Please share your feedback about your experience.' }
  }

  if (!isRecommendOption(wouldRecommend)) {
    return { ok: false, error: 'Please tell us whether you would recommend Mutavaatir.' }
  }

  const supabase = await createSupabaseServerClient()

  const { data: order, error: orderError } = await supabase
    .from('subscription_orders')
    .select('id, tracking_id, status, application_id')
    .eq('tracking_id', trackingId)
    .maybeSingle()

  if (orderError) {
    console.error('submitReviewAction order lookup', orderError)
    return { ok: false, error: 'Could not verify your review code. Please try again.' }
  }

  if (!order) {
    return {
      ok: false,
      error: 'This review code was not found. Check the parcel number we sent you.',
    }
  }

  const { data: application, error: applicationError } = await supabase
    .from('subscription_applications')
    .select('status')
    .eq('id', order.application_id)
    .maybeSingle()

  if (applicationError || !application) {
    return { ok: false, error: 'This review code is not valid for submission.' }
  }

  if (application.status !== 'accepted' && application.status !== 'completed') {
    return { ok: false, error: 'This review code is not valid for submission.' }
  }

  if (order.status === 'pending') {
    return {
      ok: false,
      error: 'Your parcel has not been dispatched yet. Submit a review after you receive your book.',
    }
  }

  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('order_id', order.id)
    .maybeSingle()

  if (existingReview) {
    return {
      ok: false,
      error: 'A review has already been submitted for this parcel.',
    }
  }

  const { error: insertError } = await supabase.from('reviews').insert({
    order_id: order.id,
    tracking_id: trackingId,
    rating,
    feedback,
    would_recommend: wouldRecommend,
    display_name: displayName,
    comments,
  })

  if (insertError) {
    console.error('submitReviewAction insert', insertError)
    return { ok: false, error: 'Could not save your review. Please try again.' }
  }

  return { ok: true, success: true }
}
