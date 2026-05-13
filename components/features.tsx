import type { LucideIcon } from 'lucide-react'
import { BookOpen, Package, Bookmark, Users, BookOpenIcon, LibraryBig, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type Feature = {
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
}

const features: Feature[] = [
  {
    icon: LibraryBig,
    title: "CURATED BOOKS",
    description:
      "Thoughtfully chosen reads that inspire, educate and elevate.",
  },
  {
    icon: Package,
    title: "MONTHLY DELIVERY",
    description:
      "A carefully packed surprise, delivered to your doorsteps.",
  },
  {
    icon: Bookmark,
    title: "EXCLUSIVE EXTRAS",
    description: "Receive limited edition bookmarks and other curated items.",
  },
  {
    icon: ShieldCheck,
    title: "ORIGINAL BOOKS",
    description:
      "Only 100% original books, no pirated or discarded books that no one read.",
  },
];

export default function Features() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-brand-dust py-10 md:py-12"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 id="about-heading" className="sr-only">
          What you get with Mutavaatir
        </h2>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 md:gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const showDividerMd = (index + 1) % 2 !== 0
            const showDividerLg = (index + 1) % 4 !== 0
            return (
              <li
                key={feature.title}
                className={cn(
                  'flex flex-row items-center gap-4 lg:gap-3',
                  showDividerMd &&
                    'md:border-r md:border-brand-earth/30 md:pr-10',
                  showDividerLg &&
                    'lg:border-r lg:border-brand-earth/30 lg:pr-6'
                )}
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-earth shadow-md md:h-24 md:w-24 lg:h-20 lg:w-20 xl:h-24 xl:w-24">
                  <Icon
                    className="h-9 w-9 text-brand-mist md:h-11 md:w-11 lg:h-8 lg:w-8 xl:h-11 xl:w-11"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <article className="min-w-0 flex-1 space-y-1">
                  <h3 className="font-display text-lg leading-snug font-medium tracking-normal text-brand-void md:text-xl lg:text-base xl:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-snug text-brand-earth md:text-sm lg:text-xs xl:text-sm">
                    {feature.description}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
