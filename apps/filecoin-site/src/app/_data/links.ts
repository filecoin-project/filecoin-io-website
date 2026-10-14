// Destinations shared across the site's pages.

/** Every "Docs" / "Documentation" / "Read the docs" link. */
export const DOCS =
  'https://docs.filecoin.io/build-on-filecoin/filecoin-onchain-cloud/synapse-quickstart'

/** Every "Start building" button: the quickstart. */
export const START_BUILDING = DOCS

/** The Filecoin Pay console: the Products menu and the homepage's "Create your account" card. */
export const CONSOLE = 'https://pay.filecoin.cloud/console'

/** Every "Store data" / "Get started" link: the storage page that lists the ways to store. */
export const STORE = '/store-data'

/**
 * Every "Talk to sales" / "Schedule a call" / "Chat with us" link: opens the contact form
 * (`ContactDialog`, mounted in the site layout) in place. Submissions land in a Google Sheet.
 */
export const CONTACT = '#contact'

/**
 * The "Partner with us" link under the homepage's logo strip: opens the partnership form
 * (`PartnerDialog`, mounted in the site layout) in place. Submissions land in their own sheet.
 */
export const PARTNER = '#partner'

/**
 * The storage provider intake form, for "Talk to Our Team" on the Provide Storage page.
 * Submissions land on the same Google Sheet as the contact form, on their own tab.
 */
export const PROVIDER_FORM = '/provide-storage/onboarding'
