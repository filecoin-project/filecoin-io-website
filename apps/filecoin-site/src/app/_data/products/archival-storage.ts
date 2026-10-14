// Archival Storage page copy, section by section in page order (Figma 432:17733 to 432:18190).
// Every call to action on the page is "Schedule a call".

import { PATHS } from '@/constants/paths'

import { CONTACT } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

export const PATH = PATHS.PRODUCTS_ARCHIVAL_STORAGE.path
export const TITLE = 'Archival Storage'

const TALK_TO_US = CONTACT

export const HERO = {
  // Broken to leave room for the animated stack on the right.
  title: ['A place to keep your backups', 'for years, for much less cost'],
  body: 'Backups, media libraries, and records on Filecoin archival storage for data that you need to keep but barely touch.',
  primary: { label: 'Schedule a call', href: TALK_TO_US },
} as const

export const USES: { title: string; cards: FeatureCard[] } = {
  title: '3 ways to use Filecoin Archival Storage',
  cards: [
    {
      art: 'backups-and-records',
      title: 'Backups and records',
      body: 'Database backups, system snapshots, and record files that you don’t need every day.',
    },
    {
      art: 'media-archives',
      title: 'Media archives',
      body: 'Video libraries and raw footage that need to be preserved.',
    },
    {
      art: 'datasets-and-models',
      title: 'Datasets and models',
      body: 'Training data and model checkpoints from past projects.',
    },
  ],
}

export const SET_UP = {
  title: ['Archival storage is set up with you', 'for your needs'],
  body: 'Tell us how much data you have and how often you’d need it back. We’ll come back with a plan.',
  primary: { label: 'Schedule a call', href: TALK_TO_US },
} as const
