import translations from '@/i18n/translations/en.json'
import zhCnTranslations from '@/i18n/translations/zh-cn.json'

import { PATHS } from '@/constants/paths'

type TranslatedPath = keyof typeof translations

/** The pages whose copy lives in the translation files. */
type PathKey = {
  [K in keyof typeof PATHS]: (typeof PATHS)[K]['path'] extends TranslatedPath
    ? K
    : never
}[keyof typeof PATHS]

export function getPageTestData(key: PathKey) {
  const { path } = PATHS[key]
  const { title, description } = translations[path].metadata
  const { title: zhCnTitle, description: zhCnDescription } =
    zhCnTranslations[path].metadata

  return {
    en: { path, title, description },
    zhCn: {
      path: `/zh-cn${path}`,
      title: zhCnTitle,
      description: zhCnDescription,
    },
  }
}
