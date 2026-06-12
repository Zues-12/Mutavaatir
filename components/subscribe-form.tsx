'use client'

import Link from 'next/link'
import { useActionState, useId, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { submitSubscriptionAction } from '@/app/(site)/subscribe/actions'
import { initialSubscribeState, type SubscribeState } from '@/app/(site)/subscribe/types'
import { OriginButton, originCircleColors } from '@/components/origin-button'
import SubscribePaymentDetails from '@/components/subscribe-payment-details'
import { subscriptionPlanOptions } from '@/lib/subscribe-data'
import { cn } from '@/lib/utils'

const cardClassName =
  'rounded-lg border border-brand-earth/10 bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10'

const labelClassName =
  'font-display text-xs font-semibold tracking-widest text-brand-earth uppercase sm:text-sm'

const fieldClassName =
  'w-full rounded-sm border border-brand-earth/15 bg-white px-5 py-3.5 text-base text-brand-void placeholder:text-brand-earth/45 outline-none transition-colors duration-200 focus:border-brand-clay focus:ring-2 focus:ring-brand-clay/20 sm:text-[1.05rem]'

const sectionTitleClassName =
  'font-display text-xl font-medium tracking-wide text-brand-void sm:text-2xl'

function RequiredIndicator() {
  return (
    <span className="text-brand-clay" aria-hidden="true">
      {' '}
      *
    </span>
  )
}

function OptionalIndicator() {
  return (
    <span className="ml-1.5 font-normal normal-case tracking-normal text-brand-earth/65">
      (Optional)
    </span>
  )
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className={labelClassName}>
      {children}
      {required ? (
        <>
          <RequiredIndicator />
          <span className="sr-only"> (required)</span>
        </>
      ) : (
        <OptionalIndicator />
      )}
    </label>
  )
}

type SubscribeFormProps = {
  defaultPlan?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <OriginButton
      type="submit"
      disabled={pending}
      circleColor={originCircleColors.mist}
      labelClassName="transition-colors duration-300 group-hover:text-brand-void"
      className="font-display flex w-full items-center justify-center gap-2 bg-brand-void px-8 py-4 text-base font-semibold tracking-widest text-brand-mist shadow-md transition-shadow duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-md sm:w-fit sm:text-[1.05rem]"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          SUBMITTING…
        </>
      ) : (
        'SUBMIT SUBSCRIPTION'
      )}
    </OriginButton>
  )
}

