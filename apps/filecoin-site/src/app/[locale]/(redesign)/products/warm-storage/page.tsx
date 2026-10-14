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
import ClosingCta from '@/components/sections/product/ClosingCta'
import CodeExamples from '@/components/sections/product/CodeExamples'
import FeatureCards from '@/components/sections/product/FeatureCards'
import OrbitStorage from '@/components/sections/product/OrbitStorage'
import ProductHero from '@/components/sections/product/ProductHero'
import SectionIntro from '@/components/sections/product/SectionIntro'

type WarmStoragePageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

export default async function WarmStoragePage({
  params,
}: WarmStoragePageProps) {
  const locale = toLocale((await params).locale)
  const { BUILT_FOR, CLOSING, HERO, INTEGRATE, PRICING } =
    copy(locale).warmStorage

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(
          locale,
          'PRODUCTS_WARM_STORAGE',
        )}
      />
      {/* Opens on light grey, so the header takes its light tone; ends on carbon, which the footer continues (see globals.css). */}
      <main data-header-tone="light" data-footer-tone="carbon">
        <ProductHero {...HERO} art={<OrbitStorage />} />
        <FeatureCards id="built-for-title" {...BUILT_FOR} />
        <CostComparison
          id="pricing-title"
          data={PRICING}
          tone="white"
          locale={locale}
        />
        <section
          aria-labelledby="integrate-title"
          className="bg-paper py-section"
        >
          <div className="container-site">
            <SectionIntro
              id="integrate-title"
              title={INTEGRATE.title}
              body={INTEGRATE.body}
              align="right"
            />
            <div className="mt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)]">
              <CodeExamples
                id="code-examples"
                examples={INTEGRATE.examples}
                docs={INTEGRATE.docs}
                locale={locale}
              />
            </div>
          </div>
        </section>
        <ClosingCta id="closing-title" {...CLOSING} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: WarmStoragePageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PRODUCTS_WARM_STORAGE.path,
    pageSeo(locale).PRODUCTS_WARM_STORAGE,
  )
}
