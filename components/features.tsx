import type { LucideIcon } from 'lucide-react'
import { BookOpen, Package, Bookmark, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type Feature = {
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
}

const features: Feature[] = [
  {
    icon: BookOpen,
    title: 'HANDPICKED BOOKS',
    description: 'Thoughtfully chosen reads that inspire, educate and elevate.',
  },
  {
    icon: Package,
    title: 'MONTHLY DELIVERY',
    description: 'A carefully packed surprise, delivered to your doorstep every month.',
  },
  {
    icon: Bookmark,
    title: 'EXCLUSIVE EXTRAS',
    description: 'Receive limited edition bookmarks and other curated items.',
  },
  {
    icon: Users,
    title: 'TRUSTED BY READERS',
    description: 'Building a community of readers who value quality and authenticity.',
  },
]

export default function Features() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-amber-100 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="about-heading" className="sr-only">
          What you get with Mutavaatir
        </h2>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isNotLast = index !== features.length - 1
            return (
              <li
                key={feature.title}
                className={cn(
                  'flex flex-col items-start space-y-4 pb-8 md:pb-0',
                  isNotLast ? 'md:border-r md:border-amber-800/30 md:pr-8 lg:pr-6' : ''
                )}
              >
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-amber-900 shadow-md">
                  <Icon size={32} className="text-amber-100" strokeWidth={1.5} aria-hidden />
                </div>
                <article className="space-y-2">
                  <h3 className="text-sm leading-tight font-bold tracking-wider text-stone-900 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-stone-700">{feature.description}</p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
