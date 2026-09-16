import Image from 'next/image'

import type { Locale } from '@/i18n/types'

import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'
import { CardGrid } from '@filecoin-foundation/ui-filecoin/CardGrid'
import { Icon } from '@filecoin-foundation/ui-filecoin/Icon'
import { LogoSection } from '@filecoin-foundation/ui-filecoin/LogoSection/LogoSection'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'
import { SectionContent } from '@filecoin-foundation/ui-filecoin/SectionContent'

import { PATHS } from '@/constants/paths'

import { graphicsData } from '@/data/graphicsData'
import { trustedByLogos } from '@/data/trustedByLogos'

import { createMetadata } from '@/utils/createMetadata'
import { getLocalePath } from '@/utils/getLocalePath'
import { getTranslatedMetadata } from '@/utils/getTranslatedMetadata'


import { GradientOverlay } from '@/components/GradientOverlay'
import { Navigation } from '@/components/Navigation/Navigation'

import { BuildingBlocksSection } from './components/BuildingBlocksSection'
import { CustomerStoriesSection } from './components/CustomerStoriesSection'
import { FilecoinCloudSection } from './components/FilecoinCloudSection'
import { HeroSection } from './components/HeroSection'
import { LatestNewsSection } from './components/LatestNewsSection'
import { MetricCard } from './components/MetricCard'
import { OneNetworkSection } from './components/OneNetworkSection'
import { StartBuildingSection } from './components/StartBuildingSection'
import { buildingBlocks } from './data/buildingBlocks'
import { customerStories } from './data/customerStories'
import { getFilecoinByTheNumbers } from './data/filecoinByTheNumbers'
import { oneNetworkRoles } from './data/oneNetworkRoles'
import { generateStructuredData } from './utils/generateStructuredData'

import { getFeaturedBlogPosts } from '@/blog/utils/getFeaturedBlogPosts'

export default async function Home() {
  const locale = await getLocale()
  const t = await getTranslations(PATHS.HOME.path)
  const metadata = await getTranslatedMetadata(PATHS.HOME.path)

  const filecoinByTheNumbers = getFilecoinByTheNumbers(t)

  const featuredBlogPosts = await getFeaturedBlogPosts(locale as Locale, 3)
  const [leadPost] = featuredBlogPosts
  const latestPost = leadPost && {
    title: leadPost.title,
    href: `${PATHS.BLOG.path}/${leadPost.slug}`,
  }

  const customerStoriesTabs = customerStories.map((story) => ({
    ...story,
    logo:
      story.logo.type === 'svg' ? (
        <story.logo.src aria-hidden="true" className="h-4.5 w-auto shrink-0" />
      ) : (
        <Image
          aria-hidden="true"
          src={story.logo.src}
          alt=""
          width={64}
          height={64}
          quality={100}
          className="size-4.5 shrink-0 rounded-full object-cover"
        />
      ),
  }))

  const oneNetworkRolesTabs = oneNetworkRoles.map((role) => ({
    ...role,
    icon: <Icon component={role.icon} size={20} />,
  }))

  return (
    <>
      <StructuredDataScript structuredData={generateStructuredData(metadata)} />

      <div className="relative isolate">
        <Navigation backgroundVariant="transparentDark" />
        <HeroSection latestPost={latestPost} />
        <Image
          fill
          priority
          sizes="100vw"
          src={graphicsData.earthFromDeepSpace.data}
          alt={graphicsData.earthFromDeepSpace.alt}
          className="absolute bottom-0 -z-10 h-full object-cover object-top"
        />
        <GradientOverlay />
      </div>

      <PageSection backgroundVariant="dark" paddingVariant="topNone">
        <LogoSection
          headingTag="h2"
          title={t('trustedBy.title')}
          logos={trustedByLogos}
          gradientVariant="dark"
        />
      </PageSection>

      <PageSection backgroundVariant="gray">
        <SectionContent
          centerTitle
          headingTag="h2"
          title={t('byTheNumbers.title')}
        >
          <CardGrid as="ul" variant="mdThreeDivided">
            {filecoinByTheNumbers.map(({ title, subTitle, description }) => (
              <MetricCard
                key={title}
                title={title}
                subTitle={subTitle}
                description={description}
              />
            ))}
          </CardGrid>
        </SectionContent>
      </PageSection>

      <CustomerStoriesSection
        title={t('builtIntoRealProducts.title')}
        description={t('builtIntoRealProducts.description')}
        tablistLabel={t('builtIntoRealProducts.tablistLabel')}
        productsUsedLabel={t('builtIntoRealProducts.productsUsedLabel')}
        viewAllCta={t('builtIntoRealProducts.viewAllCta')}
        stories={customerStoriesTabs}
      />

      <FilecoinCloudSection
        eyebrow={t('filecoinCloud.eyebrow')}
        title={t('filecoinCloud.title')}
        description={t('filecoinCloud.description')}
        quickstartCta={t('filecoinCloud.quickstartCta')}
        exploreCta={t('filecoinCloud.exploreCta')}
        checklist={[
          {
            title: t('filecoinCloud.checklist.warmStorage.title'),
            description: t('filecoinCloud.checklist.warmStorage.description'),
          },
          {
            title: t('filecoinCloud.checklist.beam.title'),
            description: t('filecoinCloud.checklist.beam.description'),
          },
          {
            title: t('filecoinCloud.checklist.pay.title'),
            description: t('filecoinCloud.checklist.pay.description'),
          },
        ]}
      />

      <OneNetworkSection
        title={t('oneNetwork.title')}
        description={t('oneNetwork.description')}
        tablistLabel={t('oneNetwork.tablistLabel')}
        roles={oneNetworkRolesTabs}
      />

      <BuildingBlocksSection
        title={t('buildingBlocks.title')}
        description={t('buildingBlocks.description')}
        rows={buildingBlocks}
      />

      <LatestNewsSection
        title={t('latestNews.title')}
        description={t('latestNews.description')}
        viewAllCta={t('latestNews.viewAllCta')}
        posts={featuredBlogPosts}
      />

      <StartBuildingSection
        title={t('startBuilding.title')}
        description={t('startBuilding.description')}
        startCta={t('startBuilding.startCta')}
        talkToSalesCta={t('startBuilding.talkToSalesCta')}
      />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getTranslatedMetadata(PATHS.HOME.path)

  return createMetadata({
    title: { absolute: title },
    description,
    path: await getLocalePath(PATHS.HOME.path),
    image: graphicsData.classicLibraryInterior.data.src,
  })
}
