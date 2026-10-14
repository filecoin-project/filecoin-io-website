// Homepage copy and figures for the new build, section by section in page order.
// Figures are placeholders taken from the Figma file until the live numbers are wired up.

import { CONSOLE, CONTACT, DOCS, STORE } from '@/data/links'

export const HERO = {
  announcement: {
    badge: 'New',
    label: 'Real World Assets Are Onchain. What About the Data Behind Them?',
    /** Shown on phones, where the full title would wrap; screen readers always get `label`. */
    shortLabel: 'Real World Assets Are Onchain.',
    href: '/blog/Real-world-assets-are-onchain-What-about-the-data-behind-them',
  },
  /** Two lines on wider screens; wraps freely on phones. */
  title: ["Storing the internet's", 'most valuable information'],
  body: "Filecoin is the world's largest open storage network, built to keep data secure and sovereign.",
  primary: { label: 'Store data', href: STORE },
  secondary: { label: 'Schedule a call', href: CONTACT },
} as const

export type PartnerLogo = {
  name: string
  href: string
  src: string
  width: number
  height: number
}

/**
 * Logo strip under the hero. Sizes are the SVGs' own dimensions. Every logo here needs the
 * partner's written approval before it ships; keep the approvals thread with the brand team.
 */
export const TRUSTED_BY: { caption: string; logos: PartnerLogo[] } = {
  caption: "Trusted by teams preserving the world's most important data",
  logos: [
    {
      name: 'Internet Archive',
      href: 'https://archive.org',
      src: '/assets/logos/internet-archive.svg',
      width: 111.444,
      height: 33.4304,
    },
    {
      name: 'Flickr Foundation',
      href: 'https://www.flickr.org',
      src: '/assets/logos/flickr.svg',
      width: 111.444,
      height: 33.4304,
    },
    {
      name: 'Starling Lab',
      href: 'https://www.starlinglab.org',
      src: '/assets/logos/starling-lab.svg',
      width: 111.444,
      height: 22.9137,
    },
    {
      name: 'Smithsonian',
      href: 'https://www.si.edu',
      src: '/assets/logos/smithsonian.svg',
      width: 80.84,
      height: 36,
    },
    {
      name: 'University of Maryland',
      href: 'https://geog.umd.edu',
      src: '/assets/logos/university-of-maryland.svg',
      width: 111.444,
      height: 20.7487,
    },
    {
      name: 'Phala',
      href: 'https://phala.network',
      src: '/assets/logos/phala.svg',
      width: 89.125,
      height: 31,
    },
    // OpenSea, Reuters and Wikipedia are out until their logo approvals are on record; the SVGs
    // stay in public/logos so they can be put back as one line each. Dapper and Blackbird are
    // approved and waiting on logo assets.
  ],
}

export const NETWORK_CAPACITY = {
  title: 'Infrastructure at internet scale',
  /** Network storage capacity in GB. */
  value: 1_953_892_249.12,
  decimals: 2,
  unit: 'GB',
  caption: 'of network storage capacity',
} as const

/** A chart bar. `note` is a smaller second line under the label, e.g. the plan compared. */
export type CostBar = {
  label: string
  value: number
  highlight?: boolean
  note?: string
}

export const COST_COMPARISON: {
  title: string
  body: string
  axisLabel: string
  max: number
  step: number
  bars: CostBar[]
} = {
  title: 'Store 4.6X more data for same cost',
  body: 'Filecoin enables you to store more data quickly without worrying about cost.',
  axisLabel: 'Data per $100 (in TB)',
  max: 20,
  step: 5,
  // Filecoin and AWS S3 are set so the 4.6X headline holds (20 / 4.35); the other two are
  // read off the bar heights in the design. Confirm all four before launch.
  bars: [
    { label: 'Filecoin', value: 20, highlight: true },
    { label: 'Filebase', value: 7.1 },
    { label: 'Pinata', value: 5.4 },
    { label: 'AWS S3', value: 4.35 },
  ],
}

export type UseCase = {
  id:
    | 'data-storage'
    | 'backup-archives'
    | 'agent-storage'
    | 'ipfs'
    | 'enterprise'
  title: string
  body: string
  /** The use case's own page. `null` renders a placeholder link until that page is built. */
  href: string | null
}

/** "Store and serve" section: pinned on desktop, stepping through one use case per scroll stretch. */
export const STORAGE_USE_CASES: {
  title: readonly string[]
  intro: string
  linkLabel: string
  steps: UseCase[]
} = {
  title: ['Storage for any', 'type of data'],
  intro:
    "Access and store data in a variety of ways that best fit your app's needs",
  linkLabel: 'Learn More',
  steps: [
    {
      id: 'data-storage',
      title: 'Warm',
      body: 'Store datasets, AI training data and video libraries, and retrieve them on demand. And for data providers, you can provide paid access to your datasets.',
      href: '/products/warm-storage',
    },
    {
      id: 'backup-archives',
      title: 'Archival',
      body: 'Keep backups, media archives, and records you need to hold onto for years.',
      href: '/products/archival-storage',
    },
    {
      id: 'agent-storage',
      title: 'Agent',
      body: 'Let your agents publish what they build, share sessions across tools, and keep a record of every action.',
      href: '/products/agents',
    },
    {
      id: 'ipfs',
      title: 'IPFS',
      body: 'Pin your IPFS content on Filecoin. Your CIDs, IPNS names and gateway links keep working, backed by verifiable storage.',
      href: '/products/ipfs',
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      body: 'S3-compatible object storage from Fil One. Use the S3 SDKs and CLIs you already have, with client-side encryption and access control.',
      href: 'https://fil.one',
    },
  ],
}

