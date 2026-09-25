import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  ArrowsClockwiseIcon,
  BookOpenIcon,
  BracketsCurlyIcon,
  CloudArrowUpIcon,
  CoinsIcon,
  CubeIcon,
  DatabaseIcon,
  GaugeIcon,
  HardDrivesIcon,
  LightningIcon,
  PushPinIcon,
  StackIcon,
} from '@phosphor-icons/react/dist/ssr'

import {
  FILECOIN_CLOUD_DOCS_URL,
  FILECOIN_CLOUD_URL,
  FILECOIN_DOCS_URL,
  FILECOIN_DOCS_URLS,
} from '@/constants/siteMetadata'

export type ProductKey =
  | 'warmStorage'
  | 'archivalStorage'
  | 'filecoinPin'
  | 'retrieval'
  | 'ipfsGateways'
  | 'filecoinPay'
  | 'usdfc'
  | 'synapseSdk'
  | 'smartContracts'
  | 'documentation'
  | 'filOne'
  | 'akaveCloud'
  | 'lighthouse'
  | 'cidgravity'
  | 'storacha'

type ProductDefinition = {
  href: string
  icon: PhosphorIcon
}

// PLACEHOLDER — core-product hrefs point at filecoin.cloud surfaces until the
// /products/* pages exist (deliverable 1). Single source of product identity
// (href, icon; labels come from the `products.*` translation keys), consumed
// by the homepage catalog, use-case sections, and the navigation IA so all
// three stay in sync.
export const PRODUCTS: Record<ProductKey, ProductDefinition> = {
  warmStorage: { href: FILECOIN_CLOUD_URL, icon: LightningIcon },
  archivalStorage: {
    href: FILECOIN_DOCS_URLS.storageModel,
    icon: HardDrivesIcon,
  },
  filecoinPin: { href: FILECOIN_CLOUD_DOCS_URL, icon: PushPinIcon },
  retrieval: { href: FILECOIN_CLOUD_DOCS_URL, icon: GaugeIcon },
  ipfsGateways: { href: 'https://ipfs.tech/', icon: CubeIcon },
  filecoinPay: { href: FILECOIN_CLOUD_DOCS_URL, icon: ArrowsClockwiseIcon },
  usdfc: { href: 'https://usdfc.net/', icon: CoinsIcon },
  synapseSdk: { href: FILECOIN_CLOUD_DOCS_URL, icon: BracketsCurlyIcon },
  smartContracts: {
    href: FILECOIN_DOCS_URLS.filecoinVirtualMachine,
    icon: StackIcon,
  },
  documentation: { href: FILECOIN_DOCS_URL, icon: BookOpenIcon },
  filOne: { href: 'https://fil.one/', icon: CloudArrowUpIcon },
  akaveCloud: { href: 'https://akave.com/', icon: DatabaseIcon },
  lighthouse: { href: 'https://www.lighthouse.storage/', icon: DatabaseIcon },
  cidgravity: { href: 'https://www.cidgravity.com/', icon: DatabaseIcon },
  storacha: { href: 'https://storacha.network/', icon: DatabaseIcon },
}
