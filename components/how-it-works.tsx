import { ClipboardList, Wand2, Package, BookOpen, ChevronRight } from 'lucide-react'

const steps = [
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
    <section className="bg-stone-100 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Section */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <h2
              className="text-5xl lg:text-6xl font-bold text-stone-900 mb-8 leading-tight tracking-tight"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              HOW IT
              <br />
              WORKS
            </h2>

            {/* Divider */}
            <div className="w-12 h-px bg-stone-400 mb-8"></div>

            {/* Tagline */}
            <p
              className="text-sm text-stone-700 font-bold tracking-wide leading-relaxed"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Simple. Personal.
              <br />
              Meaningful.
            </p>
          </div>

          {/* Right Section - Steps */}
          <div className="lg:col-span-8">
            <div className="space-y-12 lg:space-y-0 lg:flex lg:flex-col lg:gap-12">
              {/* Top Row - Steps 1 & 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start pb-8 lg:pb-0 border-b border-stone-300 lg:border-b-0">
                {steps.slice(0, 2).map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Number */}
                        <div className="flex-shrink-0 pt-1">
                          <span
                            className="text-2xl lg:text-3xl font-bold text-stone-400"
                            style={{ fontFamily: 'Oswald, sans-serif' }}
                          >
                            {step.number}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Icon size={28} className="text-stone-500" strokeWidth={1.5} />
                          </div>
                          <h3
                            className="text-sm font-bold text-stone-900 tracking-wide leading-tight"
                            style={{ fontFamily: 'Oswald, sans-serif' }}
                          >
                            {step.title}
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {/* Arrow between columns */}
                      {index === 0 && (
                        <div className="hidden md:flex lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
                          <ChevronRight size={24} className="text-stone-400" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bottom Row - Steps 3 & 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {steps.slice(2, 4).map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index + 2} className="flex items-start gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Number */}
                        <div className="flex-shrink-0 pt-1">
                          <span
                            className="text-2xl lg:text-3xl font-bold text-stone-400"
                            style={{ fontFamily: 'Oswald, sans-serif' }}
                          >
                            {step.number}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Icon size={28} className="text-stone-500" strokeWidth={1.5} />
                          </div>
                          <h3
                            className="text-sm font-bold text-stone-900 tracking-wide leading-tight"
                            style={{ fontFamily: 'Oswald, sans-serif' }}
                          >
                            {step.title}
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {/* Arrow between columns */}
                      {index === 0 && (
                        <div className="hidden md:flex lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2">
                          <ChevronRight size={24} className="text-stone-400" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
