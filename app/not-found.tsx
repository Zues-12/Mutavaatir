import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-[calc(100vh-5.25rem)] bg-brand-void px-4 py-20 text-center lg:min-h-[calc(100vh-6rem)]"
        tabIndex={-1}
      >
        <p className="font-display text-7xl font-normal leading-none tracking-tight text-brand-clay sm:text-8xl">
          404
        </p>
        <h1 className="mt-6 font-display text-2xl font-normal tracking-normal text-brand-mist sm:text-3xl">
          This page could not be found.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-earth">
          The link may be broken, or the page may have been removed.
        </p>
        <Link
          href="/"
          className="font-display mt-10 inline-block bg-brand-clay px-8 py-3.5 text-sm font-bold tracking-wide text-brand-void shadow-md transition-all duration-300 hover:bg-brand-mist hover:shadow-lg"
        >
          BACK TO HOME
        </Link>
      </main>
    </>
  )
}
