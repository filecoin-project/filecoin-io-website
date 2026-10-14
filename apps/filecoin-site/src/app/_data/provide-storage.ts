// Provide Storage page: the copy of filecoin.io/provide-storage, section by section in page
// order, with the calls to action changed to the three agreed ones: learn about providing
// storage (the getting-started docs), start at any size (the agent quickstart) and talk to
// our team (the provider intake form).

import { PATHS } from '@/constants/paths'

import { PROVIDER_FORM } from '@/data/links'

import type { PointIconName } from '@/components/sections/provide/icons'

export const PATH = PATHS.PROVIDE_STORAGE.path
export const TITLE = 'Provide Storage'

/** Planning a provider business: the opportunity, requirements and operating model. */
export const GETTING_STARTED_DOCS =
  'https://docs.filecoin.io/provide-storage/getting-started'
/** The agent-assisted quickstart, opened at its "Start at any size" section. */
export const AGENT_QUICKSTART =
  'https://docs.filecoin.io/provide-storage/agent-quickstart#start-at-any-size'

export const LEARN = {
  label: 'Learn About Providing Storage',
  href: GETTING_STARTED_DOCS,
}
export const START = { label: 'Start at Any Size', href: AGENT_QUICKSTART }
/** The provider intake form, for deployment, economics, partnerships and larger-scale opportunities. */
export const TALK = { label: 'Talk to Our Team', href: PROVIDER_FORM }

export const HERO = {
  /** One designed line; it wraps on its own into the three lines of filecoin.io at desktop widths. */
  title: ["Power the world's largest decentralized storage network"],
  body: "Play a vital role in the future of decentralized storage. Become a Filecoin storage provider and contribute capacity to a global system preserving humanity's most important information.",
  primary: LEARN,
  secondary: TALK,
  image: {
    src: '/assets/images/colorful-nebula.webp',
    alt: 'A vibrant, colorful nebula in deep space, glowing with shades of purple, pink, green, and gold against a dark star-filled background.',
  },
} as const

export type ProviderLogo = {
  name: string
  href: string
  src: string
  width: number
  height: number
}

export const PROVIDERS: { title: string; logos: ProviderLogo[] } = {
  title: 'Join a global network of storage providers',
  logos: [
    {
      name: 'CIDgravity',
      href: 'https://cidgravity.com',
      src: '/assets/logos/providers/cidgravity.svg',
      width: 167,
      height: 50,
    },
    {
      name: 'DCENT',
      href: 'https://dcent.nl/',
      src: '/assets/logos/providers/dcent.svg',
      width: 122,
      height: 24,
    },
    {
      name: 'Future Tech Holdings',
      href: 'https://future-tech-holdings.com/',
      src: '/assets/logos/providers/future-tech-holdings.svg',
      width: 219,
      height: 20,
    },
    {
      name: 'ND Labs',
      href: 'https://www.ndlabs.dev/#/',
      src: '/assets/logos/providers/nd-labs.svg',
      width: 162,
      height: 40,
    },
    {
      name: 'RRM Global',
      href: 'https://www.rrmglobal.io/',
      src: '/assets/logos/providers/rrm-global.svg',
      width: 64,
      height: 40,
    },
    {
      name: 'Swan Chain',
      href: 'https://swanchain.io/',
      src: '/assets/logos/providers/swan-chain.svg',
      width: 189,
      height: 40,
    },
  ],
}

export type Point = { icon: PointIconName; title: string; body: string }

export const PDP: {
  title: string
  body: string
  points: Point[]
  /** The line above the buttons. */
  note: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
} = {
  title: 'Getting started with PDP storage',
  body: 'Running a warm storage node using Proof of Data Possession (PDP) is the easiest way to begin offering Filecoin storage — no expensive hardware or long-term collateral required.',
  points: [
    {
      icon: 'cube',
      title: 'Lowest hardware costs',
      body: 'Warm storage requires minimal infrastructure, making it affordable to start offering storage with just basic compute and disk.',
    },
    {
      icon: 'rocket',
      title: 'Fastest path to becoming a SP',
      body: 'Get online quickly with a simple setup and no sealing hardware — perfect for testing, learning, and onboarding your first clients.',
    },
    {
      icon: 'user-plus',
      title: 'Ideal for new operators and small teams',
      body: 'Operate a reliable, permissionless storage service without managing complex pipelines or large-scale hardware.',
    },
  ],
  note: 'Whether you’re an individual operator or an enterprise data center, Filecoin provides a path to get started.',
  primary: START,
  secondary: {
    label: 'Learn more about PDP Storage',
    href: 'https://docs.filecoin.io/storage-providers/pdp',
  },
}

export const SCALING: {
  title: string
  body: string
  points: Point[]
  link: { label: string; href: string }
} = {
  title: 'Scaling your storage operations',
  body: "If you're already running a warm storage node and want to expand, Filecoin supports enterprise-grade proofs like Proof of Replication (PoRep) and Proof of Spacetime (PoSt) — enabling high-capacity, production-scale storage operations. Scaling involves:",
  points: [
    {
      icon: 'cpu',
      title: 'Dedicated sealing hardware (CPU/GPU)',
      body: 'High-performance machines designed to handle sealing workloads reliably and at scale.',
    },
    {
      icon: 'gauge',
      title: 'High-performance storage pipelines',
      body: 'Optimized data paths that maintain consistent throughput and stable thermal performance.',
    },
    {
      icon: 'lock',
      title: 'Distributed sealing systems',
      body: 'Run parallelized sealing workflows with networked workers and production-grade tooling.',
    },
    {
      icon: 'handshake',
      title: 'Deep support from Filecoin solution architects',
      body: 'Get expert guidance on architecture, scaling strategy, and best practices for large deployments.',
    },
  ],
  link: {
    label: 'Learn more about the requirements',
    href: 'https://docs.filecoin.io/storage-providers/architecture/lotus-components',
  },
}

export const HELP = {
  title: ['Need help choosing', 'the right architecture?'],
  body: 'Our team can guide you through PoRep requirements, recommended hardware, sealing pipelines, and operational best practices.',
  cta: TALK,
} as const
