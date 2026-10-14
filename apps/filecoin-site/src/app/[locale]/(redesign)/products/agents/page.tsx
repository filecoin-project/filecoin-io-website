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
import AgentOrb from '@/components/sections/product/AgentOrb'
import Callout from '@/components/sections/product/Callout'
import FeatureCards from '@/components/sections/product/FeatureCards'
import ProductHero from '@/components/sections/product/ProductHero'
import SkillsCta from '@/components/sections/product/SkillsCta'

type AgentsPageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

export default async function AgentsPage({ params }: AgentsPageProps) {
  const locale = toLocale((await params).locale)
  const { HERO, SKILLS, START, TRAINING, USES } = copy(locale).agents

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(
          locale,
          'PRODUCTS_AGENTS',
        )}
      />
      {/* Opens on light grey, so the header takes its light tone (see globals.css). */}
      <main data-header-tone="light">
        <ProductHero
          {...HERO}
          bodyWidth="wide"
          art={<AgentOrb className="max-w-[20rem] lg:max-w-none" />}
        />
        <FeatureCards id="agent-uses-title" {...USES} />
        <SkillsCta id="skills-title" {...SKILLS} locale={locale} />
        <Callout id="training-title" {...TRAINING} />
        <StartCards cards={START} locale={locale} focPrefix="agent-skills" />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: AgentsPageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PRODUCTS_AGENTS.path,
    pageSeo(locale).PRODUCTS_AGENTS,
  )
}
