'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Client-side navigations in the App Router can preserve scroll position.
 * Reset to top whenever the pathname changes (new page), without affecting
 * same-page hash jumps (pathname unchanged).
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
