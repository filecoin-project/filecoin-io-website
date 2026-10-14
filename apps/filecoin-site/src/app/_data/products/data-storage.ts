// Data Storage page copy and figures: the overview of the ways to store on Filecoin, section by
// section in page order (Figma 429:502 to 430:8993). `href: null` marks a destination that does
// not exist yet. The Warm Storage product page is ./warm-storage.ts.

import { PATHS } from '@/constants/paths'

import { CONTACT, DOCS, START_BUILDING } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

export const PATH = PATHS.STORE_DATA.path
export const TITLE = 'Data Storage'

export const HERO = {
  /** Each line starts on its own line; it still wraps on its own on narrow screens. */
  title: ['Store data with integrity,', 'for less'],
  body: 'Open, verifiable storage for all your data from files, videos to backups. Check your data’s integrity any time, and take it anywhere.',
  primary: {
    label: 'Start Building',
    href: START_BUILDING,
    ref: 'store-data-start-building-hero',
  },
  secondary: {
    label: 'Schedule a call',
    href: CONTACT,
    ref: 'store-data-talk-sales-hero',
  },
} as const

export const INTEGRITY: { title: string; body: string; cards: FeatureCard[] } =
  {
    title: 'Integrity, built into storage',
    body: 'Your files are identified by what they contain, not where they’re stored, so you can move them anytime.',
    cards: [
      {
        art: 'addressed-by-content',
        title: 'Data Addressed by Content',
        body: 'Every file gets a unique content ID (CID). Same data, same ID, on any provider, in any system.',
      },
      {
        art: 'replicated-across-providers',
        title: 'Replicated across providers',
        body: 'Your data is replicated across independent storage providers, so one outage or one provider leaving doesn’t take your data with it.',
      },
      {
        art: 'intact-by-design',
        title: 'Intact by Design',
        body: 'The ID changes if even one byte of your file changes, so you can always tell your data is exactly what you stored.',
      },
    ],
  }

export type StoragePlan = {
  title: string
  points: string[]
  link: { label: string; href: string | null; ref?: string }
}

export const STORAGE_PLANS: {
  title: string
  body: string
  plans: StoragePlan[]
} = {
  title: 'Three ways to store data on Filecoin',
  body: 'Start with warm storage, archive what you rarely touch, or bring your S3 workflow to enterprise storage.',
  plans: [
    {
      title: 'Warm Storage',
      points: [
        'Store and retrieve data on demand',
        'Multiple independent copies by default',
        'Optional CDN layer for faster delivery',
      ],
      link: {
        label: 'Learn More',
        href: '/products/warm-storage',
        ref: 'store-data-plan-warm-storage',
      },
    },
    {
      title: 'Archival Storage',
      points: [
        'Built for large datasets you write once and rarely read',
        'Scales to petabytes across independent providers',
        'Set up with our team for large volumes',
      ],
      link: {
        label: 'Learn More',
        href: '/products/archival-storage',
        ref: 'store-data-plan-archival-storage',
      },
    },
    {
      title: 'Enterprise Storage',
      points: [
        'S3-compatible object storage from Fil One',
        'Works with the S3 SDKs and CLIs you already use',
        'Client-side encryption and access control',
      ],
      link: {
        label: 'Learn More',
        href: 'https://fil.one',
        ref: 'store-data-plan-filone',
      },
    },
  ],
}

/** A line of code as runs of text; `accent` runs are drawn in the brand blue. */
export type CodeLine = { text: string; accent?: boolean }[]

export type CodeExample = {
  id: string
  label: string
  /** A line under the tab's label, in the tab list. */
  body?: string
  icon: 'upload' | 'download' | 'pin' | 'terminal' | 'code' | 'robot'
  /** A muted line at the top of the card; left out where the tab's `body` already says it. */
  comment?: string
  code: CodeLine[]
  /** This snippet's own documentation link, in place of the block's shared one. */
  docs?: { label: string; href: string; ref?: string }
  /**
   * Shown as the homepage's prompt card (label, Copy pill, monospace lines) in place of the code
   * and the documentation link.
   */
  prompt?: { label: string; lines: readonly string[] }
}

export const GET_STARTED: {
  title: string
  body: string
  examples: CodeExample[]
  docs: { label: string; href: string; ref?: string }
} = {
  title: 'Get started and store your first data',
  body: 'Upload, retrieve, and pin with a few lines of code.',
  examples: [
    {
      id: 'upload',
      label: 'Upload a file',
      icon: 'upload',
      comment: '//upload',
      code: [
        [
          { text: 'const', accent: true },
          { text: ' { pieceCid } = await filecoin.storage.upload(file)' },
        ],
      ],
    },
    {
      id: 'retrieve',
      label: 'Retrieve a file',
      icon: 'download',
      comment: '//retrieve',
      code: [
        [
          { text: 'const', accent: true },
          { text: ' bytes = await filecoin.storage.download({ pieceCid })' },
        ],
      ],
    },
    {
      id: 'pin',
      label: 'Pin a File',
      icon: 'pin',
      comment: '//pin, from the command line',
      code: [
        [{ text: 'filecoin-pin', accent: true }, { text: ' add ./photo.jpg' }],
      ],
    },
  ],
  docs: { label: 'Documentation', href: DOCS, ref: 'store-data-docs' },
}

export const CLOSING = {
  title: ['Full Control on how you store data,', 'lower cost on your bill'],
  primary: {
    label: 'Start Building',
    href: START_BUILDING,
    ref: 'store-data-start-building-closing',
  },
  secondary: {
    label: 'Schedule a call',
    href: CONTACT,
    ref: 'store-data-talk-sales-closing',
  },
} as const
