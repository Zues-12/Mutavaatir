import Image from 'next/image'

export default function HomeExperienceExtras() {
  return (
    <section
      aria-labelledby="experience-heading"
      className="paper-texture bg-brand-mist py-0"
    >
      <div>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
            <div className="relative min-h-[320px] overflow-hidden bg-brand-void lg:min-h-0">
              <Image
                src="/month-experience.png"
                alt="Wrapped monthly book package"
                fill
                className="object-cover object-[0%_50%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12">
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
              <button
                type="button"
                className="font-display mt-6 w-fit bg-brand-void px-7 py-3 text-sm tracking-wide text-brand-mist transition-colors duration-300 hover:bg-brand-earth"
              >
                SUBSCRIBE NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
