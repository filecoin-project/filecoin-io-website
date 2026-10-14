import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import HelpCta from '@/components/sections/provide/HelpCta'
import PointsSection from '@/components/sections/provide/PointsSection'
import ProviderHero from '@/components/sections/provide/ProviderHero'
import ProviderLogos from '@/components/sections/provide/ProviderLogos'
import ButtonLink from '@/components/ui/ButtonLink'

type ProvideStoragePageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#141414',
  colorScheme: 'dark',
}

/** filecoin.io/provide-storage: the same sections and copy, with the new calls to action. */
export default async function ProvideStoragePage({
  params,
}: ProvideStoragePageProps) {
  const locale = toLocale((await params).locale)
  const { PDP, SCALING } = copy(locale).provideStorage

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(
          locale,
          'PROVIDE_STORAGE',
        )}
      />
      {/* Opens and closes on near-black, so the header takes its dark tone and the footer continues it. */}
      <main data-footer-tone="carbon">
        <ProviderHero locale={locale} />
        <ProviderLogos locale={locale} />
        <PointsSection
          id="pdp-title"
          tone="dark"
          title={PDP.title}
          body={PDP.body}
          points={PDP.points}
          note={PDP.note}
          actions={
            <>
              <ButtonLink href={PDP.primary.href} variant="outline">
                {PDP.primary.label}
              </ButtonLink>
              <ButtonLink href={PDP.secondary.href} variant="secondary">
                {PDP.secondary.label}
              </ButtonLink>
            </>
          }
        />
        <PointsSection
          id="scaling-title"
          tone="light"
          title={SCALING.title}
          body={SCALING.body}
          points={SCALING.points}
          actions={
            <ButtonLink href={SCALING.link.href} variant="outline-light">
              {SCALING.link.label}
            </ButtonLink>
          }
        />
        <HelpCta locale={locale} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: ProvideStoragePageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PROVIDE_STORAGE.path,
    pageSeo(locale).PROVIDE_STORAGE,
  )
}
