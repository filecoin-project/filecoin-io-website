import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import ArchiveStack from '@/components/sections/product/ArchiveStack'
import ClosingCta from '@/components/sections/product/ClosingCta'
import FeatureCards from '@/components/sections/product/FeatureCards'
import ProductHero from '@/components/sections/product/ProductHero'

type ArchivalStoragePageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

export default async function ArchivalStoragePage({
  params,
}: ArchivalStoragePageProps) {
  const locale = toLocale((await params).locale)
  const { HERO, SET_UP, USES } = copy(locale).archivalStorage

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(
          locale,
          'PRODUCTS_ARCHIVAL_STORAGE',
        )}
      />
      {/* Opens on light grey, so the header takes its light tone (see globals.css). */}
      <main data-header-tone="light">
        <ProductHero {...HERO} bodyWidth="narrow" art={<ArchiveStack />} />
        <FeatureCards id="archival-uses-title" {...USES} />
        <ClosingCta id="set-up-title" {...SET_UP} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: ArchivalStoragePageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PRODUCTS_ARCHIVAL_STORAGE.path,
    pageSeo(locale).PRODUCTS_ARCHIVAL_STORAGE,
  )
}
