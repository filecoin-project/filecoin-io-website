'use client'

import { routing } from '@/i18n/routing'

import { Button } from '@headlessui/react'
import { clsx } from 'clsx'

import { LANGUAGES } from './constants/languages'
import { useLanguageToggle } from './hooks/useLanguageToggle'

const variants = {
  compact: 'gap-1',
  relaxed: 'gap-4',
}

const toggleButtonStyle =
  'focus:brand-outline rounded-sm px-2 py-1 text-sm font-semibold text-[var(--color-navigation-link-text)] hover:bg-[var(--color-navigation-link-background-active)] focus:bg-[var(--color-navigation-link-background-active)] aria-[current=true]:bg-[var(--color-navigation-link-background-active)]'

type NavigationLanguageToggleProps = {
  variant?: keyof typeof variants
}

export function NavigationLanguageToggle({
  variant = 'compact',
}: NavigationLanguageToggleProps) {
  const { currentLocale, switchLocale } = useLanguageToggle()

  return (
    <div className={clsx(variants[variant], 'flex items-center font-medium')}>
      {routing.locales.map((locale) => {
        const { label, name } = LANGUAGES[locale]

        return (
          <Button
            key={locale}
            type="button"
            aria-label={`Switch site language to ${name}`}
            aria-current={currentLocale === locale}
            className={clsx(toggleButtonStyle, 'cursor-pointer')}
            onClick={() => switchLocale(locale)}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
