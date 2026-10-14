// Header navigation. `href: null` marks a destination that does not exist yet. Pages of filecoin.io
// that this build does not rebuild (Learn, Blog, Community, Case Studies) are linked by path, since
// the build is published at filecoin.io.
import { DOCS } from './links'

export type NavLink = {
  label: string
  href: string | null
  title?: string
  /** Small pill after the label, e.g. "Coming soon". */
  badge?: string
  /** Secondary line under the label. */
  note?: string
}

export type NavGroup = {
  /** Column heading; omit for an unlabelled group. */
  heading?: string
  /** A heading that is itself a link (a top-level item with no children). */
  headingLink?: NavLink
  links: NavLink[]
}

export type NavSection = {
  label: string
  /** Columns of groups, laid out left to right. */
  columns: NavGroup[][]
  aside?: { heading: string; link: NavLink }
}

export type NavVariant = 'home' | 'inner'

/** Products and solutions in one menu. */
const PRODUCTS: NavSection = {
  label: 'Products',
  columns: [
    [
      {
        heading: 'Types of Storage',
        links: [
          {
            label: 'Warm Storage',
            href: '/products/warm-storage',
            note: 'Keep frequently used data online and ready to retrieve.',
          },
          {
            label: 'IPFS Storage',
            href: '/products/ipfs',
            note: 'Store files on Filecoin with the IPFS tools you know.',
          },
          {
            label: 'Archival Storage',
            href: '/products/archival-storage',
            note: 'Preserve backups and records you rarely need to access.',
          },
          {
            label: 'Enterprise Storage w/ Fil.one',
            href: 'https://fil.one',
            note: 'S3-compatible storage with fast reads and predictable pricing.',
          },
        ],
      },
    ],
    [
      {
        heading: 'Use Filecoin',
        links: [
          {
            label: 'Agents Skills',
            href: '/products/agents',
            note: 'Help agents publish work and share context across sessions.',
            badge: 'NEW',
          },
          {
            label: 'Pay Console',
            href: 'https://pay.filecoin.cloud/console',
            note: 'Manage your Filecoin services and billing.',
          },
          {
            label: 'Pricing',
            href: '/pricing',
            note: 'Compare warm, archival, and enterprise storage pricing.',
          },
        ],
      },
    ],
  ],
}

const NETWORK: NavSection = {
  label: 'Network',
  columns: [
    [
      {
        links: [
          { label: 'Provide Storage', href: '/provide-storage' },
          { label: 'Network Status', href: 'https://status.filecoin.io/' },
          { label: 'Metrics', href: 'https://dashboard.starboard.ventures/' },
        ],
      },
    ],
    [
      {
        heading: 'Explorers',
        links: [
          { label: 'filfox.info', href: 'https://filfox.info/' },
          { label: 'Beryx', href: 'https://beryx.io/' },
          { label: 'Filscout', href: 'https://filscout.com/' },
          {
            label: 'filecoin.blockscout.com',
            href: 'https://filecoin.blockscout.com/',
          },
        ],
      },
    ],
  ],
}

const BUILD: NavSection = {
  label: 'Build',
  columns: [
    [
      {
        links: [
          { label: 'Quickstart', href: DOCS },
          { label: 'Github', href: 'https://github.com/filecoin-project' },
          { label: 'Docs', href: DOCS },
          {
            label: 'Security',
            href: 'https://immunefi.com/bug-bounty/filecoin/',
          },
        ],
      },
    ],
  ],
}

const DISCOVER: NavSection = {
  label: 'Discover',
  columns: [
    [
      {
        links: [
          { label: 'About Filecoin', href: '/learn' },
          { label: 'Blog', href: '/blog' },
          { label: 'Community', href: '/community-hub' },
          { label: 'Case Studies', href: '/case-studies' },
        ],
      },
    ],
  ],
}

const SECTIONS = [PRODUCTS, NETWORK, BUILD, DISCOVER]

/** The same navigation on the homepage and the inner pages. */
export const NAV: Record<NavVariant, NavSection[]> = {
  home: SECTIONS,
  inner: SECTIONS,
}

export const PRICING: NavLink = { label: 'Pricing', href: '/pricing' }
export const JOIN_NETWORK: NavLink = {
  label: 'Provide Storage',
  href: '/provide-storage',
  title: 'Provide storage on the Filecoin network',
}

/** Links by path (pages of this site) open in the same tab; other sites open a new tab. */
export function opensInNewTab(href: string): boolean {
  return href.startsWith('http')
}
