import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Wand2, BookOpenText, PackageOpen } from 'lucide-react'
import Image from 'next/image'

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
    description:
      'Fill out our short form to help us know your reading preferences.',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'WE PICK YOUR BOOK',
    description:
      'We handpick a book just for you based on your set preferences.',
  },
  {
    number: '03',
    icon: PackageOpen,
    title: 'WE PACK & SHIP',
    description:
      'Your book is packed with care and shipped right to your doorstep.',
  },
  {
    number: '04',
    icon: BookOpenText,
    title: 'YOU READ & ENJOY',
    description:
      'Unbox, read, and enjoy a story picked just for you — yours to keep forever.',
  },
]

const STEP_CARD_BG = '#efe8df'

export default function HowItWorksFull() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative isolate overflow-hidden bg-[#efe8df] py-0"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#efe8df]"
        aria-hidden
      >
        <Image
          src="/how-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={82}
          priority={false}
        />
      </div>

      <div className="relative z-10 w-full max-w-none px-0">
        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[minmax(17rem,36%)_minmax(0,1fr)]">
          <aside className="relative flex min-w-0 flex-col justify-center px-6 py-6 md:px-10 md:py-8 lg:px-10 lg:py-8 xl:px-12">
            <div className="relative z-10 flex w-full flex-col">
              <h2
                id="how-heading"
                className="font-display text-4xl leading-tight font-normal tracking-normal text-brand-void sm:text-5xl lg:text-6xl"
              >
                HOW IT WORKS
              </h2>
              <p className="mt-4 font-display text-lg leading-relaxed text-brand-earth sm:text-xl lg:text-base xl:text-lg">
                Simple. Personal. Meaningful.
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-earth/90">
                Here’s how your curated subscription comes together—step by step.
              </p>
            </div>
          </aside>

          <div className="relative flex min-w-0 flex-col px-5 py-5 md:px-8 md:py-6 lg:px-10 lg:py-6 xl:px-14 xl:py-8">
            <div className="relative">
              {/* Vertical timeline */}
              <div
                className="absolute top-8 bottom-32 left-[15px] w-px bg-brand-clay/35 md:left-[17px] lg:bottom-36"
                aria-hidden
              />

              <ol className="relative m-0 list-none space-y-4 p-0 md:space-y-5">
                {steps.map((step) => {
                  const Icon = step.icon
                  return (
                    <li key={step.number} className="relative pl-11 md:pl-12">
                      {/* Circle on timeline */}
                      <span
                        className="absolute top-1/2 left-[10px] z-10 size-[11px] -translate-y-1/2 rounded-full border-2 border-brand-clay/70 bg-[#efe8df] md:left-[12px]"
                        aria-hidden
                      />

                      <article
                        className="rounded-2xl border border-brand-clay/20 px-4 py-4 shadow-[0_2px_16px_rgba(13,13,13,0.06)] md:px-6 md:py-5"
                        style={{ backgroundColor: STEP_CARD_BG }}
                      >
                        <div className="flex min-h-[6.5rem] flex-col items-stretch gap-0 sm:min-h-0 sm:flex-row sm:items-center">
                          {/* Step number */}
                          <div className="flex w-full shrink-0 items-center justify-center py-2 sm:w-[4.5rem] sm:justify-end sm:py-0 md:w-24 md:pr-2">
                            <span
                              className="font-display text-3xl font-normal tabular-nums text-brand-dust/85 sm:text-4xl md:text-[2.5rem] md:leading-none"
                              aria-hidden
                            >
                              {step.number}
                            </span>
                          </div>

                          <div
                            className="hidden h-16 w-px shrink-0 bg-brand-clay/35 sm:block md:h-20"
                            aria-hidden
                          />

                          {/* Icon in ring */}
                          <div className="flex w-full shrink-0 items-center justify-center py-3 sm:w-[5.5rem] sm:py-0 md:w-28">
                            <div className="flex size-[4.25rem] items-center justify-center rounded-full border border-brand-earth/35 bg-white/40 md:size-[4.5rem]">
                              <Icon
                                className="size-8 text-brand-earth md:size-9"
                                strokeWidth={1.35}
                                aria-hidden
                              />
                            </div>
                          </div>

                          <div
                            className="hidden h-16 w-px shrink-0 bg-brand-clay/35 sm:block md:h-20"
                            aria-hidden
                          />

                          {/* Title + body */}
                          <div className="flex min-w-0 flex-1 flex-col justify-center border-t border-brand-clay/20 pt-4 sm:border-t-0 sm:pl-5 sm:pt-0 md:pl-6">
                            <h3 className="font-display text-xs font-semibold leading-snug tracking-wide text-brand-earth sm:text-sm">
                              {step.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-brand-earth/95 sm:text-sm">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ol>

              <footer className="relative z-10 mt-6 flex flex-col items-center gap-4 md:mt-8">
                <p className="text-center font-display text-sm italic text-brand-earth md:text-base">
                  “Every book is chosen with intention.”
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
