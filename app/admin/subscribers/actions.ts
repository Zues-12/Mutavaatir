'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  isSourcingResult,
  isSubscriptionStatus,
  type SourcingResult,
  type SubscriptionStatus,
} from '@/lib/subscription-applications'

export type ActionResult = { ok: true } | { ok: false; error: string }

async function getAdminClient() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { supabase, user: null, isAdmin: false }
  }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  return { supabase, user, isAdmin: Boolean(isAdmin) }
}

function revalidateSubscriptionPaths(id?: string) {
  revalidatePath('/admin')
  revalidatePath('/admin/subscribers')
  if (id) {
    revalidatePath(`/admin/subscribers/${id}`)
    revalidatePath(`/admin/subscribers/${id}/packing-slip`)
  }
}

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

async function updateApplication(
  id: string,
  payload: Record<string, unknown>,
  expectedStatus?: SubscriptionStatus,
): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  let query = supabase
    .from('subscription_applications')
    .update({
      ...payload,
      workflow_updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (expectedStatus) {
    query = query.eq('status', expectedStatus)
  }

  const { data, error } = await query.select('id').maybeSingle()

  if (error) {
    console.error('updateApplication', error)
    return { ok: false, error: 'Could not update subscription.' }
  }

  if (!data) {
    return { ok: false, error: 'No subscription was updated.' }
  }

  revalidateSubscriptionPaths(id)
  return { ok: true }
}

export async function updateSubscriptionStatusAction(
  id: string,
  status: SubscriptionStatus,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing subscription id.' }
  if (!isSubscriptionStatus(status) || (status !== 'book_searching' && status !== 'rejected')) {
    return { ok: false, error: 'Invalid status.' }
  }

  const { supabase, user, isAdmin } = await getAdminClient()
  if (!isAdmin || !user) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  const now = new Date().toISOString()
  const isApproval = status === 'book_searching'

  const reviewPayload: Record<string, unknown> = {
    status,
    workflow_updated_at: now,
  }

  if (isApproval) {
    reviewPayload.reviewed_at = now
    reviewPayload.reviewed_by = user.id
    reviewPayload.sourcing_result = null
    reviewPayload.sourcing_notes = null
  }

  let { data, error } = await supabase
    .from('subscription_applications')
    .update(reviewPayload)
    .eq('id', id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (error?.message.includes('reviewed_at') || error?.message.includes('sourcing_result')) {
    const fallback: Record<string, unknown> = { status, workflow_updated_at: now }
    if (isApproval) {
      fallback.reviewed_at = now
      fallback.reviewed_by = user.id
    }
    ;({ data, error } = await supabase
      .from('subscription_applications')
      .update(fallback)
      .eq('id', id)
      .select('id')
      .maybeSingle())
  }

  if (error) {
    console.error('updateSubscriptionStatusAction', error)
    return { ok: false, error: 'Could not update subscription status.' }
  }

  if (!data) {
    return { ok: false, error: 'No subscription was updated.' }
  }

  revalidateSubscriptionPaths(id)
  return { ok: true }
}

export async function markSubscriptionPendingAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing subscription id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  let { data, error } = await supabase
    .from('subscription_applications')
    .update({
      status: 'pending',
      reviewed_at: null,
      reviewed_by: null,
      sourcing_result: null,
      sourcing_notes: null,
      book_title: null,
      book_author: null,
      book_notes: null,
      package_id: null,
      tracking_number: null,
      courier: null,
      estimated_delivery_date: null,
      dispatched_at: null,
      delivered_at: null,
      workflow_updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error?.message.includes('sourcing_result')) {
    ;({ data, error } = await supabase
      .from('subscription_applications')
      .update({ status: 'pending', reviewed_at: null, reviewed_by: null })
      .eq('id', id)
      .select('id')
      .maybeSingle())
  }

  if (error) {
    console.error('markSubscriptionPendingAction', error)
    return { ok: false, error: 'Could not reset subscription status.' }
  }

  if (!data) {
    return { ok: false, error: 'No subscription was updated.' }
  }

  revalidateSubscriptionPaths(id)
  return { ok: true }
}

export async function setSourcingResultAction(
  id: string,
  result: SourcingResult,
  notes: string | null,
): Promise<ActionResult> {
  if (!isSourcingResult(result)) {
    return { ok: false, error: 'Invalid sourcing result.' }
  }

  return updateApplication(
    id,
    {
      sourcing_result: result,
      sourcing_notes: notes,
    },
    'book_searching',
  )
}

export async function confirmBookAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const title = optionalText(formData.get('book_title'))
  const author = optionalText(formData.get('book_author'))

  if (!title) {
    return { ok: false, error: 'Book title is required.' }
  }

  return updateApplication(
    id,
    {
      status: 'book_confirmed',
      book_title: title,
      book_author: author,
      book_notes: optionalText(formData.get('book_notes')),
      sourcing_result: null,
    },
    'book_searching',
  )
}

export async function startPackagingAction(id: string): Promise<ActionResult> {
  return updateApplication(id, { status: 'packaging' }, 'book_confirmed')
}

export async function savePackageIdAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const packageId = optionalText(formData.get('package_id'))
  if (!packageId) {
    return { ok: false, error: 'Package ID is required.' }
  }

  return updateApplication(id, { package_id: packageId }, 'packaging')
}

export async function markDispatchedAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const trackingNumber = optionalText(formData.get('tracking_number'))
  const courier = optionalText(formData.get('courier'))
  const estimatedDelivery = optionalText(formData.get('estimated_delivery_date'))

  if (!trackingNumber) {
    return { ok: false, error: 'Tracking number is required.' }
  }
  if (!courier) {
    return { ok: false, error: 'Courier is required.' }
  }

  return updateApplication(
    id,
    {
      status: 'dispatched',
      tracking_number: trackingNumber,
      courier,
      estimated_delivery_date: estimatedDelivery,
      dispatched_at: new Date().toISOString(),
    },
    'packaging',
  )
}

export async function markDeliveredAction(id: string): Promise<ActionResult> {
  return updateApplication(
    id,
    {
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    },
    'dispatched',
  )
}

export async function activateSubscriptionAction(id: string): Promise<ActionResult> {
  return updateApplication(id, { status: 'active' }, 'delivered')
}

export async function resumeBookSearchAction(id: string): Promise<ActionResult> {
  return updateApplication(
    id,
    {
      sourcing_result: null,
      sourcing_notes: null,
    },
    'book_searching',
  )
}
