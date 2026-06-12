import type { LucideIcon } from 'lucide-react'
import {
  BookOpenText,
  ClipboardList,
  PackageOpen,
  Search,
  Truck,
  Wand2,
} from 'lucide-react'

export type JourneyCheckpoint = {
  readonly id: string
  readonly number: string
  readonly icon: LucideIcon
  readonly tag: string
  readonly title: string
  readonly description: string
}

export type JourneyPhrase = {
  readonly text: string
  readonly align: 'left' | 'right' | 'center'
}

export const journeyCheckpoints: JourneyCheckpoint[] = [
  {
    id: 'preferences',
    number: '01',
    icon: ClipboardList,
    tag: 'Your preferences',
    title: 'Submit your form',
    description:
      'Fill out our short form to help us know your reading preferences.',
  },
  {
    id: 'curating',
    number: '02',
    icon: Wand2,
    tag: 'Curated for you',
    title: 'We pick your book',
    description:
      'We handpick a book just for you based on your set preferences.',
  },
  {
    id: 'searching',
    number: '03',
    icon: Search,
    tag: 'Behind the scenes',
    title: 'Searching the shelves',
    description:
      'We browse, compare, and shortlist titles until one feels unmistakably yours.',
  },
  {
    id: 'packing',
    number: '04',
    icon: PackageOpen,
    tag: 'Delivered with care',
    title: 'We pack & ship',
    description:
      'Your book is packed with care and shipped right to your doorstep.',
  },
  {
    id: 'delivery',
    number: '05',
    icon: Truck,
    tag: 'On its way',
    title: 'Heading your way',
    description:
      'Your parcel travels across Pakistan — tracked, protected, and almost there.',
  },
  {
    id: 'reading',
    number: '06',
    icon: BookOpenText,
    tag: 'Yours to keep',
    title: 'You read & enjoy',
    description:
      'Unbox, read, and enjoy a story picked just for you — yours to keep forever.',
  },
]

export const journeyPhrases: JourneyPhrase[] = [
  { text: 'telling us what you love', align: 'right' },
  { text: 'searching for books', align: 'left' },
  { text: 'packing your parcel', align: 'right' },
  { text: 'on the road to you', align: 'center' },
  { text: 'at your doorstep', align: 'left' },
]
