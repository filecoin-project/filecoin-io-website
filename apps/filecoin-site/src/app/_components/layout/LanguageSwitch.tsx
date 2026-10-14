'use client'

import { usePathname } from 'next/navigation'

import { copy } from '@/i18n/copy'
import { HTML_LANG, LOCALES, type Locale } from '@/i18n/locales'

import clsx from 'clsx'

import { switchHref } from '@/data/language'

const ITEM =
  'rounded-[4px] px-2.5 py-1.5 text-base leading-[1.4375] font-semibold'

/**
 * The locale cookie next-intl's middleware reads (its default name). It is written before the
 * link is followed: with `localePrefix: 'as-needed'`, a request for the unprefixed English URL
 * is otherwise sent back to the language the cookie remembers.
 */
const LOCALE_COOKIE = 'NEXT_LOCALE'

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

/**
 * EN / 中文, as on filecoin.io. The current language is a chip; the other is a link to the same
 * page in that language (see `switchHref`). Rendered in the header on wide screens and at the
 * foot of the mobile menu.
 */
export default function LanguageSwitch({
  locale = 'en',
  className,
}: {
  locale?: Locale
  className?: string
}) {
  const pathname = usePathname()
  const { HEADER } = copy(locale).ui

  return (
    <nav
      aria-label={HEADER.language}
      className={clsx('flex items-center gap-2', className)}
    >
      {LOCALES.map((target) =>
        target === locale ? (
          <span
            key={target}
            aria-current="true"
            lang={HTML_LANG[target]}
            className={clsx(ITEM, 'bg-(--hdr-chip) text-(--hdr-chip-fg)')}
          >
            {HEADER.languages[target]}
          </span>
        ) : (
          <a
            key={target}
            href={switchHref(pathname, target)}
            lang={HTML_LANG[target]}
            hrefLang={HTML_LANG[target]}
            aria-label={HEADER.switchTo[target]}
            className={clsx(
              ITEM,
              'text-(--hdr-fg) transition-colors duration-200 ease-out hover:bg-(--hdr-hover)',
            )}
            onClick={() => rememberLocale(target)}
          >
            {HEADER.languages[target]}
          </a>
        ),
      )}
    </nav>
  )
}
