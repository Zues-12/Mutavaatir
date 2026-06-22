import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { SubscriptionApplication } from '@/lib/subscription-applications'
import type { SubscriptionOrder, SubscriptionOrderWithApplication } from '@/lib/subscription-orders'

export async function listOrdersForApplication(
  applicationId: string,
): Promise<SubscriptionOrder[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('subscription_orders')
    .select('*')
    .eq('application_id', applicationId)
    .order('month_number', { ascending: true })

  if (error || !data) return []
  return data as SubscriptionOrder[]
}

export async function getOrder(id: string): Promise<SubscriptionOrder | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('subscription_orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as SubscriptionOrder
}

export async function findLastDeliveredOrderForEmail(
  email: string,
  excludeApplicationId?: string,
): Promise<SubscriptionOrder | null> {
  const supabase = await createSupabaseServerClient()

  let appQuery = supabase
    .from('subscription_applications')
    .select('id')
    .eq('email', email)
    .in('status', ['accepted', 'completed'])

  if (excludeApplicationId) {
    appQuery = appQuery.neq('id', excludeApplicationId)
  }

  const { data: applications, error: appError } = await appQuery.order('created_at', {
    ascending: false,
  })

  if (appError || !applications?.length) return null

  const applicationIds = applications.map((row) => row.id)
  const { data: orders, error: orderError } = await supabase
    .from('subscription_orders')
    .select('*')
    .in('application_id', applicationIds)
    .eq('status', 'delivered')
    .order('delivered_at', { ascending: false })
    .limit(1)

  if (orderError || !orders?.length) return null
  return orders[0] as SubscriptionOrder
}

export async function listPreviousApplications(
  application: SubscriptionApplication,
): Promise<SubscriptionApplication[]> {
  const chain: SubscriptionApplication[] = []
  let currentId = application.previous_application_id

  const supabase = await createSupabaseServerClient()

  while (currentId) {
    const { data, error } = await supabase
      .from('subscription_applications')
      .select('*')
      .eq('id', currentId)
      .maybeSingle()

    if (error || !data) break

    chain.push(data as SubscriptionApplication)
    currentId = data.previous_application_id
  }

  return chain
}

export async function listHistoryOrders(
  application: SubscriptionApplication,
): Promise<SubscriptionOrderWithApplication[]> {
  const previousApplications = await listPreviousApplications(application)
  if (previousApplications.length === 0) return []

  const supabase = await createSupabaseServerClient()
  const applicationIds = previousApplications.map((item) => item.id)

  const { data, error } = await supabase
    .from('subscription_orders')
    .select(
      `
      *,
      application:subscription_applications!application_id (
        id,
        full_name,
        email,
        plan_id,
        created_at
      )
    `,
    )
    .in('application_id', applicationIds)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((row) => {
    const { application: app, ...order } = row as SubscriptionOrder & {
      application: SubscriptionOrderWithApplication['application']
    }
    return { ...order, application: app }
  })
}

export async function listLinkableApplications(
  application: SubscriptionApplication,
): Promise<SubscriptionApplication[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('subscription_applications')
    .select('*')
    .eq('email', application.email)
    .neq('id', application.id)
    .in('status', ['accepted', 'completed'])
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as SubscriptionApplication[]
}
