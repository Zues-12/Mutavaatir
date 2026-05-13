import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertCircle } from 'lucide-react'
import LoginForm from '@/components/admin/login-form'

type SearchParams = Promise<{
  next?: string | string[]
  error?: string | string[]
}>

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function resolveNext(value: string | string[] | undefined): string {
  const raw = firstParam(value)
  if (raw && raw.startsWith('/admin')) return raw
  return '/admin'
}

const errorMessages: Record<string, string> = {
  'not-admin':
    'That account is signed in but does not have admin access. Sign in with an admin account, or contact your team lead.',
}

function resolveError(value: string | string[] | undefined): string | null {
  const raw = firstParam(value)
  if (!raw) return null
  return errorMessages[raw] ?? null
}

export const metadata: Metadata = {
  title: 'Admin Sign In',
  description: 'Sign in to the Mutavaatir admin panel.',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const next = resolveNext(params.next)
  const errorMessage = resolveError(params.error)

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex min-h-screen flex-col bg-brand-void"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(159,134,102,0.18),transparent_55%)]"
      />

      <header className="border-b border-brand-earth bg-brand-void">
        <div className="mx-auto flex h-21 max-w-7xl items-center px-4 sm:px-6 lg:h-24 lg:px-8">
          <Link
            href="/"
            className="font-display shrink-0 text-3xl font-normal leading-none tracking-normal text-brand-clay xl:text-5xl"
          >
            MUTAVAATIR
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section
          aria-labelledby="admin-login-heading"
          className="w-full max-w-md border border-brand-earth/60 bg-brand-void/70 px-6 py-10 shadow-2xl backdrop-blur-sm sm:px-10 sm:py-12"
        >
          <div className="mb-8 flex flex-col gap-3">
            <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.35em] text-brand-clay">
              Admin Access
            </p>
            <h1
              id="admin-login-heading"
              className="font-display text-3xl font-normal leading-tight tracking-normal text-brand-mist sm:text-4xl"
            >
              SIGN IN
            </h1>
            <div className="h-px w-12 bg-brand-clay" aria-hidden />
            <p className="text-sm leading-relaxed text-brand-dust">
              Restricted area. Sign in with your Mutavaatir admin credentials to
              continue.
            </p>
          </div>

          {errorMessage ? (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 border-l-2 border-amber-500/70 bg-amber-500/10 px-3 py-3 text-sm leading-relaxed text-amber-100"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                aria-hidden
              />
              <p>{errorMessage}</p>
            </div>
          ) : null}

          <LoginForm next={next} />

          <p className="mt-8 text-center text-xs leading-relaxed tracking-wide text-brand-earth">
            <Link
              href="/"
              className="font-display uppercase tracking-wider text-brand-dust transition-colors duration-200 hover:text-brand-mist"
            >
              ← Back to site
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
