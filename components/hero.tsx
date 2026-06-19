import HeroCinematic from '@/components/hero-cinematic'

// Previous animated hero — kept for reference
// import HeroLoadAnimation from '@/components/hero-load-animation'
//
// export default function Hero() {
//   return <HeroLoadAnimation />
// }

// Previous static hero — kept for reference
// import Image from 'next/image'
//
// export default function Hero() {
//   return (
//     <section
//       id="home"
//       className="relative isolate overflow-hidden bg-black"
//       aria-labelledby="hero-heading"
//     >
//       <div
//         className="pointer-events-none absolute inset-y-0 right-0 -z-10 flex items-stretch justify-end"
//         aria-hidden
//       >
//         <Image
//           src="/hero-bg.webp"
//           alt=""
//           width={1920}
//           height={1080}
//           className="h-full w-auto max-w-none object-contain object-right opacity-40 xl:opacity-100"
//           priority
//           quality={100}
//           sizes="(max-width: 1024px) 70vw, 55vw"
//         />
//       </div>
//
//       <div
//         className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgb(0,0,0)_0%,rgba(0,0,0,0)_40%)]"
//         aria-hidden
//       />
//
//       <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-20 lg:px-8 lg:pt-10 lg:pb-24">
//         <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
//           <h1
//             id="hero-heading"
//             className="font-display flex flex-col gap-2 text-4xl leading-tight font-normal tracking-normal sm:text-6xl lg:gap-3 lg:text-7xl"
//           >
//             <span className="text-brand-mist">A BOOK.</span>
//             <span className="text-brand-clay">CHOSEN FOR YOU.</span>
//             <span className="text-brand-clay">DELIVERED MONTHLY.</span>
//           </h1>
//
//           <div className="h-px w-16 bg-brand-mist" aria-hidden />
//
//           <p className="max-w-2xl text-base leading-relaxed tracking-normal text-brand-dust sm:text-xl">
//             Mutavaatir is a monthly book subscription box that brings you handpicked books based
//             on meaning, value and timeless reading.
//           </p>
//
//           <div id="pricing" className="flex flex-col gap-6 pt-2 sm:flex-row sm:pt-4">
//             <button
//               type="button"
//               className="bg-brand-clay px-7 py-3.5 text-sm font-medium tracking-wide text-brand-void shadow-md transition-all duration-300 hover:bg-brand-mist hover:shadow-lg lg:text-[0.95rem] font-display"
//             >
//               SUBSCRIBE NOW
//             </button>
//             <button
//               type="button"
//               className="border-2 border-brand-clay px-8 py-4 text-xs font-medium tracking-normal text-brand-dust transition-all duration-300 hover:border-brand-mist hover:text-brand-mist font-display"
//             >
//               LEARN MORE
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

export default function Hero() {
  return <HeroCinematic />
}
