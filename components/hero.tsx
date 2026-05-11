import Image from 'next/image'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-stone-950"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 to-stone-900/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col justify-center space-y-10">
            <h1
              id="hero-heading"
              className="text-5xl leading-tight font-bold tracking-tighter text-amber-100 sm:text-6xl lg:text-7xl font-display"
            >
              A BOOK.
              <br />
              CHOSEN FOR YOU.
              <br />
              DELIVERED MONTHLY.
            </h1>

            <div className="h-px w-16 bg-amber-100" aria-hidden />

            <p className="max-w-md text-sm leading-relaxed tracking-wide text-stone-300">
              Mutavaatir is a monthly book subscription box that brings you handpicked books based
              on meaning, value and timeless reading.
            </p>

            <div id="subscribe" className="flex flex-col gap-6 pt-6 sm:flex-row">
              <button
                type="button"
                className="bg-amber-100 px-8 py-4 text-xs font-bold tracking-wider text-stone-950 shadow-lg transition-all duration-300 hover:bg-amber-200 hover:shadow-xl font-display"
              >
                SUBSCRIBE NOW
              </button>
              <button
                type="button"
                className="border-2 border-stone-500 px-8 py-4 text-xs font-bold tracking-wider text-stone-300 transition-all duration-300 hover:border-amber-100 hover:text-amber-100 font-display"
              >
                LEARN MORE
              </button>
            </div>
          </div>

          <div className="relative flex h-96 items-center justify-center lg:h-[500px]">
            <Image
              src="/mutavaatir-product.jpg"
              alt="Mutavaatir book box with curated reading materials"
              width={1200}
              height={900}
              className="h-full w-full rounded-lg object-cover shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
