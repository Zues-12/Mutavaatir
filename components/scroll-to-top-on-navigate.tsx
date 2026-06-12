'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Client-side navigations in the App Router can preserve scroll position.
 * Reset to top whenever the pathname changes (new page), without affecting
 * same-page hash jumps (pathname unchanged).
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
