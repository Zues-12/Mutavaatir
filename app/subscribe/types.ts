export type SubscribeState = {
  ok: boolean
  error?: string
  success?: boolean
}

export const initialSubscribeState: SubscribeState = {
  ok: false,
}
