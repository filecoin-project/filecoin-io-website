import { localePath, type Locale } from '@/i18n/locales'

import type { Metadata } from 'next'

import { createMetadata, type MetadataParams } from '@/utils/createMetadata'

export type PageSeo = Pick<MetadataParams, 'title' | 'description' | 'image'>

/**
 * A page's metadata in one language, with the other language's URL as an alternate. `path` is
 * the page's English path (the Chinese one is derived), so both editions point at each other.
 */
export function pageMetadata(
  locale: Locale,
  path: `/${string}`,
  { title, description, image }: PageSeo,
): Metadata {
  const localized = localePath(locale, path) as `/${string}`

  return {
    ...createMetadata({ title, description, image, path: localized }),
    alternates: {
      canonical: localized,
      languages: {
        en: localePath('en', path),
        'zh-CN': localePath('zh-cn', path),
        'x-default': localePath('en', path),
      },
    },
  }
}
