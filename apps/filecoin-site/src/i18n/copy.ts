// Every piece of copy, by language. The English modules under src/data are the source of
// truth for shape; each has a Chinese twin under src/app/_data/zh-cn with the same exports, and the
// `satisfies` below fails the build if a twin falls out of step.

import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'

import * as contactEn from '@/data/contact'
import * as footerEn from '@/data/footer'
import * as homeEn from '@/data/home'
import * as navEn from '@/data/nav'
import * as newsEn from '@/data/news'
import * as pricingEn from '@/data/pricing'
import * as agentsEn from '@/data/products/agents'
import * as archivalStorageEn from '@/data/products/archival-storage'
import * as dataStorageEn from '@/data/products/data-storage'
import * as ipfsEn from '@/data/products/ipfs-pinning'
import * as warmStorageEn from '@/data/products/warm-storage'
import * as provideStorageEn from '@/data/provide-storage'
import * as providerFormEn from '@/data/provider-form'
import * as uiEn from '@/data/ui'
import * as contactZh from '@/data/zh-cn/contact'
import * as footerZh from '@/data/zh-cn/footer'
import * as homeZh from '@/data/zh-cn/home'
import * as navZh from '@/data/zh-cn/nav'
import * as newsZh from '@/data/zh-cn/news'
import * as pricingZh from '@/data/zh-cn/pricing'
import * as agentsZh from '@/data/zh-cn/products/agents'
import * as archivalStorageZh from '@/data/zh-cn/products/archival-storage'
import * as dataStorageZh from '@/data/zh-cn/products/data-storage'
import * as ipfsZh from '@/data/zh-cn/products/ipfs-pinning'
import * as warmStorageZh from '@/data/zh-cn/products/warm-storage'
import * as provideStorageZh from '@/data/zh-cn/provide-storage'
import * as providerFormZh from '@/data/zh-cn/provider-form'
import * as uiZh from '@/data/zh-cn/ui'

/**
 * The structure of a copy module with every string widened: a translation must have the same
 * keys, with text where there is text and the same numbers, flags and functions, but it may
 * break a title over a different number of lines.
 */
type Shape<T> = T extends string
  ? string
  : T extends (...args: never[]) => unknown
    ? T
    : T extends readonly (infer Item)[]
      ? readonly Shape<Item>[]
      : T extends object
        ? { readonly [K in keyof T]: Shape<T[K]> }
        : T

const EN = {
  ui: uiEn,
  nav: navEn,
  footer: footerEn,
  home: homeEn,
  news: newsEn,
  pricing: pricingEn,
  provideStorage: provideStorageEn,
  providerForm: providerFormEn,
  contact: contactEn,
  dataStorage: dataStorageEn,
  warmStorage: warmStorageEn,
  archivalStorage: archivalStorageEn,
  ipfs: ipfsEn,
  agents: agentsEn,
}

export type Copy = typeof EN

const ZH = {
  ui: uiZh,
  nav: navZh,
  footer: footerZh,
  home: homeZh,
  news: newsZh,
  pricing: pricingZh,
  provideStorage: provideStorageZh,
  providerForm: providerFormZh,
  contact: contactZh,
  dataStorage: dataStorageZh,
  warmStorage: warmStorageZh,
  archivalStorage: archivalStorageZh,
  ipfs: ipfsZh,
  agents: agentsZh,
} satisfies Shape<Copy>

const COPY: Record<Locale, Copy> = { en: EN, 'zh-cn': ZH as unknown as Copy }

/** The copy for a language; English when none is given, so components render on their own in tests. */
export function copy(locale: Locale = DEFAULT_LOCALE): Copy {
  return COPY[locale]
}
