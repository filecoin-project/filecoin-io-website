import { localePath, type Locale } from '@/i18n/locales'

import { PATHS } from '@/constants/paths'
import { ROOT_METADATA } from '@/constants/siteMetadata'

import { pageSeo, type RedesignPageKey } from '@/data/seo'

/** The pages whose copy lives in src/app/_data: what their metadata should say in each language. */
export function getRedesignPageTestData(key: RedesignPageKey) {
  const { path } = PATHS[key]

  function expected(locale: Locale) {
    const { title, description } = pageSeo(locale)[key]
    return {
      path: localePath(locale, path),
      title:
        typeof title === 'string'
          ? ROOT_METADATA.title.template.replace('%s', title)
          : title.absolute,
      description,
    }
  }

  return { en: expected('en'), zhCn: expected('zh-cn') }
}
