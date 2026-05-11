'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'HOW IT WORKS', href: '#how-it-works' },
    { label: 'SUBSCRIBE', href: '#subscribe' },
    { label: 'REVIEWS', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
    { label: 'CONTACT', href: '#contact' },
  ]

  return (
    <nav className="bg-stone-950 border-b border-stone-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="#" className="flex-shrink-0">
            <span className="text-lg font-bold text-amber-100 tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
              MUTAVAATIR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-bold text-stone-500 hover:text-amber-100 transition-colors duration-300 tracking-wider relative group"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-100 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-6">
            <button className="bg-amber-100 text-stone-950 px-6 py-3 font-bold text-xs hover:bg-amber-200 transition-all duration-300 tracking-wider shadow-md hover:shadow-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>
              SUBSCRIBE NOW
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-amber-100 hover:text-amber-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-xs font-semibold text-stone-400 hover:text-amber-100 transition-colors tracking-widest"
                style={{ fontFamily: 'Oswald, sans-serif' }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button className="w-full bg-amber-100 text-stone-950 px-6 py-3 font-bold text-sm hover:bg-amber-200 transition-colors mt-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
              SUBSCRIBE NOW
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
