import Link from 'next/link'
import { Instagram, Mail, Twitter } from 'lucide-react'
import FooterNewsletterForm from '@/components/footer-newsletter-form'
import FooterTextVideoMask from '@/components/footer-text-video-mask'
import { siteConfig } from '@/lib/site'

const learnMoreLinks = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'What you get', href: '/#about' },
  { label: "This month's experience", href: '/#experience-heading' },
  { label: 'What makes us different', href: '/#difference-heading' },
] as const

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plans & pricing', href: '/pricing' },
  { label: 'Reader reviews', href: '/reviews' },
  { label: 'Terms & conditions', href: '/terms' },
] as const

const socialLinkClass =
  'flex h-10 w-10 items-center justify-center rounded-full border border-brand-dust/40 text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-clay'

const navLinkClass =
  'text-sm leading-relaxed text-brand-dust transition-colors hover:text-brand-clay'

const columnTitleClass = 'font-display text-sm font-semibold tracking-wide text-brand-clay'

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-brand-earth bg-brand-void"
      aria-labelledby="site-footer-heading"
    >
      <FooterTextVideoMask />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-11 pt-10 md:px-8 md:pb-20 md:pt-16 lg:pt-20 xl:pb-36">
        <h2 id="site-footer-heading" className="sr-only">
          Site footer and newsletter
        </h2>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-10 xl:gap-14">
          {/* Brand */}
          <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left">
            <Link
              href="/"
              className="font-display text-3xl font-normal leading-[1.05] tracking-normal text-brand-clay transition-colors hover:text-brand-mist lg:text-4xl"
            >
              MUTAVAATIR
            </Link>
            <p className="font-display mt-2 text-sm font-normal tracking-wider text-brand-clay lg:text-base">
              A BOOK. CHOSEN FOR YOU.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-dust hidden md:block">
              {siteConfig.description}
            </p>
          </div>

          {/* Learn more */}
          <nav aria-labelledby="footer-learn-heading" className="flex flex-col items-center sm:items-start">
            <h3 id="footer-learn-heading" className={columnTitleClass}>
              Learn more
            </h3>
            <ul className="mt-6 flex flex-col items-center gap-3 sm:items-start">
              {learnMoreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links */}
          <nav aria-labelledby="footer-quick-heading" className="flex flex-col items-center sm:items-start">
            <h3 id="footer-quick-heading" className={columnTitleClass}>
              Quick links
            </h3>
            <ul className="mt-6 flex flex-col items-center gap-3 sm:items-start">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="flex flex-col items-center text-center sm:col-span-2 sm:items-start sm:text-left lg:col-span-1">
            <h3 className={columnTitleClass}>Join the community</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-dust">
              Occasional updates on new drops, reading notes, and subscription news. No spam.
            </p>
            <FooterNewsletterForm className="mt-6 w-full max-w-md lg:max-w-none" />
          </div>
        </div>

        <div className="mt-8 flex w-full flex-row items-center justify-between gap-3 pt-0 md:mt-10 xl:mt-14">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-4">
            <p className="shrink-0 text-xs font-medium tracking-wide text-brand-clay">Follow us on</p>
            <nav aria-label="Social links" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              <Link href="#" className={socialLinkClass} aria-label="Instagram (link coming soon)">
                <Instagram size={18} strokeWidth={1.5} aria-hidden />
              </Link>
              <Link href="#" className={socialLinkClass} aria-label="X / Twitter (link coming soon)">
                <Twitter size={18} strokeWidth={1.5} aria-hidden />
              </Link>
              <Link href="#" className={socialLinkClass} aria-label="Email (link coming soon)">
                <Mail size={18} strokeWidth={1.5} aria-hidden />
              </Link>
            </nav>
          </div>
          <p className="max-w-[min(100%,11rem)] shrink-0 text-right text-[0.65rem] leading-snug tracking-normal text-brand-dust sm:max-w-none sm:text-xs md:text-sm">
            © <time dateTime="2026">2026</time> {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
