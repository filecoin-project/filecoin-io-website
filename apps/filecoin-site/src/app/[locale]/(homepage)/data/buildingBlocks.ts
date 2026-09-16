import {
  ArchiveIcon,
  ArrowsClockwiseIcon,
  BookIcon,
  BracketsCurlyIcon,
  BroadcastIcon,
  CubeIcon,
  CurrencyDollarIcon,
  FileCodeIcon,
  LightningIcon,
  PushPinIcon,
} from '@phosphor-icons/react/dist/ssr'

import type { IconProps } from '@filecoin-foundation/ui-filecoin/Icon'

import {
  FIL_ONE_URL,
  FILECOIN_CLOUD_DOCS_URL,
  FILECOIN_CLOUD_URL,
  FILECOIN_DOCS_URL,
  FILECOIN_DOCS_URLS,
} from '@/constants/siteMetadata'

import AkaveLogo from '@/assets/miniatures/akave-miniature.svg'
import CIDgravityLogo from '@/assets/miniatures/cid-gravity-miniature.svg'
import FilOneLogo from '@/assets/miniatures/fil-one-miniature.svg'
import LighthouseLogo from '@/assets/miniatures/lighthouse-miniature.svg'

export type BuildingBlockPill = {
  label: string
  href: string
  icon: IconProps['component']
}

export type BuildingBlockRow = {
  category: string
  description: string
  pills: Array<BuildingBlockPill>
}

export const buildingBlocks: Array<BuildingBlockRow> = [
  {
    category: 'Storage',
    description:
      'S3-compatible, Warm, archival, and IPFS-pinned storage with onchain proofs.',
    pills: [
      { label: 'Warm storage', href: FILECOIN_CLOUD_URL, icon: LightningIcon },
      {
        label: 'Archival storage',
        href: FILECOIN_DOCS_URLS.storageModel,
        icon: ArchiveIcon,
      },
      { label: 'Filecoin Pin', href: FILECOIN_CLOUD_DOCS_URL, icon: PushPinIcon },
      { label: 'Fil One', href: FIL_ONE_URL, icon: FilOneLogo },
    ],
  },
  {
    category: 'Retrieval and delivery',
    description: 'Fast, paid retrieval and open content-addressed access.',
    pills: [
      { label: 'Filecoin Beam', href: FILECOIN_CLOUD_URL, icon: BroadcastIcon },
      { label: 'IPFS retrieval', href: 'https://ipfs.tech/', icon: CubeIcon },
    ],
  },
  {
    category: 'Payments',
    description: 'Programmable, streaming payments settled onchain.',
    pills: [
      { label: 'Filecoin Pay', href: FILECOIN_CLOUD_URL, icon: ArrowsClockwiseIcon },
      { label: 'USDFC', href: 'https://usdfc.net/', icon: CurrencyDollarIcon },
    ],
  },
  {
    category: 'Developer tools',
    description: 'SDKs, smart contracts, and documentation to build with.',
    pills: [
      { label: 'Synapse SDK', href: FILECOIN_CLOUD_DOCS_URL, icon: BracketsCurlyIcon },
      {
        label: 'Smart contracts (FVM)',
        href: FILECOIN_DOCS_URLS.filecoinVirtualMachine,
        icon: FileCodeIcon,
      },
      { label: 'Documentation', href: FILECOIN_DOCS_URL, icon: BookIcon },
    ],
  },
  {
    category: 'Managed services built on Filecoin',
    description:
      'S3-compatible and turnkey storage products from ecosystem partners.',
    pills: [
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
