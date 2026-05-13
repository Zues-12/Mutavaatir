'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { signInAction } from '@/app/admin-login/actions'
import { initialLoginState, type LoginState } from '@/app/admin-login/types'

type LoginFormProps = {
  next: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-display flex w-full items-center justify-center gap-2 bg-brand-clay px-7 py-3.5 text-sm font-medium tracking-wide text-brand-void shadow-md transition-all duration-300 hover:bg-brand-mist hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-clay disabled:hover:shadow-md lg:text-[0.95rem]"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          SIGNING IN…
        </>
      ) : (
        'SIGN IN'
      )}
    </button>
  )
}

export default function LoginForm({ next }: LoginFormProps) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    signInAction,
    initialLoginState,
  )
  const emailId = useId()
  const passwordId = useId()
  const errorId = useId()

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-2">
        <label
          htmlFor={emailId}
          className="font-display text-xs font-medium uppercase tracking-wider text-brand-mist"
        >
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? errorId : undefined}
          className="w-full border border-brand-earth/60 bg-brand-void/40 px-4 py-3 text-base text-brand-mist placeholder:text-brand-earth/70 outline-none transition-colors duration-200 focus:border-brand-clay focus:bg-brand-void/70"
          placeholder="you@mutavaatir.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={passwordId}
          className="font-display text-xs font-medium uppercase tracking-wider text-brand-mist"
        >
          Password
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? errorId : undefined}
          className="w-full border border-brand-earth/60 bg-brand-void/40 px-4 py-3 text-base text-brand-mist placeholder:text-brand-earth/70 outline-none transition-colors duration-200 focus:border-brand-clay focus:bg-brand-void/70"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p
          id={errorId}
          role="alert"
          className="border-l-2 border-red-500/70 bg-red-500/10 px-3 py-2 text-sm leading-relaxed text-red-200"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
