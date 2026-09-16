import {
  BuildingsIcon,
  CodeIcon,
  CpuIcon,
  RobotIcon,
  RocketIcon,
} from '@phosphor-icons/react/dist/ssr'

import type { IconProps } from '@filecoin-foundation/ui-filecoin/Icon'
import type { StaticImageProps } from '@filecoin-foundation/utils/types/imageType'

import { PATHS } from '@/constants/paths'

import { graphicsData } from '@/data/graphicsData'

export type NetworkRole = {
  id: string
  tabLabel: string
  icon: IconProps['component']
  headline: string
  body: [string, string]
  ctaLabel: string
  ctaHref: string
  image: StaticImageProps
}

export const oneNetworkRoles: Array<NetworkRole> = [
  {
    id: 'ai-agents',
    tabLabel: 'AI agents',
    icon: RobotIcon,
    headline: 'Storage that agents can pay for themselves',
    body: [
      'Give autonomous agents a place to persist memory, artifacts, and datasets with a budget they control through Filecoin Pay.',
      'Every write returns a content identifier, so agents and the humans supervising them can verify exactly what was stored.',
    ],
    ctaLabel: 'Build with agents',
    ctaHref: 'https://docs.filecoin.cloud',
    image: graphicsData.filecoinMiningRig,
  },
  {
    id: 'developers',
    tabLabel: 'Developers',
    icon: CodeIcon,
    headline: 'Ship verifiable storage in an afternoon',
    body: [
      'Install the Synapse SDK, fund a wallet, and store your first file with a proof attached. No storage provider negotiations, no proprietary formats, no lock-in.',
      'Everything is open source and content addressed, so the data you store today is retrievable from any provider tomorrow.',
    ],
    ctaLabel: 'Read the docs',
    ctaHref: 'https://docs.filecoin.cloud',
    image: graphicsData.IPFSIllustration,
  },
  {
    id: 'enterprises',
    tabLabel: 'Enterprises',
    icon: BuildingsIcon,
    headline: 'Storage your auditors can verify',
    body: [
      'Replace opaque SLAs with cryptographic proofs. Filecoin shows you, onchain, that every replica of your data exists and is intact, every day.',
      'Choose programmable primitives for your own products or a managed S3-compatible service through Fil One. Both run on the same verifiable network.',
    ],
    ctaLabel: 'Talk to sales',
    ctaHref: PATHS.STORE_DATA_TALK_TO_EXPERT.path,
    image: graphicsData.dataCenterServerRow,
  },
  {
    id: 'startups',
    tabLabel: 'Startups',
    icon: RocketIcon,
    headline: 'Cloud economics that scale with you, not against you',
    body: [
      'Storage from $2.50 per TB per month, no egress surprises, and pricing you can read in a smart contract instead of a 40-page rate card.',
      'Start on a managed service, move to the SDK when you need control. Your data never has to migrate.',
    ],
    ctaLabel: 'Compare storage options',
    ctaHref: PATHS.STORE_DATA.path,
    image: graphicsData.rocketLaunch,
  },
  {
    id: 'data-centers',
    tabLabel: 'Data centers',
    icon: CpuIcon,
    headline: 'Turn spare capacity into recurring revenue',
    body: [
      'Storage providers earn by proving they hold customer data. Filecoin Pay settles in stablecoins, so revenue is predictable.',
      'Join thousands of providers already serving enterprises and archives worldwide.',
    ],
    ctaLabel: 'Become a storage provider',
    ctaHref: PATHS.PROVIDE_STORAGE.path,
    image: graphicsData.serverBladeChassis,
  },
]
