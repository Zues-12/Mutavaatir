'use client'

import { useActionState, useEffect, useId, useRef, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { submitReviewAction } from '@/app/(site)/reviews/submit/actions'
import {
  initialReviewSubmitState,
  type ReviewSubmitState,
} from '@/app/(site)/reviews/submit/types'
import { OriginButton, originCircleColors } from '@/components/origin-button'
import { ratingOptions, recommendLabels, recommendOptions } from '@/lib/reviews'
import { cn } from '@/lib/utils'

const cardClassName =
  'rounded-lg border border-brand-earth/10 bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10'

const labelClassName =
  'font-display text-xs font-semibold tracking-widest text-brand-earth uppercase sm:text-sm'

const fieldClassName =
  'w-full rounded-sm border border-brand-earth/15 bg-white px-5 py-3.5 text-base text-brand-void placeholder:text-brand-earth/45 outline-none transition-colors duration-200 focus:border-brand-clay focus:ring-2 focus:ring-brand-clay/20 sm:text-[1.05rem]'

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

type ReviewFormProps = {
  defaultCode?: string
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
        'SUBMIT REVIEW'
      )}
    </OriginButton>
  )
}

function StarRatingField({ ratingId }: { ratingId: string }) {
  return (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className={labelClassName}>
        Rating
        <RequiredIndicator />
        <span className="sr-only"> (required)</span>
      </legend>
      <p className="text-base leading-relaxed text-brand-earth sm:text-lg">
        How was your Mutavaatir experience?
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {ratingOptions.map((rating) => (
          <label
            key={rating}
            className="flex cursor-pointer items-center gap-3 rounded-sm border border-brand-earth/15 bg-white px-5 py-3.5 transition-colors has-checked:border-brand-clay has-checked:bg-brand-mist/35 hover:border-brand-clay/40"
          >
            <input
              id={rating === 1 ? ratingId : undefined}
              type="radio"
              name="rating"
              value={rating}
              required
              className="h-5 w-5 shrink-0 accent-brand-clay"
            />
            <span className="text-base text-brand-void sm:text-[1.05rem]" aria-hidden="true">
              {'⭐'.repeat(rating)} {rating}
            </span>
            <span className="sr-only">{rating} out of 5 stars</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function ReviewForm({ defaultCode }: ReviewFormProps) {
  const [state, formAction] = useActionState<ReviewSubmitState, FormData>(
    submitReviewAction,
    initialReviewSubmitState,
  )

  const reviewCodeId = useId()
  const feedbackId = useId()
  const displayNameId = useId()
  const commentsId = useId()
  const ratingId = useId()
  const errorId = useId()
  const successRef = useRef<HTMLDivElement>(null)

  const codeFromUrl = Boolean(defaultCode)

  useEffect(() => {
    if (!state.success || !successRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    successRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    successRef.current.focus({ preventScroll: true })
  }, [state.success])

  if (state.success) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cn(cardClassName, 'mx-auto max-w-3xl scroll-mt-24 text-center sm:scroll-mt-28')}
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand-clay" aria-hidden />
        <h2 className="font-display mt-5 text-3xl font-medium tracking-wide text-brand-void sm:text-4xl">
          Thank You!
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-brand-earth sm:text-lg">
          Your verified review has been received. We appreciate you taking the time to share
          your Mutavaatir experience.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="text-center">
        <p className="font-display text-xs font-medium tracking-[0.35em] text-brand-clay uppercase sm:text-sm">
          Mutavaatir — Verified Review
        </p>
        <h1 className="font-display mt-4 text-3xl font-medium tracking-wide text-brand-void sm:text-4xl">
          SHARE YOUR EXPERIENCE
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-earth sm:text-lg">
          Only verified Mutavaatir subscribers can submit this form using their unique code.
        </p>
      </header>

      <form action={formAction} className={cn(cardClassName, 'flex flex-col gap-10')}>
        <p className="text-sm leading-relaxed text-brand-earth sm:text-base">
          <span className="font-medium text-brand-clay" aria-hidden="true">
            *
          </span>{' '}
          <span className="sr-only">Asterisk indicates </span>
          Required field.
        </p>

        <div className="flex flex-col gap-2.5">
          <FieldLabel htmlFor={reviewCodeId} required>
            Review Code
          </FieldLabel>
          <p className="text-sm leading-relaxed text-brand-earth sm:text-base">
            Enter the parcel number you received from us
          </p>
          <input
            id={reviewCodeId}
            name="review_code"
            type="text"
            required
            readOnly={codeFromUrl}
            defaultValue={defaultCode ?? ''}
            className={cn(
              fieldClassName,
              codeFromUrl && 'cursor-not-allowed bg-brand-mist/30 text-brand-earth',
            )}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <StarRatingField ratingId={ratingId} />

        <div className="flex flex-col gap-2.5">
          <FieldLabel htmlFor={feedbackId} required>
            Feedback
          </FieldLabel>
          <p className="text-sm leading-relaxed text-brand-earth sm:text-base">
            Describe your experience with us
          </p>
          <textarea
            id={feedbackId}
            name="feedback"
            rows={5}
            required
            className={cn(fieldClassName, 'min-h-32 resize-y')}
          />
        </div>

        <fieldset className="flex flex-col gap-3 border-0 p-0">
          <legend className={labelClassName}>
            Would you recommend Mutavaatir?
            <RequiredIndicator />
            <span className="sr-only"> (required)</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {recommendOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-sm border border-brand-earth/15 bg-white px-5 py-3.5 transition-colors has-checked:border-brand-clay has-checked:bg-brand-mist/35 hover:border-brand-clay/40"
              >
                <input
                  type="radio"
                  name="would_recommend"
                  value={option}
                  required
                  className="h-5 w-5 shrink-0 accent-brand-clay"
                />
                <span className="text-base text-brand-void sm:text-[1.05rem]">
                  {recommendLabels[option]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <FieldLabel htmlFor={displayNameId}>Name</FieldLabel>
          <p className="text-sm leading-relaxed text-brand-earth sm:text-base">
            How should we credit your review?
          </p>
          <input
            id={displayNameId}
            name="display_name"
            type="text"
            autoComplete="name"
            className={fieldClassName}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <FieldLabel htmlFor={commentsId}>Any suggestions or comments?</FieldLabel>
          <textarea
            id={commentsId}
            name="comments"
            rows={3}
            className={cn(fieldClassName, 'min-h-24 resize-y')}
          />
        </div>

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
