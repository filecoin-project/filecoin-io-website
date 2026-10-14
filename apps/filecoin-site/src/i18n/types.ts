import { getTranslations } from 'next-intl/server'

import type { Locale } from './locales'

export type { Locale }
export type LocaleParams = { locale: Locale }
export type UnsanitizedLocaleParams = { locale: string }
export type TranslationFunction = Awaited<ReturnType<typeof getTranslations>>
