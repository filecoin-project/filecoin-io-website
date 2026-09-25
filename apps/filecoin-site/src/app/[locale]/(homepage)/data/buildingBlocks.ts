import {
  ArchiveIcon,
  ArrowsClockwiseIcon,
  BroadcastIcon,
  CubeIcon,
  CurrencyDollarIcon,
  LightningIcon,
  PushPinIcon,
  RobotIcon,
} from '@phosphor-icons/react/dist/ssr'

import type { IconProps } from '@filecoin-foundation/ui-filecoin/Icon'

import {
  FIL_ONE_URL,
  FILECOIN_CLOUD_DOCS_URL,
  FILECOIN_CLOUD_URL,
  FILECOIN_DOCS_URLS,
} from '@/constants/siteMetadata'

import AkaveLogo from '@/assets/miniatures/akave-miniature.svg'
import CIDgravityLogo from '@/assets/miniatures/cid-gravity-miniature.svg'
import FilOneLogo from '@/assets/miniatures/fil-one-miniature.svg'
import LighthouseLogo from '@/assets/miniatures/lighthouse-miniature.svg'

export type BuildingBlockPill = {
  label: string
  // '#' renders the pill as inert "coming soon"
  href: string
  icon: IconProps['component']
}

export type BuildingBlockRow = {
  category: string
  description: string
  pills: Array<BuildingBlockPill>
}

// Rows follow the product architecture: Filecoin Cloud, IPFS, Agents,
// Ecosystem tooling. Beam, Pay and USDFC stay under Filecoin Cloud.
export const buildingBlocks: Array<BuildingBlockRow> = [
  {
    category: 'Filecoin Cloud',
    description:
      'Warm and cold storage with onchain proofs, fast retrieval, and programmable payments in one SDK.',
    pills: [
      { label: 'Warm storage', href: FILECOIN_CLOUD_URL, icon: LightningIcon },
      {
        label: 'Cold storage',
        href: FILECOIN_DOCS_URLS.storageModel,
        icon: ArchiveIcon,
      },
      { label: 'Filecoin Beam', href: FILECOIN_CLOUD_URL, icon: BroadcastIcon },
      {
        label: 'Filecoin Pay',
        href: FILECOIN_CLOUD_URL,
        icon: ArrowsClockwiseIcon,
      },
      { label: 'USDFC', href: 'https://usdfc.net/', icon: CurrencyDollarIcon },
    ],
  },
  {
    category: 'IPFS',
    description: 'Pinned, content-addressed storage with open retrieval.',
    pills: [
      {
        label: 'Filecoin Pin',
        href: FILECOIN_CLOUD_DOCS_URL,
        icon: PushPinIcon,
      },
      { label: 'IPFS gateways', href: 'https://ipfs.tech/', icon: CubeIcon },
    ],
  },
  {
    category: 'Agents',
    description:
      'Skills, MCP servers, and data services so agents can store and pay for data themselves.',
    pills: [
      // TODO: link once the agent skills / MCP pages exist
      { label: 'Skills and MCP', href: '#', icon: RobotIcon },
    ],
  },
  {
    category: 'Ecosystem tooling',
    description:
      'S3-compatible and turnkey storage products built on Filecoin by ecosystem partners.',
    pills: [
      { label: 'Fil One', href: FIL_ONE_URL, icon: FilOneLogo },
      { label: 'Akave Cloud', href: 'https://akave.com/', icon: AkaveLogo },
      {
        label: 'Lighthouse',
        href: 'https://www.lighthouse.storage/',
        icon: LighthouseLogo,
      },
      {
        label: 'CIDgravity',
        href: 'https://www.cidgravity.com/',
        icon: CIDgravityLogo,
      },
    ],
  },
]
