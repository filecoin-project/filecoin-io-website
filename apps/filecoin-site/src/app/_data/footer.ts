import { DOCS, START_BUILDING, STORE } from './links'

// Footer links, carried over from the current filecoin.io footer (the earlier snapshot's
// `src/app/_components/Footer.tsx`). Links to other sites open in a new tab and carry an arrow.

export type FooterLink = {
  label: string
  href: string
  external?: boolean
  /** The link's foc_ref for click tracking (`data-foc-cta`); a link without one sends no event. */
  ref?: string
}

export const FOOTER_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Learn', href: '/learn' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Store Data', href: STORE, ref: 'footer-store-data' },
      { label: 'Provide Storage', href: '/provide-storage' },
      {
        label: 'Start Building on Filecoin',
        href: START_BUILDING,
        ref: 'footer-start-building',
        external: true,
      },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'Documentation',
        href: DOCS,
        ref: 'footer-docs',
        external: true,
      },
      {
        label: 'Cookbook',
        href: 'https://docs.filecoin.io/build-on-filecoin/cookbook',
        ref: 'footer-cookbook',
        external: true,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/filecoin-project',
        ref: 'footer-github',
        external: true,
      },
      { label: 'Grants', href: 'https://fil.org/grants', external: true },
      {
        label: 'Security Bug Bounty',
        href: 'https://immunefi.com/bug-bounty/filecoin/',
        ref: 'footer-security',
        external: true,
      },
      {
        label: 'Brand Kit',
        href: 'https://hub.fil.org/design',
        external: true,
      },
      {
        label: 'Network Status',
        href: 'https://status.filecoin.io/',
        ref: 'footer-status',
        external: true,
      },
      {
        label: 'Network Health',
        href: 'https://dashboard.starboard.ventures/',
        ref: 'footer-metrics',
        external: true,
      },
    ],
  },
  {
    title: 'Block Explorers',
    links: [
      { label: 'Beryx', href: 'https://beryx.io/', external: true },
      {
        label: 'Blockscout (FEVM)',
        href: 'https://www.blockscout.com/',
        external: true,
      },
      { label: 'Filfox', href: 'https://filfox.info/', external: true },
      { label: 'Filscan', href: 'https://filscan.io/en/', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Community Hub', href: '/community-hub' },
      { label: 'Events', href: 'https://fil.org/events', external: true },
      { label: 'Orbit', href: 'https://fil.org/orbit', external: true },
      {
        label: 'FIPs & Governance',
        href: 'https://fil.org/governance',
        external: true,
      },
    ],
  },
]

export type SocialNetwork =
  | 'slack'
  | 'discord'
  | 'x'
  | 'bluesky'
  | 'telegram'
  | 'youtube'

export const FOOTER_SOCIAL: {
  network: SocialNetwork
  label: string
  href: string
}[] = [
  {
    network: 'slack',
    label: 'Slack',
    href: 'https://filecoinproject.slack.com/ssb/redirect',
  },
  {
    network: 'discord',
    label: 'Discord',
    href: 'https://discord.gg/yeQ2hcd2TD',
  },
  { network: 'x', label: 'X', href: 'https://twitter.com/filecoin' },
  {
    network: 'bluesky',
    label: 'Bluesky',
    href: 'https://bsky.app/profile/filecoin.io',
  },
  { network: 'telegram', label: 'Telegram', href: 'https://t.me/filecoin' },
  {
    network: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@FilecoinProject',
  },
]

export const FOOTER_LEGAL: FooterLink[] = [
  {
    label: 'Privacy Policy',
    href: 'https://fil.org/privacy-policy',
    external: true,
  },
  {
    label: 'Terms of Use',
    href: 'https://fil.org/terms-of-use',
    external: true,
  },
]

export const FOOTER_FOUNDATION = {
  label: 'Filecoin Foundation',
  href: 'https://fil.org',
}
