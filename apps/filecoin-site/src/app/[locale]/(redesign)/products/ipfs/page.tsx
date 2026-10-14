import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import CostComparison from '@/components/sections/home/CostComparison'
import StartCards from '@/components/sections/home/StartCards'
import ClosingCta from '@/components/sections/product/ClosingCta'
import FeatureCards from '@/components/sections/product/FeatureCards'
import PinCube from '@/components/sections/product/PinCube'
import ProductHero from '@/components/sections/product/ProductHero'

type IpfsPageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

export default async function IpfsPage({ params }: IpfsPageProps) {
  const locale = toLocale((await params).locale)
  const { HERO, MIGRATE, PRICING, START, USES } = copy(locale).ipfs

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(locale, 'PRODUCTS_IPFS')}
      />
      {/* Opens on light grey, so the header takes its light tone (see globals.css). */}
      <main data-header-tone="light">
        <ProductHero {...HERO} bodyWidth="narrow" art={<PinCube />} />
        <FeatureCards id="pin-uses-title" {...USES} />
        <CostComparison
          id="pin-pricing-title"
          data={PRICING}
          tone="white"
          locale={locale}
        />
        <ClosingCta id="migrate-title" {...MIGRATE} />
        <StartCards cards={START} locale={locale} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: IpfsPageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PRODUCTS_IPFS.path,
    pageSeo(locale).PRODUCTS_IPFS,
  )
}
