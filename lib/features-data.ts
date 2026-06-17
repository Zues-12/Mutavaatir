import type { LucideIcon } from 'lucide-react'
import { Bookmark, LibraryBig, Package, ShieldCheck } from 'lucide-react'

export type Feature = {
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
}

export const features: Feature[] = [
  {
    icon: LibraryBig,
    title: 'CURATED BOOKS',
    description: 'Thoughtfully chosen reads that inspire, educate and elevate.',
  },
  {
    icon: Package,
    title: 'MONTHLY DELIVERY',
    description: 'A carefully packed surprise, delivered to your doorsteps.',
  },
  {
    icon: Bookmark,
    title: 'EXCLUSIVE EXTRAS',
    description: 'Receive limited edition bookmarks and other curated items.',
  },
  {
    icon: ShieldCheck,
    title: 'ORIGINAL BOOKS',
    description:
      'Only 100% original books, no pirated or discarded books that no one read.',
  },
]
