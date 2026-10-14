import localFont from 'next/font/local'

/**
 * The fonts of the redesigned pages (the `(redesign)` route group). The legacy pages load
 * Aspekta and Funnel Sans on their own in `SiteLayout`.
 */

/** Headings, numbers and buttons. Variable weight axis 100–900. */
export const aspekta = localFont({
  src: './Aspekta/AspektaVF.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-aspekta',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

/** Body copy, navigation and labels. Variable weight axis 300–800. */
export const funnelSans = localFont({
  src: './Funnel_Sans/FunnelSans[wght].woff2',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-funnel-sans',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

/** Display cut, available as `font-display` for sections that call for it. Not preloaded until used. */
export const funnelDisplay = localFont({
  src: [
    {
      path: './Funnel_Display/FunnelDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Funnel_Display/FunnelDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Funnel_Display/FunnelDisplay-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Funnel_Display/FunnelDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-funnel-display',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

/**
 * Geist Regular and Medium (SIL OFL 1.1), for the interface text inside illustrations such as the
 * Archival Storage stack. Only downloaded on pages that use it.
 */
export const geist = localFont({
  src: [
    { path: './Geist/Geist-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Geist/Geist-Medium.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-geist',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

/** Code and prompts, as `font-mono`. Geist Mono Regular (SIL OFL 1.1). Used low on the page, so not preloaded. */
export const geistMono = localFont({
  src: './Geist_Mono/GeistMono-Regular.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-geist-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})
