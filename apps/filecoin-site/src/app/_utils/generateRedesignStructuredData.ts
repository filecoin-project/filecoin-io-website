import type { Locale } from '@/i18n/locales'

import type { WebPageGraph } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo, seoTitle, type RedesignPageKey } from '@/data/seo'

import { generatePageStructuredData } from './generatePageStructuredData'

/** WebPage structured data for a redesigned page, from the same copy as its metadata. */
export function generateRedesignStructuredData(
  locale: Locale,
  key: RedesignPageKey,
): WebPageGraph {
  const seo = pageSeo(locale)[key]

  return generatePageStructuredData({
    title: seoTitle(seo),
    description: seo.description,
    path: PATHS[key].path,
    pageType: 'WebPage',
  })
}
