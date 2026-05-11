import Image from 'next/image'

export default function Hero() {
  return (
    <section className="bg-stone-950 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 to-stone-900/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-10">
            {/* Headline */}
            <div>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-amber-100 leading-tight tracking-tighter"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                A BOOK.
                <br />
                CHOSEN FOR YOU.
                <br />
                DELIVERED MONTHLY.
              </h1>
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-amber-100"></div>

            {/* Description */}
            <p className="text-sm text-stone-300 max-w-md leading-relaxed tracking-wide">
              Mutavaatir is a monthly book subscription box that brings you handpicked books based on meaning, value and timeless reading.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button
                className="bg-amber-100 text-stone-950 px-8 py-4 font-bold text-xs hover:bg-amber-200 transition-all duration-300 tracking-wider shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                SUBSCRIBE NOW
              </button>
              <button
                className="border-2 border-stone-500 text-stone-300 px-8 py-4 font-bold text-xs hover:border-amber-100 hover:text-amber-100 transition-all duration-300 tracking-wider"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Right Side - Product Image */}
          <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
            <img
              src="/mutavaatir-product.jpg"
              alt="Mutavaatir Book Box with accessories"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
