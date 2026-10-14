/**
 * Product funnel tracking on the website side ("Filecoin Product Funnel Tracking"): first-touch
 * labels for a visit, the UTM and foc_* parameters added to links that leave for the docs or the
 * Console, and the properties of the Plausible events. Pure functions; `FocAttribution` (in
 * `_components/layout`) runs them in the browser.
 *
 * Labels, not IDs: nothing here identifies a visitor. The labels live in sessionStorage for the
 * visit, so they survive the full page loads between pages.
 */

export type FirstTouchType = 'campaign' | 'organic' | 'referral' | 'direct'

export type FirstTouch = {
  ft_type: FirstTouchType
  /** The page the visit started on, without the locale prefix. */
  entry_page: string
  first_touch_source: string
  first_touch_medium: string
  /** The referrer's host, or "(direct)". */
  ref_domain: string
  /** The visit's own utm_* parameters, when it arrived with any. */
  utm: Record<string, string>
}

export type LinkType = 'decorate' | 'redirect' | 'exit' | 'sales'

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

/** Our own surfaces: a referral from one of them keeps the first touch already recorded. */
export const OWN_HOSTS = [
  'filecoin.io',
  'www.filecoin.io',
  'docs.filecoin.io',
  'pay.filecoin.cloud',
  'filecoin.cloud',
  'localhost',
]

/** Links to these hosts carry the campaign on: they get utm_* and foc_* parameters. */
export const DECORATED_HOSTS = [
  'docs.filecoin.io',
  'pay.filecoin.cloud',
  'filecoin.cloud',
  'fil.one',
]

const SEARCH_ENGINES = [
  'google.',
  'bing.com',
  'duckduckgo.com',
  'yahoo.',
  'baidu.com',
  'yandex.',
  'ecosia.org',
  'search.brave.com',
  'startpage.com',
  'sogou.com',
]

const SOCIAL_SITES = [
  'twitter.com',
  'x.com',
  't.co',
  'facebook.com',
  'linkedin.com',
  'reddit.com',
  'youtube.com',
  'youtu.be',
  't.me',
  'discord.com',
  'bsky.app',
  'threads.net',
  'instagram.com',
  'farcaster.xyz',
  'warpcast.com',
]

/** Default UTM values for links that leave the site when the visit arrived without any. */
export const DEFAULT_UTM = {
  utm_source: 'filecoin.io',
  utm_medium: 'website',
}

const LOCALE_PREFIX = /^\/zh-cn(?=\/|$)/

/** A path without the locale prefix: "/zh-cn/pricing" is "/pricing". */
export function sitePath(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, '') || '/'
}

function host(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return null
  }
}

function matchesHost(hostname: string, patterns: readonly string[]) {
  return patterns.some((p) =>
    p.endsWith('.')
      ? hostname.includes(p)
      : hostname === p || hostname.endsWith(`.${p}`),
  )
}

export function isOwnHost(hostname: string): boolean {
  return matchesHost(hostname, OWN_HOSTS)
}

/**
 * The first touch of a visit from its landing URL and referrer, or null when the landing is a
 * referral from one of our own surfaces (the existing first touch, if any, stays).
 */
export function firstTouch(
  landingUrl: string,
  referrer: string,
): FirstTouch | null {
  const url = new URL(landingUrl)
  const entry_page = sitePath(url.pathname)
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key)
    if (value) utm[key] = value
  }

  const refHost = referrer ? host(referrer) : null

  if (Object.keys(utm).length > 0) {
    return {
      ft_type: 'campaign',
      entry_page,
      first_touch_source: utm.utm_source ?? '(not set)',
      first_touch_medium: utm.utm_medium ?? '(not set)',
      ref_domain: refHost ?? '(direct)',
      utm,
    }
  }

  if (!refHost) {
    return {
      ft_type: 'direct',
      entry_page,
      first_touch_source: '(direct)',
      first_touch_medium: '(none)',
      ref_domain: '(direct)',
      utm,
    }
  }

  if (isOwnHost(refHost)) return null

  if (matchesHost(refHost, SEARCH_ENGINES)) {
    return {
      ft_type: 'organic',
      entry_page,
      first_touch_source: refHost,
      first_touch_medium: 'organic',
      ref_domain: refHost,
      utm,
    }
  }

  return {
    ft_type: 'referral',
    entry_page,
    first_touch_source: refHost,
    first_touch_medium: matchesHost(refHost, SOCIAL_SITES)
      ? 'social'
      : 'referral',
    ref_domain: refHost,
    utm,
  }
}

/** The kind of link a click is, from where it goes. */
export function linkType(href: string, origin: string): LinkType {
  if (href.startsWith('#')) return 'sales'
  const hostname = host(href)
  if (!hostname) return 'redirect'
  if (hostname === host(origin)) return 'redirect'
  return matchesHost(hostname, DECORATED_HOSTS) ? 'decorate' : 'exit'
}

/**
 * A link that leaves for the docs or the Console, carrying the campaign: the visit's own utm_*
 * (or the site's defaults), the link's foc_ref, and the first-touch labels as foc_ft and
 * foc_entry. Parameters already on the link are kept.
 */
export function decorate(
  href: string,
  focRef: string,
  touch: FirstTouch | null,
): string {
  const url = new URL(href)
  const params = url.searchParams
  const utm = { ...DEFAULT_UTM, ...(touch?.utm ?? {}) }
  for (const [key, value] of Object.entries(utm)) {
    if (!params.has(key)) params.set(key, value)
  }
  params.set('foc_ref', focRef)
  if (touch) {
    params.set('foc_ft', touch.ft_type)
    params.set('foc_entry', touch.entry_page)
  }
  return url.toString()
}

/** The pages that count as a funnel entry, by their path, and the `product` label they send. */
export const PRODUCT_PAGES: Record<string, string> = {
  '/products/agents': 'agent-skills',
  '/products/ipfs': 'ipfs-pinning',
  '/products/warm-storage': 'data-storage',
  '/products/archival-storage': 'backups-archives',
  '/store-data': 'store-data',
  '/pricing': 'pricing',
}

/** The label properties sent with every event. */
export function labelProps(touch: FirstTouch | null) {
  return {
    ft_type: touch?.ft_type ?? '(unknown)',
    entry_page: touch?.entry_page ?? '(unknown)',
    first_touch_source: touch?.first_touch_source ?? '(unknown)',
    first_touch_medium: touch?.first_touch_medium ?? '(unknown)',
  }
}
