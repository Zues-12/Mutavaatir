'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { submitContactAction } from '@/app/(site)/contact/actions'
import { initialContactState, type ContactState } from '@/app/(site)/contact/types'
import { cn } from '@/lib/utils'

const labelClassName = 'text-xs font-medium text-brand-void/80 sm:text-sm'

const fieldClassName =
  'w-full rounded-lg border border-brand-earth/25 bg-brand-dust px-4 py-2.5 text-base text-brand-void placeholder:text-brand-earth/60 outline-none transition-colors duration-200 focus:border-brand-earth focus:ring-2 focus:ring-brand-earth/20 sm:py-3'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <div className="flex justify-end pt-1">
      <button
        type="submit"
        disabled={pending}
        className="font-display inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-brand-void px-9 py-3 text-sm font-semibold tracking-widest text-brand-mist shadow-[0_5px_16px_rgba(13,13,13,0.25)] transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            SENDING…
          </>
        ) : (
          'SUBMIT'
        )}
      </button>
    </div>
  )
}

export default function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContactAction,
    initialContactState,
  )

  const fullNameId = useId()
  const emailId = useId()
  const messageId = useId()
  const errorId = useId()
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!state.success) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollTarget = document.getElementById('contact-support-heading')

    scrollTarget?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    successRef.current?.focus({ preventScroll: true })
  }, [state.success])

  if (state.success) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="py-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-clay" aria-hidden />
        <h2 className="font-display mt-4 text-2xl font-medium tracking-wide text-brand-void">
          Message sent
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-brand-earth/90">
          Thank you for reaching out. We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:gap-[1.125rem]">
      <input type="hidden" name="subject" value="other" />

      <div className="flex flex-col gap-1">
        <label htmlFor={fullNameId} className={labelClassName}>
          Name
        </label>
        <input
          id={fullNameId}
          name="full_name"
          type="text"
          autoComplete="name"
          required
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={emailId} className={labelClassName}>
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={messageId} className={labelClassName}>
          The world is your oyster. What would you like to share with us?
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          required
          maxLength={4000}
          className={cn(fieldClassName, 'min-h-[7.5rem] resize-none')}
        />
      </div>

      {state.error ? (
        <p
          id={errorId}
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
