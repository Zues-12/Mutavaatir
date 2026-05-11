import { Instagram, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Left - Logo & Tagline */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-bold text-amber-100 mb-1 tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
              MUTAVAATIR
            </h3>
            <p className="text-xs text-stone-600 tracking-widest leading-relaxed" style={{ fontFamily: 'Oswald, sans-serif' }}>
              A BOOK. CHOSEN FOR YOU.
            </p>
          </div>

          {/* Center - Copyright */}
          <div className="flex items-center justify-center">
            <p className="text-xs text-stone-600 text-center tracking-wide">
              © 2024 Mutavaatir. All rights reserved.
            </p>
          </div>

          {/* Right - Social Links */}
          <div className="flex items-center justify-end gap-8">
            <Link
              href="#"
              className="text-stone-500 hover:text-amber-100 transition-colors duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </Link>
            <Link
              href="#"
              className="text-stone-500 hover:text-amber-100 transition-colors duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter size={18} strokeWidth={1.5} />
            </Link>
            <Link
              href="#"
              className="text-stone-500 hover:text-amber-100 transition-colors duration-300 hover:scale-110"
              aria-label="Email"
            >
              <Mail size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
