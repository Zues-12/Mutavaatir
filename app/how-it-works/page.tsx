import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import HowItWorksFull from '@/components/how-it-works-full'
import Footer from '@/components/footer'

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-brand-void" tabIndex={-1}>
        <Hero />
        <HowItWorksFull />
        <Footer />
      </main>
    </>
  )
}
