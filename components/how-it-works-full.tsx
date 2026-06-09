import HowItWorksExpandableSteps from '@/components/how-it-works-expandable-steps'

export default function HowItWorksFull() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-page-hero-heading"
      className="bg-brand-mist py-14 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:max-w-6xl lg:px-10 xl:max-w-7xl xl:px-12">
        <HowItWorksExpandableSteps />
      </div>
    </section>
  )
}
