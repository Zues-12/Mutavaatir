import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Features from '@/components/features'
import HowItWorks from '@/components/how-it-works'
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
        <HowItWorks />
        <Footer />
      </main>
    </>
  )
}
