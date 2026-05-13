export type LoginState = {
  ok: boolean
  error: string | null
}

export const initialLoginState: LoginState = { ok: false, error: null }
