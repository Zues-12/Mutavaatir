import Link from 'next/link'
import { Instagram, Mail, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-stone-800 bg-stone-950 py-16"
      aria-labelledby="contact-heading"
    >
      <h2 id="contact-heading" className="sr-only">
        Contact and social links
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <p className="mb-1 text-lg font-bold tracking-wider text-amber-100 font-display">
              MUTAVAATIR
            </p>
            <p className="text-xs leading-relaxed tracking-widest text-stone-600 font-display">
              A BOOK. CHOSEN FOR YOU.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <p className="text-center text-xs tracking-wide text-stone-600">
              ©{' '}
              <time dateTime="2026">2026</time> Mutavaatir. All rights reserved.
            </p>
          </div>

          <nav aria-label="Social links" className="flex items-center justify-end gap-8">
            <Link
              href="#"
              className="text-stone-500 transition-colors duration-300 hover:scale-110 hover:text-amber-100"
              aria-label="Instagram (link coming soon)"
            >
              <Instagram size={18} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="#"
              className="text-stone-500 transition-colors duration-300 hover:scale-110 hover:text-amber-100"
              aria-label="X / Twitter (link coming soon)"
            >
              <Twitter size={18} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="#"
              className="text-stone-500 transition-colors duration-300 hover:scale-110 hover:text-amber-100"
              aria-label="Email (link coming soon)"
            >
              <Mail size={18} strokeWidth={1.5} aria-hidden />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
