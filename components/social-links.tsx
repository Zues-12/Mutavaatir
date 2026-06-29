import Link from 'next/link'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { socialLinks } from '@/lib/site'
import { cn } from '@/lib/utils'

const items = [
  {
    href: socialLinks.instagram,
    label: 'Mutavaatir on Instagram',
    icon: Instagram,
  },
  {
    href: socialLinks.facebook,
    label: 'Mutavaatir on Facebook',
    icon: Facebook,
  },
  {
    href: socialLinks.linkedin,
    label: 'Mutavaatir on LinkedIn',
    icon: Linkedin,
  },
] as const

const variantClassName = {
  footer:
    'flex h-10 w-10 items-center justify-center rounded-full border border-brand-dust/40 text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-clay',
  contact:
    'flex h-10 w-10 items-center justify-center rounded-full border border-brand-earth/30 text-brand-void transition-colors hover:border-brand-clay hover:text-brand-clay',
} as const

export default function SocialLinks({
  variant = 'footer',
  className,
}: {
  variant?: keyof typeof variantClassName
  className?: string
}) {
  const linkClassName = variantClassName[variant]

  return (
    <nav aria-label="Social links" className={cn('flex items-center gap-2.5 sm:gap-3', className)}>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={linkClassName}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={18} strokeWidth={1.5} aria-hidden />
        </Link>
      ))}
    </nav>
  )
}
