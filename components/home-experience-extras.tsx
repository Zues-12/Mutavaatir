import Image from 'next/image'
import { OriginLink, originCircleColors } from '@/components/origin-button'

export default function HomeExperienceExtras() {
  return (
    <section
      aria-labelledby="experience-heading"
      className="paper-texture bg-brand-mist py-12 lg:py-24"
    >
      <div>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 px-10 lg:grid-cols-[1.05fr_1fr] lg:px-0">
            <div className="relative min-h-[320px] overflow-hidden  bg-brand-void lg:min-h-0 lg:rounded-none">
              <Image
                src="/month-experience.webp"
                alt="Wrapped monthly book package"
                fill
                className="object-cover object-[0%_50%]"
                sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc(100vw - 5rem), 50vw"
              />
            </div>
            <div className="flex flex-col justify-center py-8 lg:px-12">
              <h2
                id="experience-heading"
                className="font-display text-4xl leading-none font-medium tracking-tight text-brand-void sm:text-5xl"
              >
                THIS MONTH'S EXPERIENCE
              </h2>
              <p className="mt-4 max-w-lg text-xl leading-relaxed text-brand-earth">
                Thoughtfully wrapped. Beautifully curated.
                <br />A book, a bookmark, and a little joy
                <br />
                delivered just for you.
              </p>
              <OriginLink
                href="/subscribe"
                circleColor={originCircleColors.mist}
                labelClassName="transition-colors duration-300 group-hover:text-brand-void"
                className="font-display mt-6 w-fit bg-brand-void px-7 py-3 text-sm tracking-wide text-brand-mist"
              >
                SUBSCRIBE NOW
              </OriginLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
