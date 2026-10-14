export const ENGLISH_LOCALE = 'en'
export const CHINESE_LOCALE = 'zh-cn'

export const LOCALES = [ENGLISH_LOCALE, CHINESE_LOCALE] as const
export const DEFAULT_LOCALE = LOCALES[0]

export type Locale = (typeof LOCALES)[number]

/** The `lang` attribute for each locale. */
export const HTML_LANG: Record<Locale, string> = { en: 'en', 'zh-cn': 'zh-CN' }

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function toLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE
}

/**
 * A site path for a locale: localePath("zh-cn", "/pricing") is "/zh-cn/pricing" and
 * localePath("zh-cn", "/") is "/zh-cn". English paths, other sites and in-page anchors are
 * returned as they are.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE || !path.startsWith('/')) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** A pathname split into its locale and the path without the locale prefix. */
export function splitPath(pathname: string | null): {
  locale: Locale
  path: string
} {
  const clean = (pathname ?? '/').replace(/\/+$/, '') || '/'
  for (const locale of LOCALES) {
    if (clean === `/${locale}`) return { locale, path: '/' }
    if (clean.startsWith(`/${locale}/`))
      return { locale, path: clean.slice(locale.length + 1) }
  }
  return { locale: DEFAULT_LOCALE, path: clean }
}
