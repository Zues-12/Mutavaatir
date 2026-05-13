export type ReaderReview = {
  readonly quote: string
  readonly name: string
}

/** Curated quotes shown on the full reviews page (and homepage carousel subset). */
export const allReaderReviews: readonly ReaderReview[] = [
  {
    quote:
      'Every month feels like Christmas! The books are always thoughtful and totally my vibe.',
    name: 'AYESHA',
  },
  {
    quote:
      'I love how Mutavaatir understands my taste so well. The surprise factor is the best part!',
    name: 'HAMZA',
  },
  {
    quote: 'Beautifully packed, amazing bookmarks, and great books. Worth every single penny.',
    name: 'ZOYA',
  },
  {
    quote:
      'The curation feels human, not algorithmic. I have discovered authors I would never have picked myself.',
    name: 'SARA',
  },
  {
    quote: 'Consistent quality, respectful packaging, and delivery I can rely on across the city.',
    name: 'BILAL',
  },
  {
    quote: 'My monthly reset. I wait for the box the way I used to wait for new episodes of a favorite show.',
    name: 'MARIA',
  },
  {
    quote:
      'I gift subscriptions to family now — it is the easiest present that still feels deeply personal.',
    name: 'OMAR',
  },
  {
    quote: 'The selection honors slower, deeper reading. No fluff, just stories that stay with you.',
    name: 'FATIMA',
  },
  {
    quote: 'Clear communication, honest branding, and books that match what I asked for on the form.',
    name: 'HASSAN',
  },
] as const
