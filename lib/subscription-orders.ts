export const orderStatuses = ['pending', 'in_transit', 'delivered'] as const

export type OrderStatus = (typeof orderStatuses)[number]

export type SubscriptionOrder = {
  readonly id: string
  readonly application_id: string
  readonly month_number: number
  readonly status: OrderStatus
  readonly old_read: string | null
  readonly options: string | null
  readonly sent_book: string | null
  readonly tracking_id: string | null
  readonly previous_order_id: string | null
  readonly in_transit_at: string | null
  readonly delivered_at: string | null
  readonly created_at: string
  readonly updated_at: string
}

export type SubscriptionOrderWithApplication = SubscriptionOrder & {
  readonly application: {
    readonly id: string
    readonly full_name: string
    readonly email: string
    readonly plan_id: string
    readonly created_at: string
  }
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (orderStatuses as readonly string[]).includes(value)
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  in_transit: 'In transit',
  delivered: 'Delivered',
}

export function getActiveOrder(orders: readonly SubscriptionOrder[]): SubscriptionOrder | null {
  const sorted = [...orders].sort((a, b) => a.month_number - b.month_number)
  return sorted.find((order) => order.status !== 'delivered') ?? sorted.at(-1) ?? null
}
