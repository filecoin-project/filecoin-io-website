// The partnership form ("Partner With Us"): copy, fields and dropdown options. Shared by the
// dialog, which renders it, and the /api/partner route handler, which validates submissions
// against it.

export const PARTNER_FORM = {
  title: 'Partner With Us',
  body: "Interested in partnering with Filecoin? Tell us a little about your organization and what you'd like to explore.",
  submit: 'Submit Partnership Inquiry',
  sent: {
    title: 'Thanks for your interest in partnering with Filecoin.',
    body: "Our team will review your inquiry and reach out if there's a potential fit.",
    close: 'Done',
  },
  error: "We couldn't send your inquiry. Please try again in a moment.",
} as const

export const PARTNERSHIP_OPTIONS = [
  'Technology / Product Integration',
  'Storage Infrastructure / Reseller',
  'Business Development / Strategic Partnership',
  'Ecosystem / Developer Partnership',
  'Other / Not Sure',
] as const

export const FIELDS = {
  fullName: { label: 'Full name', placeholder: 'Ada Lovelace' },
  email: { label: 'Work email', placeholder: 'ada@company.com' },
  company: {
    label: 'Company / Organization',
    placeholder: 'Organization name',
  },
  type: {
    label: 'What type of partnership are you interested in?',
    placeholder: 'Select one',
  },
  details: {
    label: "Tell us briefly what you'd like to explore.",
    placeholder:
      'A few lines on your organization and the partnership you have in mind.',
  },
} as const

/** One submission, as the dialog posts it and the sheet stores it. */
export type PartnerSubmission = {
  fullName: string
  email: string
  company: string
  type: (typeof PARTNERSHIP_OPTIONS)[number]
  details: string
  /** The page the form was sent from, e.g. "/". */
  page: string
}

/** Longest value accepted per field. */
export const LIMITS = {
  fullName: 120,
  email: 254,
  company: 120,
  details: 4000,
  page: 200,
} as const
