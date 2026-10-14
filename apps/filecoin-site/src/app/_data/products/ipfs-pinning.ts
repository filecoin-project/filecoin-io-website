// IPFS page copy and figures, section by section in page order (Figma
// 430:17283 to 430:17704). `href: null` marks a destination that does not exist yet; the closing
// "Start building today" cards are the homepage's (START_CARDS).

import { PATHS } from '@/constants/paths'

import { offHome, START_CARDS, type CostBar, type StartCard } from '@/data/home'
import { CONTACT } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

export const PATH = PATHS.PRODUCTS_IPFS.path
export const TITLE = 'IPFS'

/** The on-page "Moving a big IPFS archive?" section. */
const MIGRATE_ID = 'migrate'

/** The IPFS-to-Filecoin migration guide on filecoin.cloud: the hero's "Migrate from IPFS" and the migration card. */
const MIGRATION_GUIDE = 'https://filecoin.cloud/ipfs2filecoin'

export const HERO = {
  title: ['IPFS stored', 'on Filecoin'],
  body: 'Filecoin storage providers hold your files, and you keep using the IPFS tools you already know.',
  primary: {
    label: 'Start Pinning',
    href: 'https://docs.filecoin.io/build-on-filecoin/cookbook/filecoin-pin/getting-started',
  },
  secondary: { label: 'Migrate from IPFS', href: MIGRATION_GUIDE },
} as const

export const USES: { title: string; cards: FeatureCard[] } = {
  title: '3 ways to use IPFS on Filecoin',
  cards: [
    {
      art: 'pin-from-your-terminal',
      title: 'Pin from your terminal',
      body: 'Run one command to pin a file or a folder. You get a CID back and can fetch it from any IPFS gateway.',
      link: {
        label: 'Learn More',
        href: 'https://docs.filecoin.io/build-on-filecoin/cookbook/filecoin-pin/getting-started',
      },
    },
    {
      art: 'pin-migrate-from-another-service',
      title: 'Migrate from another pinning service',
      body: 'Move your whole archive to Filecoin in one go. Your CIDs and links keep working.',
      link: { label: 'Learn More', href: MIGRATION_GUIDE },
    },
    {
      art: 'pin-with-your-agents',
      title: 'Pin with your agents',
      body: 'Add the Filecoin skill to your agent, then ask it to pin a file or folder. It runs the commands and hands you back the CID.',
      link: { label: 'Learn More', href: '/products/agents' },
    },
  ],
}

export const PRICING: {
  title: string
  body: string
  axisLabel: string
  max: number
  step: number
  bars: CostBar[]
  unit: string
  valueHeading: string
} = {
  title: '3X cheaper than the other pinning services',
  body: 'Filecoin storage costs less than a third of what pinning providers charge for the same pinned data.',
  axisLabel: '$ per TB / month',
  unit: 'dollars per TB per month',
  valueHeading: '$ per TB per month',
  max: 70,
  step: 10,
  // Read off the bar heights in the design. Confirm all four, and the plans named, before launch.
  bars: [
    { label: 'Filecoin', note: '(Warm Storage)', value: 5, highlight: true },
    { label: 'Filebase', note: '(Pro Plan)', value: 16 },
    { label: 'Pinata', note: '(Fiesta Plan)', value: 35 },
    { label: 'Pinata', note: '(Picnic Plan)', value: 70 },
  ],
}

export const MIGRATE = {
  sectionId: MIGRATE_ID,
  title: ['Moving a big IPFS archive?'],
  body: 'For archives over 500 GB, we’ll help you plan the migration so your CIDs and links don’t break.',
  primary: { label: 'Chat with us', href: CONTACT },
} as const

/** The homepage's closing cards; "Get started" points at the homepage's two-step section. */
export const START: StartCard[] = offHome(START_CARDS.cards)
