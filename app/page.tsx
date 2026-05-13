import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Features from '@/components/features'
import WhatIsMutavaatir from '@/components/what-is-mutavaatir'
import HomeReviews from '@/components/home-reviews'
import HowItWorksHome from '@/components/how-it-works-home'
import WhatMakesDifferent from '@/components/what-makes-different'
import HomeExperienceExtras from '@/components/home-experience-extras'
import Footer from '@/components/footer'
import { OrganizationJsonLd } from '@/components/json-ld'

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-brand-void" tabIndex={-1}>
        <Hero />
        <Features />
        <WhatIsMutavaatir />
        <HomeReviews />
        <HowItWorksHome />
        <WhatMakesDifferent />
        <HomeExperienceExtras />
        
        <Footer />
      </main>
    </>
  )
}
