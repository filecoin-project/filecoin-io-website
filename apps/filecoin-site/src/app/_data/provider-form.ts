// The storage provider intake form at /provide-storage/onboarding: copy, fields and dropdown
// options. Shared by the page, which renders it, and the /api/provider route handler, which
// validates submissions against it. Modelled on filecoin.io/provide-storage/onboarding.

import { PATHS } from '@/constants/paths'

import { AGENT_QUICKSTART, GETTING_STARTED_DOCS } from '@/data/provide-storage'

export const PATH = PATHS.PROVIDE_STORAGE_ONBOARDING.path
export const TITLE = 'Become a Storage Provider'

export const PROVIDER_FORM = {
  /** Each line starts on its own line; it still wraps on its own on narrow screens. */
  title: ['Become a Filecoin', 'storage provider'],
  body: 'Thanks for your interest in providing storage on Filecoin. Tell us about your current or planned operation and our team will review your inquiry and follow up on next steps.',
  submit: 'Submit Inquiry',
  sent: {
    title: 'Inquiry sent.',
    body: 'Thank you for your interest in becoming a Filecoin storage provider. Our team will review your inquiry and follow up.',
    cta: {
      label: 'Read the getting started guide',
      href: GETTING_STARTED_DOCS,
    },
  },
  error: "We couldn't send your inquiry. Please try again in a moment.",
  /** Shown under the goals when the form is sent with none chosen. */
  goalsMissing: 'Choose at least one.',
} as const

/** Self-service onboarding, for those who would rather not wait for a call. */
export const SELF_SERVICE = {
  title: 'Prefer to set up on your own?',
  links: [
    {
      label: 'Getting started',
      body: 'The opportunity, what you need and how providers operate, from one node to a data center.',
      href: GETTING_STARTED_DOCS,
    },
    {
      label: 'Agent quickstart',
      body: 'Start at any size, with an agent walking you or your team through setup.',
      href: AGENT_QUICKSTART,
    },
  ],
} as const

export const OPERATION_OPTIONS = [
  'Small Operator',
  'Small Data Center',
  'Enterprise Data Center',
  'Not sure yet',
] as const

export const CAPACITY_OPTIONS = [
  'Less than 100 TB',
  '100 TB–1 PB',
  '1–10 PB',
  'More than 10 PB',
  'Not sure yet',
] as const

export const GOAL_OPTIONS = [
  'Become a Filecoin storage provider',
  'Expand existing Filecoin operations',
  'Understand provider economics and revenue opportunities',
  'Find storage customers or demand',
  'Explore a commercial partnership',
] as const

export const FIELDS = {
  fullName: { label: 'Full name', placeholder: 'Ada Lovelace' },
  email: { label: 'Work email', placeholder: 'ada@company.com' },
  company: {
    label: 'Company / Organization',
    placeholder: 'Company or organization name',
  },
  operation: {
    label: 'What best describes your current or planned storage operation?',
    placeholder: 'Select one',
  },
  capacity: {
    label:
      'How much storage capacity do you currently operate or plan to deploy?',
    placeholder: 'Select one',
  },
  goals: {
    label: 'What are you looking to accomplish?',
    hint: 'Choose all that apply.',
  },
} as const

/** One submission, as the form posts it and the sheet stores it. */
export type ProviderSubmission = {
  fullName: string
  email: string
  company: string
  operation: (typeof OPERATION_OPTIONS)[number]
  capacity: (typeof CAPACITY_OPTIONS)[number]
  goals: (typeof GOAL_OPTIONS)[number][]
  /** The page the form was sent from. */
  page: string
}

/** Longest value accepted per field. */
export const LIMITS = {
  fullName: 120,
  email: 254,
  company: 120,
  page: 200,
} as const