export type Feature = { icon: string; title: string; body: string }

/** "You can do a whole lot more": a grid of further products. */
export const MORE_FEATURES: { title: string; items: Feature[] } = {
  title: 'You can do a whole lot more',
  items: [
    {
      icon: '/assets/icons/features/media-hosting.svg',
      title: 'Media Hosting',
      body: 'From videos that you build to videos that your agents create, host and share them easily with Filecoin',
    },
    {
      icon: '/assets/icons/features/agent-skills.svg',
      title: 'Skills and MCP Server',
      body: 'Give your agent Filecoin skills, a CLI and an MCP server, so it can store and share on its own.',
    },
    {
      icon: '/assets/icons/features/paid-access.svg',
      title: 'Paid Data Access',
      body: 'Host datasets on Filecoin and charge for access, so the data you provide pays for itself.',
    },
    {
      icon: '/assets/icons/features/migrate-ipfs.svg',
      title: 'Migrate from IPFS',
      body: 'Move large IPFS archives to Filecoin in one pass. Your CIDs and links keep working',
    },
    {
      icon: '/assets/icons/features/sites-hosting.svg',
      title: 'Sites Hosting',
      body: 'From landing pages to static front-ends, host and share with a public link.',
    },
    {
      icon: '/assets/icons/features/agent-sessions.svg',
      title: 'Shared Agent Sessions',
      body: 'Store your agent context on Filecoin enabling easy retrieval across models and frameworks.',
    },
  ],
}

/** "The world's data, stored by the world": storage provider call to action over the globe. */
export const STORAGE_PROVIDERS = {
  title: 'The world’s data, stored by the world',
  body: 'Run storage on Filecoin and earn rewards for the data you host',
  cta: { label: 'Become a storage provider', href: '/provide-storage' },
} as const

/** "Get started in two steps": create an account, then hand your agent a prompt. */
export const GET_STARTED = {
  title: 'Get started in two steps',
  account: {
    title: 'Create your account',
    href: CONSOLE,
    caption: 'Sign up in the Filecoin Console to set up your account',
    image: {
      src: '/assets/illustrations/console-funds.svg',
      width: 620,
      height: 440,
      alt: "The Filecoin Console's funds overview: balance, available funds and how long storage is paid for",
    },
  },
  prompt: {
    title: 'Prompt your Agent',
    caption: 'Works with Claude, Cursor, Codex, and more',
    label: 'Prompt',
    lines: [
      'Install the Filecoin Pin CLI and pin a test file to Filecoin.',
      'Run npm install -g filecoin-pin@latest, then filecoin-pin payments setup, then create a text file and run filecoin-pin add on it.',
    ],
  },
} as const

export type AgentLogo = {
  name: string
  src: string
  width: number
  height: number
}

/** "Works with all your agents": a continuously scrolling logo strip. Sizes are the SVGs' own. */
export const AGENTS: { title: string; logos: AgentLogo[] } = {
  title: 'Works with all your agents',
  logos: [
    {
      name: 'Vercel',
      src: '/assets/logos/agents/vercel.svg',
      width: 179.483,
      height: 35.8623,
    },
    {
      name: 'Claude',
      src: '/assets/logos/agents/claude.svg',
      width: 186.667,
      height: 40,
    },
    {
      name: 'Cursor',
      src: '/assets/logos/agents/cursor.svg',
      width: 168.294,
      height: 40,
    },
    {
      name: 'Grok',
      src: '/assets/logos/agents/grok.svg',
      width: 128,
      height: 48,
    },
    {
      name: 'ChatGPT',
      src: '/assets/logos/agents/chatgpt.svg',
      width: 171.4,
      height: 40,
    },
  ],
}

export type StartCard = {
  icon: string
  title: string
  body: string
  href: string | null
}

/** For the same cards on other pages: any in-page anchor points back at the homepage. */
export const offHome = (cards: StartCard[]): StartCard[] =>
  cards.map((card) =>
    card.href?.startsWith('#') ? { ...card, href: `/${card.href}` } : card,
  )

/** The three ways in, as cards. */
export const START_CARDS: { title: string; body: string; cards: StartCard[] } =
  {
    title: 'Start building today',
    body: 'Read the quickstart and store your first file in minutes, or talk to our team about your workload.',
    cards: [
      {
        icon: '/assets/icons/start/documentation.svg',
        title: 'Documentation',
        body: 'Read our quickstart guide',
        href: DOCS,
      },
      {
        icon: '/assets/icons/start/get-started.svg',
        title: 'Get started',
        body: 'Store your files in minutes',
        href: STORE,
      },
      {
        icon: '/assets/icons/start/talk-to-sales.svg',
        title: 'Talk to sales',
        body: 'Talk to us and find the right fit',
        href: CONTACT,
      },
    ],
  }
