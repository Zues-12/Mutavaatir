import type { Metadata } from 'next'
import Hero from '@/components/hero'
import Features from '@/components/features'
import WhatIsMutavaatir from '@/components/what-is-mutavaatir'
import HomeReviews from '@/components/home-reviews'
import HowItWorksHome from '@/components/how-it-works-home'
import WhatMakesDifferent from '@/components/what-makes-different'
import HomeExperienceExtras from '@/components/home-experience-extras'
import HomeLastCtaBanner from '@/components/home-last-cta-banner'
import Footer from '@/components/footer'
import { publicPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata: Metadata = publicPageMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href="/hero-vids/hero3.webm"
        as="video"
        type="video/webm"
      />
      <Hero />
      <Features />
      <WhatIsMutavaatir />
      <HomeReviews />
      <HowItWorksHome />
      <WhatMakesDifferent />
      <HomeExperienceExtras />
      <HomeLastCtaBanner />
      <Footer />
    </>
  )
}
