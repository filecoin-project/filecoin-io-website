// The contact form ("Talk to sales"): copy, fields and dropdown options. Shared by the dialog,
// which renders it, and the /api/contact route handler, which validates submissions against it.

export const CONTACT_FORM = {
  title: 'Talk to our team',
  body: "Tell us a little about what you're building and we'll get back to you within two working days.",
  submit: 'Send message',
  sent: {
    title: "Thanks, we've got it.",
    body: 'Someone from the Filecoin team will be in touch shortly.',
    close: 'Done',
  },
  error: "We couldn't send your message. Please try again in a moment.",
} as const

export const INTENT_OPTIONS = [
  'Build an application using Filecoin storage',
  'Store or archive large datasets',
  'Integrate Filecoin into an existing product or platform',
  'Offer Filecoin-backed storage to my customers',
  'Explore a partnership',
  'Something else',
] as const

export const VOLUME_OPTIONS = [
  'Less than 1 TB',
  '1–10 TB',
  '10 TB–1 PB',
  'More than 1 PB',
  'Not sure yet',
] as const

export const FIELDS = {
  fullName: { label: 'Full name', placeholder: 'Ada Lovelace' },
  email: { label: 'Work email', placeholder: 'ada@company.com' },
  company: { label: 'Company', placeholder: 'Company name' },
  intent: { label: 'What are you looking to do?', placeholder: 'Select one' },
  project: {
    label: 'Tell us about your project and storage needs',
    placeholder:
      "Tell us about your use case, storage requirements, or what you'd like to discuss.",
  },
  volume: {
    label: 'How much data do you expect to store in the next 12 months?',
    placeholder: 'Select one',
  },
} as const

/** One submission, as the dialog posts it and the sheet stores it. */
export type ContactSubmission = {
  fullName: string
  email: string
  company: string
  intent: (typeof INTENT_OPTIONS)[number]
  project: string
  volume: (typeof VOLUME_OPTIONS)[number]
  /** The page the form was sent from, e.g. "/pricing". */
  page: string
}

/** Longest value accepted per field; the sheet's cells and our patience have limits. */
export const LIMITS = {
  fullName: 120,
  email: 254,
  company: 120,
  project: 4000,
  page: 200,
} as const
