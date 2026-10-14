import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import StartCards from '@/components/sections/home/StartCards'
import OfferCard from '@/components/sections/pricing/OfferCard'
import ClosingCta from '@/components/sections/product/ClosingCta'
import PlanSwitch from '@/components/sections/product/PlanSwitch'
import ProductHero from '@/components/sections/product/ProductHero'
import SectionIntro from '@/components/sections/product/SectionIntro'

type PricingPageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

/**
 * Laid out like the agents page: the light hero with its plan card, a row of three cards, a
 * centred call to action on the carbon dark, then the homepage's "Start building today" cards.
 */
export default async function PricingPage({ params }: PricingPageProps) {
  const locale = toLocale((await params).locale)
  const { CHOOSE, HERO, HERO_PLANS, PLANS, START } = copy(locale).pricing

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(locale, 'PRICING')}
      />
      {/* Opens on light grey, so the header takes its light tone (see globals.css). */}
      <main data-header-tone="light">
        <ProductHero
          {...HERO}
          bodyWidth="wide"
          art={<PlanSwitch plans={HERO_PLANS} />}
        />
        <section aria-labelledby="plans-title" className="py-section bg-white">
          <div className="container-site">
            <SectionIntro
              id="plans-title"
              title={PLANS.title}
              body={PLANS.body}
            />
            <ul className="mt-[clamp(2rem,1.648rem+1.502vw,3rem)] grid grid-cols-1 gap-[clamp(1rem,0.472rem+2.254vw,2.5rem)] lg:grid-cols-3">
              {PLANS.offers.map((offer, i) => (
                <OfferCard
                  key={offer.name}
                  as="li"
                  offer={offer}
                  delay={i * 90}
                  locale={locale}
                />
              ))}
            </ul>
          </div>
        </section>
        <ClosingCta id="choose-title" {...CHOOSE} />
        <StartCards cards={START} locale={locale} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: PricingPageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(locale, PATHS.PRICING.path, pageSeo(locale).PRICING)
}
