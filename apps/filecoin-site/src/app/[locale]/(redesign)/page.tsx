import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import CostComparison from '@/components/sections/home/CostComparison'
import GetStarted from '@/components/sections/home/GetStarted'
import Hero from '@/components/sections/home/Hero'
import LatestNews from '@/components/sections/home/LatestNews'
import MoreFeatures from '@/components/sections/home/MoreFeatures'
import NetworkCapacity from '@/components/sections/home/NetworkCapacity'
import StartCards from '@/components/sections/home/StartCards'
import StorageProviders from '@/components/sections/home/StorageProviders'
import StorageUseCases from '@/components/sections/home/StorageUseCases'
import TrustedBy from '@/components/sections/home/TrustedBy'
import WorksWithAgents from '@/components/sections/home/WorksWithAgents'

type HomePageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(locale, 'HOME')}
      />
      <main>
        {/* The hero and its logo row fill at least the first screen, so the next section never peeks in below. */}
        <div className="flex min-h-svh flex-col bg-slate-950">
          <Hero locale={locale} />
          <TrustedBy locale={locale} />
        </div>
        <NetworkCapacity locale={locale} />
        <CostComparison locale={locale} />
        <StorageUseCases locale={locale} />
        <MoreFeatures locale={locale} />
        <StorageProviders locale={locale} />
        <GetStarted locale={locale} />
        <WorksWithAgents locale={locale} />
        <StartCards locale={locale} />
        <LatestNews locale={locale} />
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(locale, PATHS.HOME.path, pageSeo(locale).HOME)
}
