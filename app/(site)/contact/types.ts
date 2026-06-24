export type ContactState = {
  ok: boolean
  error?: string
  success?: boolean
}

export const initialContactState: ContactState = {
  ok: false,
}
