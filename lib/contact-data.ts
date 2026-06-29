export const contactSubjectOptions = [
  { id: 'subscription', label: 'Subscription & billing' },
  { id: 'delivery', label: 'Delivery & tracking' },
  { id: 'curation', label: 'Book curation' },
  { id: 'cancellation', label: 'Cancellation' },
  { id: 'other', label: 'Other' },
] as const

export type ContactSubjectId = (typeof contactSubjectOptions)[number]['id']

export function isValidContactSubject(value: string): value is ContactSubjectId {
  return contactSubjectOptions.some((option) => option.id === value)
}

export const contactConfig = {
  responseNote: 'We typically respond within 2–3 business days.',
  /** Left-panel artwork on the contact page */
  visualImagePath: '/contact-phone.png',
} as const
