// Filecoin Drive page copy, section by section in page order. Filecoin Drive is the consumer app at
// pin.filecoin.cloud, a drive for everyday files: connect a wallet, top up with USDFC, upload, then
// open and share. Written for everyday users rather than developers, so the network's terms stay
// out of the hero and come in lower down in plain words. No Figma frame yet. Confirm the copy, and
// the "two copies" figure, before launch.

import { PATHS } from '@/constants/paths'

import { DRIVE } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'
import type { HowStep } from '@/components/sections/product/HowSteps'

export const PATH = PATHS.PRODUCTS_DRIVE.path
export const TITLE = 'Filecoin Drive'

/** The on-page "How it works" section, for the hero's second button. */
const HOW_ID = 'how-it-works'

export const HERO = {
  /** Each line starts on its own line; it still wraps on its own on narrow screens. */
  title: ['Your files, kept safe', 'and always yours'],
  body: 'Store your photos, documents and videos, open them from any browser, and share them with a link.',
  primary: { label: 'Open Drive', href: DRIVE, ref: 'drive-open-hero' },
  secondary: { label: 'How it works', href: `#${HOW_ID}` },
} as const

export const FEATURES: { title: string; body: string; cards: FeatureCard[] } = {
  title: 'A home for the files that matter',
  body: 'Drive works like the cloud drives you know, but your files live on Filecoin, an open network no single company controls.',
  cards: [
    {
      art: 'replicated-across-providers',
      title: 'Kept safe in two places',
      body: 'Every file is stored as two copies, with two separate companies, so it never depends on just one.',
    },
    {
      art: 'addressed-by-content',
      title: 'Share with a link',
      body: 'Send anyone a link to a file. They can open it right in their browser.',
    },
    {
      art: 'intact-by-design',
      title: 'Know it’s still there',
      body: 'Drive keeps checking that your files are stored exactly as you saved them, and shows you the proof.',
    },
  ],
}

export const HOW: {
  sectionId: string
  title: string
  body: string
  steps: HowStep[]
} = {
  sectionId: HOW_ID,
  title: 'Get started in four steps',
  body: 'From your first upload to your first shared link.',
  steps: [
    {
      title: 'Connect your wallet',
      body: 'A crypto wallet, in your browser or on your phone, is your Drive account.',
    },
    {
      title: 'Add storage credit',
      body: 'Top up with USDFC, a digital dollar. You only pay for what you store.',
    },
    {
      title: 'Upload your files',
      body: 'Drag in photos, documents or videos, just like any other drive.',
    },
    {
      title: 'Open and share',
      body: 'Open your files from any browser, or send someone a link.',
    },
  ],
}

export const CLOSING = {
  title: ['Bring your files', 'to Filecoin Drive'],
  body: 'Open Drive and upload your first file.',
  primary: { label: 'Open Drive', href: DRIVE, ref: 'drive-open-closing' },
  secondary: { label: 'See pricing', href: PATHS.PRICING.path },
} as const
