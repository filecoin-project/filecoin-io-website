// Agents page ("Filecoin for Agents") copy, section by section in page order (Figma 417:3972 to
// 430:9061). The closing "Start building today" cards are the homepage's (START_CARDS).

import { PATHS } from '@/constants/paths'

import { offHome, START_CARDS, type StartCard } from '@/data/home'
import { CONTACT } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

/** The agents docs: the hero's Read Docs and every Learn More on the page go here. */
const AGENTS_DOCS = 'https://docs.filecoin.io/core-concepts/filecoin-for-agents'

export const PATH = PATHS.PRODUCTS_AGENTS.path
export const TITLE = 'Filecoin for Agents'

/** Where "Install Skills" goes; from the approved Skills/MCP page copy. */
const SKILLS_REPO = 'https://github.com/filecoin-project/filecoin-skills'

export const HERO = {
  // The first line opens on "Agents do the work." then takes turns naming agents; assistive tech
  // reads `label`.
  title: [
    {
      rotate: [
        'Agents do the',
        'Claude does the',
        'ChatGPT does the',
        'Grok does the',
      ],
      rest: 'work.',
    },
    'Filecoin keeps it.',
  ],
  label: 'Agents do the work. Filecoin keeps it.',
  body: 'Give your agents the ability to publish what they build, share context across sessions, and keep a record of every action.',
  primary: {
    label: 'Install Skills',
    href: SKILLS_REPO,
    ref: 'agent-skills-install',
  },
  secondary: {
    label: 'Read Docs',
    href: AGENTS_DOCS,
    ref: 'agent-skills-read-docs',
  },
} as const

export const USES: { title: string; cards: FeatureCard[] } = {
  title: '3 ways to use Filecoin for your agents',
  cards: [
    {
      art: 'publish-artifacts',
      title: 'Publish Artifacts',
      body: 'Your agent creates everything from reports to dashboards to landing pages, with “Publish skill” you can get a link to share with anyone.',
      link: {
        label: 'Learn More',
        href: AGENTS_DOCS,
        ref: 'agent-skills-uses-docs-1',
      },
    },
    {
      art: 'share-sessions',
      title: 'Share Sessions',
      body: 'Switching models or handing over to a teammate? Keep your agent’s context intact and easy to pick up anywhere.',
      link: {
        label: 'Learn More',
        href: 'https://github.com/FIL-Builders/filecoin-clawdi',
        ref: 'agent-skills-share-sessions',
      },
    },
    {
      art: 'keep-a-record',
      title: 'Keep a record',
      body: 'Log what your agent did and why, in a tamper-evident record you can review for debugging, governance, or compliance.',
      link: { label: 'Coming soon', soon: true },
    },
  ],
}

export const SKILLS = {
  title: 'Get started with Agents',
  body: 'One storage account, three ways in',
  options: [
    {
      title: 'Skills',
      body: 'Ready-made agent skills for storing and retrieving on Filecoin. Drop them into Claude, ChatGPT, or any agent that reads skills.',
      code: 'filecoin-project/filecoin-skills',
      link: {
        label: 'View on GitHub',
        href: SKILLS_REPO,
        ref: 'agent-skills-view-github',
      },
    },
    {
      title: 'CLI',
      body: 'Store, retrieve, list, and delete files and folders from any shell. Every command writes one JSON result an agent can act on.',
      code: 'filecoin put ./report.pdf',
      badge: 'COMING SOON',
    },
    {
      title: 'MCP server',
      body: 'Read-only tools for providers, data sets, pieces, payment rails, and session keys. Point your agent at one endpoint, with no sign-up.',
      badge: 'COMING SOON',
    },
  ],
} as const

/** The homepage's closing cards; "Get started" points at the homepage's two-step section. */
export const START: StartCard[] = offHome(START_CARDS.cards)

export const TRAINING = {
  title: 'Training models on massive data?',
  body: 'For teams with over 100 TB of data we can build the right setup for your pipeline to reduce costs.',
  cta: { label: 'Chat with us', href: CONTACT, ref: 'agent-skills-talk-sales' },
} as const
