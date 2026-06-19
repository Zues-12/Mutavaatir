'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const HERO_VIDEO_SRC = '/hero-vids/hero3.webm'
const HERO_POSTER_SRC = '/first_frame.png'

export default function HeroBackgroundVideo() {
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return

    const video = videoRef.current
    if (!video) return

    const markReady = () => setIsReady(true)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady()
    }

    video.addEventListener('loadeddata', markReady)
    video.addEventListener('canplay', markReady)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play()
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(video)

    return () => {
      video.removeEventListener('loadeddata', markReady)
      video.removeEventListener('canplay', markReady)
      observer.disconnect()
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_POSTER_SRC})` }}
        role="img"
        aria-label=""
      />
    )
  }

  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_POSTER_SRC})` }}
        aria-hidden
      />
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        poster={HERO_POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}
