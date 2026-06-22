'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/env'
import { isValidPlanId } from '@/lib/subscribe-data'
import type { SubscribeState } from './types'

const PAYMENT_BUCKET = 'payment-screenshots'
const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim()
  return text || null
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      return 'bin'
  }
}

export async function submitSubscriptionAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error:
        'Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local and restart the dev server.',
    }
  }

  const email = String(formData.get('email') ?? '').trim()
  const fullName = String(formData.get('full_name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const planId = String(formData.get('plan_id') ?? '').trim()
  const termsAccepted = formData.get('terms_accepted') === 'on'
  const screenshot = formData.get('payment_screenshot')

  if (!email || !fullName || !phone || !address) {
    return { ok: false, error: 'Full name, email, phone number, and address are required.' }
  }

  if (!isValidPlanId(planId)) {
    return { ok: false, error: 'Please select a subscription plan.' }
  }

  if (!termsAccepted) {
    return { ok: false, error: 'You must agree to the Terms & Conditions.' }
  }

  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return { ok: false, error: 'Please upload a payment screenshot.' }
  }

  if (!ALLOWED_MIME_TYPES.has(screenshot.type)) {
    return {
      ok: false,
      error: 'Payment screenshot must be a JPEG, PNG, WebP, or GIF image.',
    }
  }

  if (screenshot.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'Payment screenshot must be 5 MB or smaller.' }
  }

  const supabase = await createSupabaseServerClient()
  const objectPath = `${Date.now()}-${crypto.randomUUID()}.${extensionForMime(screenshot.type)}`

  const { error: uploadError } = await supabase.storage
    .from(PAYMENT_BUCKET)
    .upload(objectPath, screenshot, {
      contentType: screenshot.type,
      upsert: false,
    })

  if (uploadError) {
    return {
      ok: false,
      error: 'Could not upload your payment screenshot. Please try again.',
    }
  }

  const { error: insertError } = await supabase
    .from('subscription_applications')
    .insert({
      email,
      full_name: fullName,
      phone,
      address,
      delivery_notes: optionalText(formData.get('delivery_notes')),
      plan_id: planId,
      reading_preferences: optionalText(formData.get('reading_preferences')),
      books_read: optionalText(formData.get('books_read')),
      referral_source: optionalText(formData.get('referral_source')),
      instagram_username: optionalText(formData.get('instagram_username')),
      suggestions: optionalText(formData.get('suggestions')),
      payment_screenshot_path: objectPath,
      terms_accepted: true,
    })

  if (insertError) {
    await supabase.storage.from(PAYMENT_BUCKET).remove([objectPath])
    return {
      ok: false,
      error: 'Could not save your subscription. Please try again.',
    }
  }

  return { ok: true, success: true }
}
