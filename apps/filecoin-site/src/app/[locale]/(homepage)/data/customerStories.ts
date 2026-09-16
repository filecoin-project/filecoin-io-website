import type { IconProps } from '@filecoin-foundation/ui-filecoin/Icon'
import type { StaticImageProps } from '@filecoin-foundation/utils/types/imageType'

import { graphicsData } from '@/data/graphicsData'

import FlickrFoundationLogo from '@/assets/logos/flickr-foundation-icon-logo.svg'
import InternetArchiveLogo from '@/assets/logos/internet-archive-icon-logo.svg'
import StarlingLabLogo from '@/assets/logos/starling-lab-icon-logo.png'
import AkaveLogo from '@/assets/miniatures/akave-miniature.svg'
import CIDgravityLogo from '@/assets/miniatures/cid-gravity-miniature.svg'
import LighthouseLogo from '@/assets/miniatures/lighthouse-miniature.svg'



type TabLogo =
  | { type: 'svg'; src: IconProps['component'] }
  | { type: 'image'; src: StaticImageProps['data'] }

export type CustomerStory = {
  id: string
  tabLabel: string
  logo: TabLogo
  headline: string
  tags: Array<string>
  quote: string
  attribution: string
  ctaLabel: string
  ctaHref: string
  image: StaticImageProps
}

export const customerStories: Array<CustomerStory> = [
  {
    id: 'internet-archive',
    tabLabel: 'Internet Archive',
    logo: { type: 'svg', src: InternetArchiveLogo },
    headline:
      "Internet Archive adds a verifiable, redundant copy of the web's memory",
    tags: ['Archival storage', 'Filecoin Beam'],
    quote:
      'Since 2021 we have stored parts of the archive on Filecoin. It gives us geographic redundancy and a proof trail we simply could not get from a single cloud.',
    attribution: 'Internet Archive',
    ctaLabel: 'Read the Internet Archive story',
    ctaHref: 'https://filecoin.io/case-studies/internet-archive',
    image: graphicsData.classicLibraryInterior,
  },
  {
    id: 'flickr-foundation',
    tabLabel: 'Flickr Foundation',
    logo: { type: 'svg', src: FlickrFoundationLogo },
    headline:
      'Flickr Foundation keeps a century of photography online for the next one',
    tags: ['Archival storage'],
    quote:
      'Our mandate is a hundred years. Filecoin was the only option where the storage guarantees were enforced by the network, not by a contract.',
    attribution: 'Flickr Foundation',
    ctaLabel: 'Read the Flickr Foundation story',
    ctaHref: 'https://filecoin.io/case-studies/flickr-foundation',
    image: graphicsData.digitalMediaConversionSetup,
  },
  {
    id: 'starling-lab',
    tabLabel: 'Starling Lab',
    logo: { type: 'image', src: StarlingLabLogo },
    headline:
      'Starling Lab preserves human-rights evidence with provable integrity',
    tags: ['Archival storage', 'Filecoin Pin'],
    quote:
      'When a record might be challenged in court years from now, you need more than a backup. You need to prove nothing changed. Filecoin gives us that.',
    attribution: 'Starling Lab',
    ctaLabel: 'Read the Starling Lab story',
    ctaHref: 'https://filecoin.io/case-studies/starling-lab',
    image: graphicsData.serverBladeChassis,
  },
  {
    id: 'lighthouse',
    tabLabel: 'Lighthouse',
    logo: { type: 'svg', src: LighthouseLogo },
    headline: 'Lighthouse sells pay-once, store-forever storage built on Filecoin',
    tags: ['Warm storage', 'Filecoin Pay', 'Smart contracts (FVM)'],
    quote:
      'Programmable payments let us price storage in a way centralized clouds cannot. Our customers pay once and the network keeps the promise.',
    attribution: 'Lighthouse',
    ctaLabel: 'Read the Lighthouse story',
    ctaHref: 'https://www.lighthouse.storage/',
    image: graphicsData.filecoinStorageDevice,
  },
  {
    id: 'cidgravity',
    tabLabel: 'CIDgravity',
    logo: { type: 'svg', src: CIDgravityLogo },
    headline: 'CIDgravity gives Nextcloud users a verifiable storage backend',
    tags: ['Warm storage', 'Filecoin Pin'],
    quote:
      'We plugged Filecoin in behind a tool millions of people already use. Nobody had to learn anything new, and every file now carries a proof.',
    attribution: 'CIDgravity',
    ctaLabel: 'Read the CIDgravity story',
    ctaHref: 'https://www.cidgravity.com/',
    image: graphicsData.filecoinServerRack,
  },
  {
    id: 'akave',
    tabLabel: 'Akave',
    logo: { type: 'svg', src: AkaveLogo },
    headline: 'Akave runs S3-compatible object storage for AI workloads on Filecoin',
    tags: ['Warm storage', 'Filecoin Pay', 'Synapse SDK'],
    quote:
      'Our customers keep the S3 workflow they already know and gain something no hyperscaler offers: cryptographic proof that their data is exactly where we say it is.',
    attribution: 'Akave',
    ctaLabel: 'Read the Akave story',
    ctaHref: 'https://akave.com/',
    image: graphicsData.dataCenterServerRow,
  },
]
