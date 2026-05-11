import Link from 'next/link'
import { Instagram, Mail, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      id="faq"
      className="border-t border-brand-earth bg-brand-void py-6"
      aria-labelledby="faq-heading"
    >
      <h2 id="faq-heading" className="sr-only">
        FAQs and contact
      </h2>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-3 md:gap-12 lg:gap-14">
          {/* Brand */}
          <div className="flex w-full flex-col items-center gap-0 text-center md:items-start md:text-left">
            <p className="font-display text-3xl font-normal leading-[1.05] tracking-normal text-brand-earth sm:text-4xl lg:text-5xl">
              MUTAVAATIR
            </p>
            <p className="font-display mx-auto w-full max-w-md text-base font-normal leading-relaxed tracking-wider text-brand-earth sm:text-lg md:mx-0 lg:text-xl">
              A BOOK. CHOSEN FOR YOU.
            </p>
          </div>

          {/* Legal */}
          <div className="flex justify-center px-2">
            <p className="max-w-md text-center text-base leading-relaxed tracking-normal text-brand-earth md:text-lg">
              ©{' '}
              <time dateTime="2026">2026</time> Mutavaatir. All rights reserved.
            </p>
          </div>

          {/* Social */}
          <nav
            aria-label="Social links"
            className="flex items-center justify-center gap-8 sm:gap-9 md:justify-end"
          >
            <Link
              href="#"
              className="text-brand-clay transition-colors duration-300 hover:scale-110 hover:text-brand-mist"
              aria-label="Instagram (link coming soon)"
            >
              <Instagram size={28} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="#"
              className="text-brand-clay transition-colors duration-300 hover:scale-110 hover:text-brand-mist"
              aria-label="X / Twitter (link coming soon)"
            >
              <Twitter size={28} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="#"
              className="text-brand-clay transition-colors duration-300 hover:scale-110 hover:text-brand-mist"
              aria-label="Email (link coming soon)"
            >
              <Mail size={28} strokeWidth={1.5} aria-hidden />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
