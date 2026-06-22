'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { OriginLink, originCircleColors } from '@/components/origin-button'
import { primaryNavLinks } from '@/lib/navigation'
import { cn } from '@/lib/utils'

const MOBILE_NAV_ID = 'primary-mobile-navigation'

const navLinkClassName =
  'group relative font-display text-xs font-bold tracking-wide text-brand-mist transition-colors duration-300 hover:text-brand-clay xl:text-sm xl:tracking-wider'

function navHrefIsActive(pathname: string, href: string) {
  if (href.includes('#')) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const ctaClassName =
  'font-display bg-brand-clay font-bold tracking-wide text-brand-void shadow-md transition-shadow duration-300 hover:shadow-lg px-4 py-2 text-xs xl:px-7 xl:py-3.5 xl:text-sm xl:tracking-wider'

const HOME_NAV_SOLID_SCROLL_PX = 120

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [homeNavOpacity, setHomeNavOpacity] = useState(isHome ? 0 : 1)
  const disclosureId = useId()

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    if (!isHome) {
      setHomeNavOpacity(1)
      return
    }

    const updateOpacity = () => {
      const progress = Math.min(1, window.scrollY / HOME_NAV_SOLID_SCROLL_PX)
      setHomeNavOpacity(progress)
    }

    updateOpacity()
    window.addEventListener('scroll', updateOpacity, { passive: true })
    return () => window.removeEventListener('scroll', updateOpacity)
  }, [isHome])

  useEffect(() => {
    if (!mobileOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <>
    <header
      className={cn(
        'site-header sticky top-0 z-50 border-b',
        !isHome && 'border-brand-earth bg-brand-void',
        mobileOpen && 'border-brand-earth bg-brand-void',
      )}
      style={{
        viewTransitionName: 'site-header',
        ...(isHome && !mobileOpen
          ? {
              backgroundColor: `rgb(13 13 13 / ${homeNavOpacity})`,
              borderBottomColor: `rgb(123 98 68 / ${homeNavOpacity})`,
            }
          : undefined),
      }}
    >
      <div className="mx-auto flex h-21 max-w-7xl items-center gap-3 px-4 sm:px-6 md:gap-6 lg:h-24 lg:gap-8 lg:px-8 xl:gap-10">
        <Link
          href="/"
          className="font-display shrink-0 text-3xl font-normal leading-none tracking-normal text-brand-clay xl:text-5xl"
        >
          MUTAVAATIR
        </Link>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center justify-center md:ml-8 md:flex md:gap-x-6 lg:ml-14 lg:gap-x-7 xl:ml-16 xl:gap-x-8"
        >
          {primaryNavLinks.map((link) => {
            const active = navHrefIsActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(navLinkClassName, active && 'text-brand-clay')}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-px bg-brand-clay transition-all duration-300',
                    active ? 'w-full' : 'w-0 group-hover:w-full',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="hidden shrink-0 md:block">
          <OriginLink
            href="/subscribe"
            circleColor={originCircleColors.mist}
            className={ctaClassName}
          >
            SUBSCRIBE NOW
          </OriginLink>
        </div>

        <button
          type="button"
          className="relative z-60 -mr-1 ml-auto flex h-11 w-11 shrink-0 items-center justify-center bg-transparent text-brand-dust [-webkit-tap-highlight-color:transparent] md:hidden"
          aria-expanded={mobileOpen}
          aria-controls={MOBILE_NAV_ID}
          id={disclosureId}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          {mobileOpen ? <X size={28} aria-hidden /> : <Menu size={28} aria-hidden />}
        </button>
      </div>
    </header>

    {mobileOpen ? (
      <nav
        id={MOBILE_NAV_ID}
        aria-label="Mobile primary navigation"
        className="scrollbar-brand fixed inset-x-0 top-21 bottom-0 z-40 overflow-y-auto border-t border-brand-earth bg-brand-void md:hidden"
      >
        <div className="mx-auto flex max-h-full min-h-0 max-w-7xl flex-col px-4 pt-10 pb-10 sm:px-6 sm:pt-11 lg:px-8">
          <div className="space-y-5">
            {primaryNavLinks.map((link) => {
              const active = navHrefIsActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-display block border-l-2 border-transparent py-1 pl-3 text-sm font-semibold tracking-wide transition-colors hover:text-brand-dust',
                    active
                      ? 'border-brand-clay text-brand-clay'
                      : 'text-brand-mist hover:border-brand-earth/40',
                  )}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
          <OriginLink
            href="/subscribe"
            circleColor={originCircleColors.mist}
            className="font-display mt-8 flex w-full justify-center bg-brand-clay px-6 py-3.5 text-base font-bold tracking-wide text-brand-void shadow-md transition-shadow duration-300 hover:shadow-lg"
            onClick={closeMobile}
          >
            SUBSCRIBE NOW
          </OriginLink>
        </div>
      </nav>
    ) : null}
    </>
  )
}
