'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { findLastDeliveredOrderForEmail } from '@/lib/admin/order-queries'
import { getPlanMonths } from '@/lib/pricing-data'
import {
  isSubscriptionStatus,
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
  }
}

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

async function getApplication(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, id: string) {
  const { data, error } = await supabase
    .from('subscription_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data
}

async function createFirstOrder(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  applicationId: string,
  email: string,
) {
  const previousOrder = await findLastDeliveredOrderForEmail(email, applicationId)

  const { error } = await supabase.from('subscription_orders').insert({
    application_id: applicationId,
    month_number: 1,
    status: 'pending',
    previous_order_id: previousOrder?.id ?? null,
  })

  return error
}

export async function updateSubscriptionStatusAction(
  id: string,
  status: SubscriptionStatus,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: 'Missing subscription id.' }
  if (!isSubscriptionStatus(status) || (status !== 'accepted' && status !== 'rejected')) {
    return { ok: false, error: 'Invalid status.' }
  }

  const { supabase, user, isAdmin } = await getAdminClient()
  if (!isAdmin || !user) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  const application = await getApplication(supabase, id)
  if (!application) {
    return { ok: false, error: 'Subscription not found.' }
  }

  const now = new Date().toISOString()
  const isApproval = status === 'accepted'

  const reviewPayload: Record<string, unknown> = {
    status,
  }

  if (isApproval) {
    reviewPayload.reviewed_at = now
    reviewPayload.reviewed_by = user.id
  }

  const { data, error } = await supabase
    .from('subscription_applications')
    .update(reviewPayload)
    .eq('id', id)
    .eq('status', 'pending')
    .select('id, email')
    .maybeSingle()

  if (error) {
    console.error('updateSubscriptionStatusAction', error)
    return { ok: false, error: 'Could not update subscription status.' }
  }

  if (!data) {
    return { ok: false, error: 'No subscription was updated.' }
  }

  if (isApproval) {
    const previousOrder = await findLastDeliveredOrderForEmail(data.email, id)
    if (previousOrder) {
      await supabase
        .from('subscription_applications')
        .update({ previous_application_id: previousOrder.application_id })
        .eq('id', id)
    }

    const orderError = await createFirstOrder(supabase, id, data.email)
    if (orderError) {
      console.error('createFirstOrder', orderError)
      return { ok: false, error: 'Subscription accepted but the first order could not be created.' }
    }
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

  const { data, error } = await supabase
    .from('subscription_applications')
    .update({
      status: 'pending',
      reviewed_at: null,
      reviewed_by: null,
      previous_application_id: null,
    })
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('markSubscriptionPendingAction', error)
    return { ok: false, error: 'Could not reset subscription status.' }
  }

  if (!data) {
    return { ok: false, error: 'No subscription was updated.' }
  }

  await supabase.from('subscription_orders').delete().eq('application_id', id)

  revalidateSubscriptionPaths(id)
  return { ok: true }
}

export async function linkPreviousApplicationAction(
  applicationId: string,
  previousApplicationId: string | null,
): Promise<ActionResult> {
  if (!applicationId) return { ok: false, error: 'Missing subscription id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  if (previousApplicationId === applicationId) {
    return { ok: false, error: 'A subscription cannot link to itself.' }
  }

  const application = await getApplication(supabase, applicationId)
  if (!application) {
    return { ok: false, error: 'Subscription not found.' }
  }

  if (previousApplicationId) {
    const previous = await getApplication(supabase, previousApplicationId)
    if (!previous) {
      return { ok: false, error: 'Previous subscription not found.' }
    }
    if (previous.email !== application.email) {
      return { ok: false, error: 'Previous subscription must belong to the same subscriber.' }
    }
  }

  const { error } = await supabase
    .from('subscription_applications')
    .update({ previous_application_id: previousApplicationId })
    .eq('id', applicationId)

  if (error) {
    console.error('linkPreviousApplicationAction', error)
    return { ok: false, error: 'Could not link previous subscription.' }
  }

  if (previousApplicationId) {
    const previousOrder = await findLastDeliveredOrderForEmail(application.email, applicationId)
    if (previousOrder) {
      const { data: firstOrder } = await supabase
        .from('subscription_orders')
        .select('id')
        .eq('application_id', applicationId)
        .eq('month_number', 1)
        .maybeSingle()

      if (firstOrder) {
        await supabase
          .from('subscription_orders')
          .update({ previous_order_id: previousOrder.id })
          .eq('id', firstOrder.id)
      }
    }
  }

  revalidateSubscriptionPaths(applicationId)
  return { ok: true }
}

