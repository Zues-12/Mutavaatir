'use client'

import { useEffect, useState } from 'react'
import FooterTextVideoMaskDefault from '@/components/footer-text-video-mask-default'
import FooterTextVideoMaskSafari from '@/components/footer-text-video-mask-safari'

function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|Opera/i.test(ua)
}

export default function FooterTextVideoMask() {
  const [safari, setSafari] = useState<boolean | null>(null)

  useEffect(() => {
    setSafari(isSafari())
  }, [])

  if (safari === null) {
    return <FooterTextVideoMaskDefault />
  }

  return safari ? <FooterTextVideoMaskSafari /> : <FooterTextVideoMaskDefault />
}
