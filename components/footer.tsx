import Link from 'next/link'
import { Instagram, Mail, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      id="faq"
      className="border-t border-brand-earth bg-brand-void py-16"
      aria-labelledby="faq-heading"
    >
      <h2 id="faq-heading" className="sr-only">
        FAQs and contact
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <p className="font-display mb-1 text-lg font-normal leading-tight tracking-normal text-brand-mist">
              MUTAVAATIR
            </p>
            <p className="font-display text-xs font-normal leading-relaxed tracking-normal text-brand-earth">
              A BOOK. CHOSEN FOR YOU.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <p className="text-center text-xs tracking-wide text-brand-earth">
              ©{' '}
              <time dateTime="2026">2026</time> Mutavaatir. All rights reserved.
            </p>
          </div>

          <nav aria-label="Social links" className="flex items-center justify-end gap-8">
            <Link
              href="#"
              className="text-brand-clay transition-colors duration-300 hover:scale-110 hover:text-brand-mist"
              aria-label="Instagram (link coming soon)"
            >
              <Instagram size={18} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="#"
              className="text-brand-clay transition-colors duration-300 hover:scale-110 hover:text-brand-mist"
              aria-label="X / Twitter (link coming soon)"
            >
              <Twitter size={18} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="#"
              className="text-brand-clay transition-colors duration-300 hover:scale-110 hover:text-brand-mist"
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
