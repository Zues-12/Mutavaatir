'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { OriginButton, originCircleColors } from '@/components/origin-button'

const SCROLL_THRESHOLD = 360

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    })
  }, [prefersReducedMotion])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed bottom-5 right-4 z-40 sm:bottom-8 sm:right-6"
        >
          <OriginButton
            type="button"
            onClick={scrollToTop}
            circleColor={originCircleColors.mist}
            aria-label="Scroll to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-earth/35 bg-brand-clay text-brand-void shadow-[0_8px_24px_-6px_rgba(13,13,13,0.45)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-6px_rgba(13,13,13,0.52)] sm:h-12 sm:w-12"
          >
            <ChevronUp className="h-5 w-5" strokeWidth={2} aria-hidden />
          </OriginButton>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
