import { notFound } from 'next/navigation'

import { CHINESE_LOCALE } from '@/i18n/locales'
import { routing } from '@/i18n/routing'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { ROOT_METADATA } from '@/constants/siteMetadata'

import { TranslationNotice } from '@/components/layout/TranslationNotice'
import { SiteLayout } from '@/components/SiteLayout'

import '@/styles/globals.css'

export const metadata = ROOT_METADATA

type RootLayoutProps = {
  children: React.ReactNode
  params: Promise<UnsanitizedLocaleParams>
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <SiteLayout
      locale={locale}
      notice={locale === CHINESE_LOCALE && <TranslationNotice />}
    >
      {children}
    </SiteLayout>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
