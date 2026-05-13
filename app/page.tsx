import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
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
      <Navbar />
      <main id="main-content" className="min-h-screen bg-brand-void" tabIndex={-1}>
        <Hero />
        <Features />
        <WhatIsMutavaatir />
        <HomeReviews />
        <HowItWorksHome />
        <WhatMakesDifferent />
        <HomeExperienceExtras />
        <HomeLastCtaBanner />
        <Footer />
      </main>
    </>
  )
}
