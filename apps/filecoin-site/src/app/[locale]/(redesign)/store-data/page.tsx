import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import { DataStorageArt } from '@/components/sections/home/storage-art/StorageArts'
import ClosingCta from '@/components/sections/product/ClosingCta'
import CodeExamples from '@/components/sections/product/CodeExamples'
import FeatureCards from '@/components/sections/product/FeatureCards'
import ProductHero from '@/components/sections/product/ProductHero'
import SectionIntro from '@/components/sections/product/SectionIntro'
import StoragePlans from '@/components/sections/product/StoragePlans'

type StoreDataPageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

export default async function StoreDataPage({ params }: StoreDataPageProps) {
  const locale = toLocale((await params).locale)
  const { CLOSING, GET_STARTED, HERO, INTEGRITY, STORAGE_PLANS } =
    copy(locale).dataStorage

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(locale, 'STORE_DATA')}
      />
      {/* Opens on light grey, so the header takes its light tone; ends on carbon, which the footer continues (see globals.css). */}
      <main data-header-tone="light" data-footer-tone="carbon">
        <ProductHero {...HERO} art={<DataStorageArt />} />
        <FeatureCards id="integrity-title" {...INTEGRITY} />
        <StoragePlans id="storage-plans-title" {...STORAGE_PLANS} />
        <section
          aria-labelledby="get-started-code-title"
          className="bg-paper py-section"
        >
          <div className="container-site">
            <SectionIntro
              id="get-started-code-title"
              title={GET_STARTED.title}
              body={GET_STARTED.body}
              align="right"
            />
            <div className="mt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)]">
              <CodeExamples
                id="code-examples"
                examples={GET_STARTED.examples}
                docs={GET_STARTED.docs}
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
}: StoreDataPageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(locale, PATHS.STORE_DATA.path, pageSeo(locale).STORE_DATA)
}
