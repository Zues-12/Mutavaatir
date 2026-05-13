'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminNavItems } from '@/lib/admin-nav'
import { signOutAction } from '@/app/admin/actions'

type AdminShellProps = {
  userEmail: string | null
  children: ReactNode
}

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={cn(
          'font-display inline-flex items-center gap-2 border border-brand-earth/60 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wider text-brand-dust transition-colors duration-300 hover:border-brand-mist hover:text-brand-mist',
          className,
        )}
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Sign out
      </button>
    </form>
  )
}

export default function AdminShell({ userEmail, children }: AdminShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    closeMobile()
  }, [pathname, closeMobile])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const navList = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {adminNavItems.map((item) => {
        const Icon = item.icon
        const active = isActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-medium tracking-wide transition-colors duration-200',
              active
                ? 'border-brand-clay bg-brand-earth/15 text-brand-mist'
                : 'border-transparent text-brand-dust hover:border-brand-earth hover:bg-brand-earth/10 hover:text-brand-mist',
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                active ? 'text-brand-clay' : 'text-brand-earth group-hover:text-brand-clay',
              )}
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="font-display uppercase tracking-wider">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-brand-void text-brand-dust">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-earth bg-brand-void lg:flex">
        <div className="flex h-24 items-center border-b border-brand-earth px-6">
          <Link
            href="/admin"
            className="font-display text-2xl font-normal leading-none tracking-normal text-brand-clay"
          >
            MUTAVAATIR
          </Link>
        </div>
        <p className="px-6 pt-6 pb-2 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-earth">
          Admin
        </p>
        <div className="scrollbar-brand flex-1 overflow-y-auto pb-6">{navList}</div>
        <div className="border-t border-brand-earth p-4">
          <p className="mb-3 truncate text-xs text-brand-earth" title={userEmail ?? undefined}>
            {userEmail ?? 'Signed in'}
          </p>
          <SignOutButton className="w-full justify-center" />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-brand-earth bg-brand-void/95 px-4 backdrop-blur-md sm:px-6 lg:h-20 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="admin-mobile-nav"
              className="inline-flex h-9 w-9 items-center justify-center text-brand-dust transition-colors hover:text-brand-mist lg:hidden"
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              href="/admin"
              className="font-display truncate text-xl font-normal leading-none tracking-normal text-brand-clay lg:hidden"
            >
              MUTAVAATIR
            </Link>
            <span className="font-display hidden text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-earth lg:inline">
              Admin Console
            </span>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <span className="max-w-[18rem] truncate text-xs text-brand-dust" title={userEmail ?? undefined}>
              {userEmail ?? '—'}
            </span>
            <SignOutButton />
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div
            id="admin-mobile-nav"
            className="scrollbar-brand fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-brand-mist/15 bg-brand-void/95 backdrop-blur-md backdrop-saturate-150 lg:hidden"
          >
            <p className="px-4 pt-6 pb-2 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-earth">
              Admin
            </p>
            {navList}
            <div className="mt-6 border-t border-brand-earth p-4">
              <p
                className="mb-3 truncate text-xs text-brand-earth"
                title={userEmail ?? undefined}
              >
                {userEmail ?? 'Signed in'}
              </p>
              <SignOutButton className="w-full justify-center" />
            </div>
          </div>
        ) : null}

        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
