'use client'

import { useCallback, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { OriginButton, originCircleColors } from '@/components/origin-button'
import { cn } from '@/lib/utils'

export default function FooterNewsletterForm({ className }: { className?: string }) {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }, [])

  return (
    <form
      onSubmit={onSubmit}
      className={cn('relative', className)}
      aria-label="Join the community — email signup"
    >
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Enter email address"
        required
        className={cn(
          'h-12 w-full rounded-lg border border-brand-dust/45 bg-brand-void/70 pr-14 pl-4 text-sm text-brand-dust shadow-inner outline-none',
          'placeholder:text-brand-dust/65',
          'focus-visible:border-brand-clay/70 focus-visible:ring-2 focus-visible:ring-brand-clay/25',
        )}
      />
      <OriginButton
        type="submit"
        circleColor={originCircleColors.mist}
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-clay text-brand-void shadow-md transition-shadow hover:shadow-lg"
        aria-label="Submit email"
      >
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
      </OriginButton>
    </form>
  )
}
