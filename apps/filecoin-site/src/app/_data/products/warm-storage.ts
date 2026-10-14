// Warm Storage page copy and figures, section by section in page order. Warm storage is the
// Filecoin Cloud service for data that is read and written often: stored by independent
// providers, its integrity proven on-chain, retrievable on demand.

import { PATHS } from '@/constants/paths'

import { GET_STARTED as HOME_GET_STARTED, type CostBar } from '@/data/home'
import { CONTACT, DOCS, START_BUILDING } from '@/data/links'
import type { CodeExample } from '@/data/products/data-storage'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

export const PATH = PATHS.PRODUCTS_WARM_STORAGE.path
export const TITLE = 'Warm Storage'

/** The agent prompt is the homepage's, so the two stay in step. */
const AGENT_PROMPT = HOME_GET_STARTED.prompt

export const HERO = {
  /** Each line starts on its own line; it still wraps on its own on narrow screens. */
  title: ['Everyday storage, built for', 'data you read often'],
  body: 'Keep files, datasets, and media online and ready to retrieve, without being locked in to one provider.',
  primary: { label: 'Start Building', href: START_BUILDING },
  secondary: { label: 'Schedule a call', href: CONTACT },
} as const

export const BUILT_FOR: { title: string; body: string; cards: FeatureCard[] } =
  {
    title: 'Built for data you read and write often',
    body: 'Warm storage keeps your files online and ready to use, with integrity checks built in and no lock-in to one provider.',
    cards: [
      {
        art: 'addressed-by-content',
        title: 'Take it anywhere',
        body: 'Every file gets a content ID (CID). The same data always has the same ID, so you can move it between providers without re-uploading or re-linking.',
      },
      {
        art: 'intact-by-design',
        title: 'Know it’s unchanged',
        body: 'Providers are checked regularly to confirm they still hold your data exactly as you stored it. If a file changes, the ID no longer matches.',
      },
      {
        art: 'replicated-across-providers',
        title: 'Retrieve from any provider',
        body: 'Fetch by content ID from any provider holding your data. Add the optional CDN layer when you want a delivery network in front.',
      },
    ],
  }

export const INTEGRATE: {
  title: string
  body: string
  examples: CodeExample[]
  docs: { label: string; href: string }
} = {
  title: 'Three ways to use warm storage',
  body: 'Pick the one that fits how you work: the command line, your own code, or your agent.',
  examples: [
    {
      id: 'cli',
      label: 'CLI',
      body: 'From the command line',
      icon: 'terminal',
      code: [
        [
          { text: 'npm', accent: true },
          { text: ' install -g filecoin-pin@latest' },
        ],
        [{ text: 'filecoin-pin', accent: true }, { text: ' add ./photo.jpg' }],
      ],
      docs: {
        label: 'Documentation',
        href: 'https://docs.filecoin.io/build-on-filecoin/cookbook/filecoin-pin/getting-started',
      },
    },
    {
      id: 'sdk',
      label: 'SDK',
      body: 'With the Filecoin SDK, in your own code',
      icon: 'code',
      code: [
        [
          { text: 'const', accent: true },
          { text: ' { pieceCid } = await filecoin.storage.upload(file)' },
        ],
      ],
    },
    {
      id: 'agents',
      label: 'Agents',
      body: AGENT_PROMPT.caption,
      icon: 'robot',
      code: [],
      prompt: { label: AGENT_PROMPT.label, lines: AGENT_PROMPT.lines },
    },
  ],
  docs: { label: 'Documentation', href: DOCS },
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
  title: 'Pay 78% less to store more',
  body: 'Independent providers compete for your data storage, so you pay less.',
  axisLabel: '$ per TB / month',
  unit: 'dollars per TB per month',
  valueHeading: '$ per TB per month',
  max: 25,
  step: 5,
  // AWS S3 is its standard tier list price; Filecoin is set so the 78% headline holds (5 / 23).
  // Filebase and Pinata are read off the bar heights in the design. Confirm all four before launch.
  bars: [
    { label: 'Filecoin', value: 5, highlight: true },
    { label: 'Filebase', value: 15 },
    { label: 'Pinata', value: 20 },
    { label: 'AWS S3', value: 23 },
  ],
}

export const CLOSING = {
  title: ['Data that stays yours,', 'wherever it lives'],
  primary: { label: 'Start Building', href: START_BUILDING },
  secondary: { label: 'Schedule a call', href: CONTACT },
} as const
