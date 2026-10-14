// Pricing page copy and figures, section by section in page order: the three ways to store on
// Filecoin, each as a card. The warm storage card is shared with the Warm Storage page.

import { PATHS } from '@/constants/paths'

import { offHome, START_CARDS, type StartCard } from '@/data/home'
import { CONTACT, STORE } from '@/data/links'

export const PATH = PATHS.PRICING.path
export const TITLE = 'Pricing'

const TALK = { label: 'Talk to an expert', href: CONTACT }
const FIL_ONE = 'https://fil.one'

export const HERO = {
  /** Each line starts on its own line; it still wraps on its own on narrow screens. */
  title: ['Open storage you control,', 'at a lower cost'],
  body: 'Filecoin is an open storage network. Your data stays portable, stored with more than one provider, and under your control. It’s used by teams from enterprise platforms to simple onramps.',
  primary: { ...TALK, ref: 'pricing-talk-sales-hero' },
  secondary: { label: 'Store data', href: STORE, ref: 'pricing-store-data' },
} as const

export type Offer = {
  name: string
  /** One line on who the offer is for. */
  body: string
  /** `from` is the short line above the amount ("From", "Flat rate"); `note` is a line under it. */
  price: { from: string; amount: string; unit: string; note?: string }
  bestFor: string
  features: string[]
  cta: { label: string; href: string; ref?: string }
  /** Kept for the Warm Storage page's card; the pricing page's cards have none. */
  tags?: string[]
}

export const WARM_STORAGE: Offer = {
  name: 'Filecoin Warm Storage',
  body: 'For files you read and write often.',
  price: { from: 'From', amount: '$2.50', unit: 'per TB per month' },
  bestFor: 'Apps, datasets and media libraries in daily use',
  features: [
    'Upload and fetch files with a few lines of code',
    'Fetch files from anywhere, with faster delivery as an option',
    'Pay month by month for what you store',
  ],
  cta: {
    label: 'Get started',
    href: 'https://filecoin.cloud/',
    ref: 'pricing-warm-get-started',
  },
}

export const ARCHIVAL_STORAGE: Offer = {
  name: 'Filecoin Archival Storage',
  body: 'For data you keep for years but rarely open.',
  // Confirm with MPG before launch: the old site said $4, Slack said $2, possibly with two
  // copies required. $2 with two copies is used here until it is confirmed.
  price: { from: 'From', amount: '$2.00', unit: 'per TB per month' },
  bestFor: 'Backups, media archives and old datasets',
  features: [
    'Room to grow from terabytes to petabytes',
    'Set up with our team around how much you have and how often you need it back',
  ],
  cta: {
    label: 'Schedule a call',
    href: CONTACT,
    ref: 'pricing-archival-talk-sales',
  },
}

export const ENTERPRISE_STORAGE: Offer = {
  name: 'Fil One Enterprise Storage',
  body: 'For teams that already use Amazon S3 tools.',
  // Fil One's published list price (fil.one/pricing, checked 12 October 2026).
  price: {
    from: 'Flat rate',
    amount: '$5.99',
    unit: 'per TB per month',
  },
  bestFor: 'Companies moving storage they already run on S3',
  features: [
    'Works with the S3 tools and libraries you already use',
    'Files are encrypted before they leave your systems',
    'Control who can see and change each bucket',
    'Lock in capacity for 1, 3 or 5 years',
  ],
  cta: {
    label: 'Visit Fil One',
    href: FIL_ONE,
    ref: 'pricing-enterprise-filone',
  },
}

/** The hero's plan card: each plan by a short name, priced as its card below. */
export const HERO_PLANS = [
  { label: 'Warm', offer: WARM_STORAGE },
  { label: 'Archival', offer: ARCHIVAL_STORAGE },
  { label: 'Enterprise', offer: ENTERPRISE_STORAGE },
].map(({ label, offer: { price } }) => ({
  label,
  from: price.from,
  amount: price.amount,
  unit: price.unit,
}))

export const PLANS: { title: string; body: string; offers: Offer[] } = {
  title: 'Three ways to store on Filecoin',
  body: 'Warm storage for data you use often, archival storage for data you keep, and enterprise storage if you already work with S3.',
  offers: [WARM_STORAGE, ARCHIVAL_STORAGE, ENTERPRISE_STORAGE],
}

export const CHOOSE = {
  title: ['Not sure what storage', 'solution to choose?'],
  body: "Tell us about your needs, and we'll guide you to the Filecoin solution that fits best.",
  primary: { ...TALK, ref: 'pricing-talk-sales-closing' },
} as const

/** The homepage's closing cards; "Get started" points at the homepage's two-step section. */
export const START: StartCard[] = offHome(START_CARDS.cards)