function FormSection({
  title,
  description,
  required,
  optional,
  children,
}: {
  title: string
  description?: string
  required?: boolean
  optional?: boolean
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className={sectionTitleClassName}>
          {title}
          {required ? (
            <>
              <RequiredIndicator />
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
          {optional ? <OptionalIndicator /> : null}
        </h3>
        {description ? (
          <p className="mt-2.5 text-base leading-relaxed text-brand-earth sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export default function SubscribeForm({ defaultPlan }: SubscribeFormProps) {
  const [state, formAction] = useActionState<SubscribeState, FormData>(
    submitSubscriptionAction,
    initialSubscribeState,
  )

  const emailId = useId()
  const fullNameId = useId()
  const phoneId = useId()
  const addressId = useId()
  const deliveryNotesId = useId()
  const readingPreferencesId = useId()
  const booksReadId = useId()
  const referralSourceId = useId()
  const instagramId = useId()
  const suggestionsId = useId()
  const screenshotId = useId()
  const termsId = useId()
  const errorId = useId()

  if (state.success) {
    return (
      <div
        role="status"
        className={cn(cardClassName, 'mx-auto max-w-3xl text-center')}
      >
        <CheckCircle2
          className="mx-auto h-14 w-14 text-brand-clay"
          aria-hidden
        />
        <h2 className="font-display mt-5 text-3xl font-medium tracking-wide text-brand-void sm:text-4xl">
          Thank You!
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-brand-earth sm:text-lg">
          Your subscription request has been received. We will verify your payment
          and confirm your subscription shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-10">
      <SubscribePaymentDetails />

      <form
        action={formAction}
        className={cn(cardClassName, 'flex flex-col gap-12')}
        encType="multipart/form-data"
      >
        <p className="text-sm leading-relaxed text-brand-earth sm:text-base">
          <span className="font-medium text-brand-clay" aria-hidden="true">
            *
          </span>{' '}
          <span className="sr-only">Asterisk indicates </span>
          Required field. All other fields are optional.
        </p>

        <FormSection title="Your Details">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2.5 sm:col-span-2">
              <FieldLabel htmlFor={fullNameId} required>
                Full Name
              </FieldLabel>
              <input
                id={fullNameId}
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className={fieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor={emailId} required>
                Email
              </FieldLabel>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                className={fieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor={phoneId} required>
                Phone Number
              </FieldLabel>
              <input
                id={phoneId}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className={fieldClassName}
                placeholder="03XX XXXXXXX"
              />
            </div>

            <div className="flex flex-col gap-2.5 sm:col-span-2">
              <FieldLabel htmlFor={addressId} required>
                Address
              </FieldLabel>
              <textarea
                id={addressId}
                name="address"
                rows={3}
                required
                autoComplete="street-address"
                className={cn(fieldClassName, 'resize-y min-h-24')}
              />
            </div>

            <div className="flex flex-col gap-2.5 sm:col-span-2">
              <FieldLabel htmlFor={deliveryNotesId}>Delivery Notes</FieldLabel>
              <textarea
                id={deliveryNotesId}
                name="delivery_notes"
                rows={2}
                placeholder="e.g. landmark, preferred time, instructions"
                className={cn(fieldClassName, 'resize-y min-h-20')}
              />
            </div>
          </div>
        </FormSection>

        <div className="h-px bg-brand-earth/10" aria-hidden />

        <FormSection title="Select Your Subscription Plan" required>
          <fieldset className="flex flex-col gap-3 border-0 p-0">
            <legend className="sr-only">Subscription plan</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {subscriptionPlanOptions.map((plan) => (
                <label
                  key={plan.id}
                  className="flex cursor-pointer items-start gap-3.5 rounded-sm border border-brand-earth/15 bg-white px-5 py-4 transition-colors has-checked:border-brand-clay has-checked:bg-brand-mist/35 hover:border-brand-clay/40"
                >
                  <input
                    type="radio"
                    name="plan_id"
                    value={plan.id}
                    defaultChecked={defaultPlan === plan.id}
                    required
                    className="mt-1 h-5 w-5 shrink-0 accent-brand-clay"
                  />
                  <span className="text-base leading-relaxed text-brand-void sm:text-[1.05rem]">
                    {plan.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </FormSection>

        <div className="h-px bg-brand-earth/10" aria-hidden />

        <FormSection
          title="Reading Preferences"
          optional
          description="Genre, language, length, etc. If you don't add any, the books will be completely random."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <label htmlFor={readingPreferencesId} className={labelClassName}>
                Preferences
              </label>
              <textarea
                id={readingPreferencesId}
                name="reading_preferences"
                rows={3}
                className={cn(fieldClassName, 'resize-y min-h-24')}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor={booksReadId} className={labelClassName}>
                Books You&apos;ve Already Read / Enjoyed
              </label>
              <textarea
                id={booksReadId}
                name="books_read"
                rows={3}
                placeholder="Helps avoid repetition"
                className={cn(fieldClassName, 'resize-y min-h-24')}
              />
            </div>
          </div>
        </FormSection>

        <div className="h-px bg-brand-earth/10" aria-hidden />

        <FormSection title="A Little More About You" optional>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <label htmlFor={referralSourceId} className={labelClassName}>
                How Did You Hear About Us?
              </label>
              <input
                id={referralSourceId}
                name="referral_source"
                type="text"
                className={fieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor={instagramId} className={labelClassName}>
                Instagram Username
              </label>
              <input
                id={instagramId}
                name="instagram_username"
                type="text"
                className={fieldClassName}
                placeholder="@username"
              />
            </div>

            <div className="flex flex-col gap-2.5 sm:col-span-2">
              <label htmlFor={suggestionsId} className={labelClassName}>
                Suggestions or Questions
              </label>
              <textarea
                id={suggestionsId}
                name="suggestions"
                rows={3}
                className={cn(fieldClassName, 'resize-y min-h-20')}
              />
            </div>
          </div>
        </FormSection>

        <div className="h-px bg-brand-earth/10" aria-hidden />

        <FormSection title="Payment Screenshot" required>
          <div className="flex flex-col gap-2.5">
            <FieldLabel htmlFor={screenshotId} required>
              Upload Screenshot
            </FieldLabel>
            <input
              id={screenshotId}
              name="payment_screenshot"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              className={cn(
                fieldClassName,
                'cursor-pointer file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-brand-void file:px-5 file:py-2.5 file:font-display file:text-xs file:font-semibold file:tracking-widest file:text-brand-mist file:uppercase sm:file:text-sm',
              )}
            />
            <p className="text-sm leading-relaxed text-brand-earth sm:text-base">
              JPEG, PNG, WebP, or GIF — max 5 MB.
            </p>
          </div>
        </FormSection>

        <label
          htmlFor={termsId}
          className="flex cursor-pointer items-start gap-3.5 rounded-sm border border-brand-earth/10 bg-brand-mist/20 px-5 py-5 text-base leading-relaxed text-brand-earth sm:text-[1.05rem]"
        >
          <input
            id={termsId}
            name="terms_accepted"
            type="checkbox"
            required
            className="mt-1 h-5 w-5 shrink-0 accent-brand-clay"
          />
          <span>
            I have read and agree to the{' '}
            <Link
              href="/terms"
              className="font-medium text-brand-void underline decoration-brand-clay/60 underline-offset-2 transition-colors hover:text-brand-clay"
              target="_blank"
            >
              Terms &amp; Conditions
            </Link>{' '}
            of Mutavaatir.
            <RequiredIndicator />
            <span className="sr-only"> (required)</span>
          </span>
        </label>

        {state.error ? (
          <p
            id={errorId}
            role="alert"
            className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-base leading-relaxed text-red-800"
          >
            {state.error}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </div>
  )
}
