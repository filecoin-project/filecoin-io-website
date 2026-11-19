import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import ClosingCta from '@/components/sections/product/ClosingCta'
import DriveShare from '@/components/sections/product/DriveShare'
import FeatureCards from '@/components/sections/product/FeatureCards'
import HowSteps from '@/components/sections/product/HowSteps'
import ProductHero from '@/components/sections/product/ProductHero'

type DrivePageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

export default async function DrivePage({ params }: DrivePageProps) {
  const locale = toLocale((await params).locale)
  const { CLOSING, FEATURES, HERO, HOW } = copy(locale).drive

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(
          locale,
          'PRODUCTS_DRIVE',
        )}
      />
      {/* Opens on light grey, so the header takes its light tone; ends on carbon, which the footer continues (see globals.css). */}
      <main data-header-tone="light" data-footer-tone="carbon">
        <ProductHero {...HERO} art={<DriveShare locale={locale} />} />
        <FeatureCards id="drive-features-title" {...FEATURES} />
        <HowSteps id="how-it-works-title" {...HOW} />
        <ClosingCta id="closing-title" {...CLOSING} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: DrivePageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PRODUCTS_DRIVE.path,
    pageSeo(locale).PRODUCTS_DRIVE,
  )
}
