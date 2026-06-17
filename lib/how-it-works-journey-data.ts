import type { LucideIcon } from 'lucide-react'
import {
  BookOpenText,
  ClipboardList,
  PackageOpen,
  Search,
  Truck,
  Wand2,
} from 'lucide-react'

export type JourneyIllustrationId =
  | 'preferences'
  | 'curating'
  | 'searching'
  | 'packing'
  | 'delivery'
  | 'reading'

export const journeyIllustrationSources: Record<
  JourneyIllustrationId,
  string | readonly string[]
> = {
  preferences: '/SVGs/subscription-form.svg',
  curating: '/SVGs/man-thinking.svg',
  searching: '/SVGs/library.svg',
  packing: '/SVGs/delivery-van.svg',
  delivery: '/SVGs/package-box.svg',
  reading: ['/SVGs/reading0.svg', '/SVGs/reading1.svg', '/SVGs/reading2.svg'],
}

export type JourneyCheckpoint = {
  readonly id: string
  readonly number: string
  readonly icon: LucideIcon
  readonly illustration: JourneyIllustrationId
  readonly tag: string
  readonly title: string
  readonly description: string
  readonly details: readonly string[]
}

export type JourneyPhrase = {
  readonly text: string
  readonly align: 'left' | 'right' | 'center'
}

export const journeyHighlights = [
  { label: 'Thoughtful steps', value: '6' },
  { label: 'Handpicked titles', value: '100%' },
  { label: 'Cities served', value: '10+' },
  { label: 'Customers satisfied', value: '20+' },
] as const

export const journeyCheckpoints: JourneyCheckpoint[] = [
  {
    id: 'preferences',
    number: '01',
    icon: ClipboardList,
    illustration: 'preferences',
    tag: 'Your preferences',
    title: 'Submit your form',
    description:
      'Tell us what you love to read — genres, moods, authors you adore, and topics you want to explore.',
    details: [
      'Takes about 3 minutes',
      'Share genres, pace & mood',
      'No wrong answers — just honesty',
    ],
  },
  {
    id: 'curating',
    number: '02',
    icon: Wand2,
    illustration: 'curating',
    tag: 'Curated for you',
    title: 'We pick your book',
    description:
      'Our team reads between the lines of your form and selects a title that feels written for you.',
    details: [
      'Human curation, not algorithms',
      'Matched to your taste profile',
      'Every pick is intentional',
    ],
  },
  {
    id: 'searching',
    number: '03',
    icon: Search,
    illustration: 'searching',
    tag: 'Behind the scenes',
    title: 'Searching the shelves',
    description:
      'We browse trusted libraries and bookstores, comparing editions until one feels unmistakably yours.',
    details: [
      'Sourced from quality vendors',
      'Edition & condition checked',
      'Shortlisted with care',
    ],
  },
  {
    id: 'packing',
    number: '04',
    icon: PackageOpen,
    illustration: 'packing',
    tag: 'Delivered with care',
    title: 'We pack & ship',
    description:
      'Your book is wrapped, cushioned, and sealed — ready for the journey from our hands to yours.',
    details: [
      'Protective packaging',
      'Personal note inside',
      'Quality-checked before dispatch',
    ],
  },
  {
    id: 'delivery',
    number: '05',
    icon: Truck,
    illustration: 'delivery',
    tag: 'On its way',
    title: 'Heading your way',
    description:
      'Your parcel travels across Pakistan — tracked, protected, and making its way to your doorstep.',
    details: [
      'Nationwide delivery',
      'Tracking updates shared',
      'Handled with care in transit',
    ],
  },
  {
    id: 'reading',
    number: '06',
    icon: BookOpenText,
    illustration: 'reading',
    tag: 'Yours to keep',
    title: 'You read & enjoy',
    description:
      'Unbox your surprise, settle in, and lose yourself in a story chosen just for you — yours to keep forever.',
    details: [
      'No returns needed',
      'Build your personal library',
      'A new chapter every month',
    ],
  },
]

export const journeyPhrases: JourneyPhrase[] = [
  { text: 'telling us what you love', align: 'right' },
  { text: 'searching the library shelves', align: 'left' },
  { text: 'packing your parcel with care', align: 'right' },
  { text: 'on the road to you', align: 'center' },
  { text: 'waiting at your doorstep', align: 'left' },
]
