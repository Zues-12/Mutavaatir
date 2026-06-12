import type { Metadata } from 'next'
import HowItWorksJourneyDemo from '@/components/how-it-works-journey-demo'
import Footer from '@/components/footer'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'How It Works Demo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function HowItWorksDemoPage() {
  return (
    <>
      <HowItWorksJourneyDemo />
      <Footer />
    </>
  )
}
