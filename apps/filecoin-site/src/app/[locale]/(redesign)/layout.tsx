import { notFound } from 'next/navigation'

import { CHINESE_LOCALE, HTML_LANG } from '@/i18n/locales'
import { routing } from '@/i18n/routing'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import { clsx } from 'clsx'
import type { Metadata, Viewport } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import PlausibleProvider from 'next-plausible'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { BASE_DOMAIN, ROOT_METADATA } from '@/constants/siteMetadata'
import { ORGANIZATION_SCHEMA_BASE } from '@/constants/structuredDataConstants'

import ContactDialog from '@/components/layout/ContactDialog'
import { FocAttribution } from '@/components/layout/FocAttribution'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import SmoothScroll from '@/components/layout/SmoothScroll'
import { TranslationNotice } from '@/components/layout/TranslationNotice'

import { aspekta, funnelDisplay, funnelSans, geist, geistMono } from '@/fonts'

import './globals.css'

/**
 * Root layout of the redesigned pages (the homepage, Store Data, Pricing, the product pages and
 * Provide Storage): the new header, footer, contact dialog and smooth scrolling, on the
 * redesign's stylesheet. The other pages keep their own root layout in `(legacy)`, so moving
 * between the two groups is a full page load and the two stylesheets never meet.
 */

export const metadata: Metadata = ROOT_METADATA

export const viewport: Viewport = {
  themeColor: '#020618',
  colorScheme: 'dark',
}

type RedesignLayoutProps = {
  children: React.ReactNode
  params: Promise<UnsanitizedLocaleParams>
}

export default async function RedesignLayout({
  children,
  params,
}: RedesignLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html
      suppressHydrationWarning
      lang={HTML_LANG[locale]}
      className={clsx(
        aspekta.variable,
        funnelSans.variable,
        funnelDisplay.variable,
        geist.variable,
        geistMono.variable,
      )}
    >
      <head>
        {/* Before first paint: lets scroll-reveal styles hide content only when JS will reveal it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <StructuredDataScript structuredData={ORGANIZATION_SCHEMA_BASE} />
      </head>
      <body className="bg-slate-950 font-sans text-slate-50">
        <PlausibleProvider
          trackOutboundLinks
          hash
          trackFileDownloads
          domain={BASE_DOMAIN}
        >
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
          {locale === CHINESE_LOCALE && <TranslationNotice />}
          <ContactDialog locale={locale} />
          <SmoothScroll />
          <FocAttribution />
        </PlausibleProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
