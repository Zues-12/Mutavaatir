import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Wand2, Package, BookOpen } from 'lucide-react'

type Step = {
  readonly number: string
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
}

const steps: Step[] = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'SUBMIT YOUR FORM',
    description: 'Fill out our short form to help us know your reading preferences.',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'WE PICK YOUR BOOK',
    description: 'We handpick a book just for you based on your answers.',
  },
  {
    number: '03',
    icon: Package,
    title: 'WE PACK & SHIP',
    description: 'Your book is packed with care and shipped to your doorstep.',
  },
  {
    number: '04',
    icon: BookOpen,
    title: 'YOU READ & ENJOY',
    description: 'Unbox, read and discover your next favorite book.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="bg-brand-mist py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col justify-start lg:col-span-4">
            <h2
              id="how-heading"
              className="mb-8 text-5xl leading-tight font-normal tracking-normal text-brand-void lg:text-6xl font-display"
            >
              HOW IT
              <br />
              WORKS
            </h2>
            <div className="mb-8 h-px w-12 bg-brand-clay" aria-hidden />
            <p className="text-sm leading-relaxed font-normal tracking-normal text-brand-earth font-display">
              Simple. Personal.
              <br />
              Meaningful.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2 md:gap-12 lg:gap-12 [&>li:nth-child(-n+2)]:border-b [&>li:nth-child(-n+2)]:border-brand-dust [&>li:nth-child(-n+2)]:pb-8 lg:[&>li:nth-child(-n+2)]:border-b-0 lg:[&>li:nth-child(-n+2)]:pb-0">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <li key={step.number}>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-1 items-start gap-4">
                        <div className="shrink-0 pt-1">
                          <span
                            className="text-2xl font-normal tracking-normal text-brand-clay lg:text-3xl font-display"
                            aria-hidden
                          >
                            {step.number}
                          </span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Icon size={28} className="text-brand-clay" strokeWidth={1.5} aria-hidden />
                          </div>
                          <h3 className="text-sm leading-tight font-normal tracking-normal text-brand-void font-display">
                            {step.title}
                          </h3>
                          <p className="text-xs leading-relaxed text-brand-earth">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
