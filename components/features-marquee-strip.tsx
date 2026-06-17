import type { Feature } from '@/lib/features-data'
import { features } from '@/lib/features-data'
import { cn } from '@/lib/utils'

function FeatureItem({
  feature,
  className,
}: {
  feature: Feature
  className?: string
}) {
  const Icon = feature.icon

  return (
    <li
      className={cn(
        'flex w-[min(88vw,22rem)] shrink-0 flex-row items-center gap-4 border-r border-brand-earth/30 px-6 sm:w-[26rem] sm:px-8 lg:gap-3',
        className,
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
}

function FeatureGrid({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 md:gap-6 md:gap-y-10 md:px-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8',
        className,
      )}
    >
      {features.map((feature, index) => {
        const showDividerMd = (index + 1) % 2 !== 0
        const showDividerLg = (index + 1) % 4 !== 0

        return (
          <FeatureItem
            key={feature.title}
            feature={feature}
            className={cn(
              'w-auto shrink border-r-0 px-0',
              showDividerMd && 'md:border-r md:pr-10',
              showDividerLg && 'lg:border-r lg:pr-6',
            )}
          />
        )
      })}
    </ul>
  )
}

type FeaturesMarqueeStripProps = {
  className?: string
  id?: string
  headingId?: string
}

export default function FeaturesMarqueeStrip({
  className,
  id,
  headingId = 'features-marquee-heading',
}: FeaturesMarqueeStripProps) {
  const marqueeItems = [...features, ...features]

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('bg-brand-dust py-10 md:py-12', className)}
    >
      <h2 id={headingId} className="sr-only">
        What you get with Mutavaatir
      </h2>

      <div className="motion-reduce:hidden">
        <div className="features-marquee-viewport overflow-hidden">
          <ul
            className="features-marquee-track flex w-max"
            aria-hidden
          >
            {marqueeItems.map((feature, index) => (
              <FeatureItem key={`${feature.title}-${index}`} feature={feature} />
            ))}
          </ul>
        </div>
      </div>

      <div className="hidden motion-reduce:block">
        <FeatureGrid />
      </div>

      <ul className="sr-only">
        {features.map((feature) => (
          <li key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
