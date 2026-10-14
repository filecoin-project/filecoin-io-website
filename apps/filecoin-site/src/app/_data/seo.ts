import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'
import type { PageSeo } from '@/i18n/metadata'

import type { PATHS } from '@/constants/paths'

/** The redesigned pages, by their key in `PATHS`. */
export type RedesignPageKey =
  | 'HOME'
  | 'PRICING'
  | 'STORE_DATA'
  | 'PROVIDE_STORAGE'
  | 'PROVIDE_STORAGE_ONBOARDING'
  | 'PRODUCTS_WARM_STORAGE'
  | 'PRODUCTS_AGENTS'
  | 'PRODUCTS_IPFS'
  | 'PRODUCTS_ARCHIVAL_STORAGE'

// Every key names a page in PATHS.
type Check = RedesignPageKey extends keyof typeof PATHS ? true : never
const _check: Check = true
void _check

/**
 * Title and description of each redesigned page in a language, taken from its copy: the source
 * of its metadata, its structured data and the Cypress metadata checks. The homepage title is
 * absolute; the others take the site's title template.
 */
export function pageSeo(locale: Locale): Record<RedesignPageKey, PageSeo> {
  const c = copy(locale)

  return {
    HOME: {
      title: { absolute: c.ui.SITE.title },
      description: c.ui.SITE.description,
    },
    PRICING: { title: c.pricing.TITLE, description: c.pricing.PLANS.body },
    STORE_DATA: {
      title: c.dataStorage.TITLE,
      description: c.dataStorage.HERO.body,
    },
    PROVIDE_STORAGE: {
      title: c.provideStorage.TITLE,
      description: c.provideStorage.HERO.body,
    },
    PROVIDE_STORAGE_ONBOARDING: {
      title: c.providerForm.TITLE,
      description: c.providerForm.PROVIDER_FORM.body,
    },
    PRODUCTS_WARM_STORAGE: {
      title: c.warmStorage.TITLE,
      description: c.warmStorage.HERO.body,
    },
    PRODUCTS_AGENTS: { title: c.agents.TITLE, description: c.agents.HERO.body },
    PRODUCTS_IPFS: { title: c.ipfs.TITLE, description: c.ipfs.HERO.body },
    PRODUCTS_ARCHIVAL_STORAGE: {
      title: c.archivalStorage.TITLE,
      description: c.archivalStorage.HERO.body,
    },
  }
}

/** The title as a plain string. */
export function seoTitle({ title }: PageSeo): string {
  return typeof title === 'string' ? title : title.absolute
}
