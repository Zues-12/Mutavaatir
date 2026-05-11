'use client'

import { useCallback, useId, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { primaryNavLinks } from '@/lib/navigation'

const MOBILE_NAV_ID = 'primary-mobile-navigation'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const disclosureId = useId()

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-wider text-amber-100 font-display"
        >
          MUTAVAATIR
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-xs font-bold tracking-wider text-stone-500 transition-colors duration-300 hover:text-amber-100 font-display"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-amber-100 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="bg-amber-100 px-6 py-3 text-xs font-bold tracking-wider text-stone-950 shadow-md transition-all duration-300 hover:bg-amber-200 hover:shadow-lg font-display"
          >
            SUBSCRIBE NOW
          </button>
        </div>

        <button
          type="button"
          className="text-amber-100 transition-colors hover:text-amber-200 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls={MOBILE_NAV_ID}
          id={disclosureId}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          {mobileOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
        </button>
      </div>

      {mobileOpen ? (
        <nav
          id={MOBILE_NAV_ID}
          className="border-t border-stone-800 pb-6 md:hidden"
          aria-label="Mobile primary navigation"
        >
          <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-xs font-semibold tracking-widest text-stone-400 transition-colors hover:text-amber-100 font-display"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="mt-4 w-full bg-amber-100 px-6 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-200 font-display"
            >
              SUBSCRIBE NOW
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