export async function saveOrderFieldsAction(
  orderId: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!orderId) return { ok: false, error: 'Missing order id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  const { data, error } = await supabase
    .from('subscription_orders')
    .update({
      old_read: optionalText(formData.get('old_read')),
      options: optionalText(formData.get('options')),
      sent_book: optionalText(formData.get('sent_book')),
      tracking_id: optionalText(formData.get('tracking_id')),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select('application_id')
    .maybeSingle()

  if (error) {
    console.error('saveOrderFieldsAction', error)
    return { ok: false, error: 'Could not save order details.' }
  }

  if (!data) {
    return { ok: false, error: 'Order not found.' }
  }

  revalidateSubscriptionPaths(data.application_id)
  return { ok: true }
}

export async function markOrderInTransitAction(orderId: string): Promise<ActionResult> {
  if (!orderId) return { ok: false, error: 'Missing order id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  const { data, error } = await supabase
    .from('subscription_orders')
    .update({
      status: 'in_transit',
      in_transit_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select('application_id')
    .maybeSingle()

  if (error) {
    console.error('markOrderInTransitAction', error)
    return { ok: false, error: 'Could not mark order in transit.' }
  }

  if (!data) {
    return { ok: false, error: 'Order was not updated. It may already be in transit or delivered.' }
  }

  revalidateSubscriptionPaths(data.application_id)
  return { ok: true }
}

export async function markOrderDeliveredAction(orderId: string): Promise<ActionResult> {
  if (!orderId) return { ok: false, error: 'Missing order id.' }

  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) {
    return { ok: false, error: 'You must be signed in as an admin.' }
  }

  const { data: order, error: fetchError } = await supabase
    .from('subscription_orders')
    .select('*, application:subscription_applications!application_id(plan_id, status)')
    .eq('id', orderId)
    .maybeSingle()

  if (fetchError || !order) {
    return { ok: false, error: 'Order not found.' }
  }

  if (order.status !== 'in_transit' && order.status !== 'pending') {
    return { ok: false, error: 'Only pending or in-transit orders can be marked delivered.' }
  }

  const now = new Date().toISOString()
  const { error: deliverError } = await supabase
    .from('subscription_orders')
    .update({
      status: 'delivered',
      delivered_at: now,
      updated_at: now,
    })
    .eq('id', orderId)

  if (deliverError) {
    console.error('markOrderDeliveredAction', deliverError)
    return { ok: false, error: 'Could not mark order delivered.' }
  }

  const application = order.application as { plan_id: string; status: string }
  const planMonths = getPlanMonths(application.plan_id)
  const nextMonth = order.month_number + 1

  if (nextMonth <= planMonths) {
    const { error: createError } = await supabase.from('subscription_orders').insert({
      application_id: order.application_id,
      month_number: nextMonth,
      status: 'pending',
      previous_order_id: orderId,
    })

    if (createError) {
      console.error('markOrderDeliveredAction create next order', createError)
      return { ok: false, error: 'Order delivered but the next month order could not be created.' }
    }
  } else {
    await supabase
      .from('subscription_applications')
      .update({ status: 'completed' })
      .eq('id', order.application_id)
  }

  revalidateSubscriptionPaths(order.application_id)
  return { ok: true }
}
