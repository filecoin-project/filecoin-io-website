'use client'

import Image from 'next/image'

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import {
  ArchiveIcon,
  ArrowsClockwiseIcon,
  BracketsCurlyIcon,
  BroadcastIcon,
  FileCodeIcon,
  LightningIcon,
  PushPinIcon,
} from '@phosphor-icons/react/dist/ssr'
import { clsx } from 'clsx'

import { Badge } from '@filecoin-foundation/ui-filecoin/Badge'
import { BaseLink } from '@filecoin-foundation/ui-filecoin/BaseLink'
import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'
import type { IconProps } from '@filecoin-foundation/ui-filecoin/Icon'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'
import { SectionContent } from '@filecoin-foundation/ui-filecoin/SectionContent'

import { PATHS } from '@/constants/paths'
import {
  FILECOIN_CLOUD_DOCS_URL,
  FILECOIN_CLOUD_URL,
  FILECOIN_DOCS_URLS,
} from '@/constants/siteMetadata'

import type { CustomerStory } from '../data/customerStories'

const TAG_ICONS: Record<string, IconProps['component']> = {
  'Warm storage': LightningIcon,
  'Archival storage': ArchiveIcon,
  'Filecoin Beam': BroadcastIcon,
  'Filecoin Pin': PushPinIcon,
  'Filecoin Pay': ArrowsClockwiseIcon,
  'Smart contracts (FVM)': FileCodeIcon,
  'Synapse SDK': BracketsCurlyIcon,
}

const TAG_HREFS: Record<string, string> = {
  'Warm storage': FILECOIN_CLOUD_URL,
  'Archival storage': FILECOIN_DOCS_URLS.storageModel,
  'Filecoin Beam': FILECOIN_CLOUD_URL,
  'Filecoin Pin': FILECOIN_CLOUD_DOCS_URL,
  'Filecoin Pay': FILECOIN_CLOUD_URL,
  'Smart contracts (FVM)': FILECOIN_DOCS_URLS.filecoinVirtualMachine,
  'Synapse SDK': FILECOIN_CLOUD_DOCS_URL,
}

export type CustomerStoryTab = Omit<CustomerStory, 'logo'> & {
  logo: React.ReactNode
}

type CustomerStoriesSectionProps = {
  title: string
  description: string
  tablistLabel: string
  productsUsedLabel: string
  viewAllCta: string
  stories: Array<CustomerStoryTab>
}

export function CustomerStoriesSection({
  title,
  description,
  tablistLabel,
  productsUsedLabel,
  viewAllCta,
  stories,
}: CustomerStoriesSectionProps) {
  return (
    <PageSection backgroundVariant="light">
      <SectionContent
        headingTag="h2"
        title={title}
        description={description}
        ctaPosition="inline"
        cta={
          <Button href={PATHS.CASE_STUDIES.path} variant="ghost" size="compact">
            {viewAllCta}
          </Button>
        }
      >
        <div className="rounded-2xl border border-(--color-border-muted)">
          <TabGroup>
            <TabList
              aria-label={tablistLabel}
              className="flex flex-wrap gap-x-2 gap-y-1 overflow-x-auto border-b border-(--color-border-muted) px-4 sm:px-6"
            >
              {stories.map((story) => (
                <Tab
                  key={story.id}
                  className={clsx(
                    'flex shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent px-3 py-5 text-sm font-medium whitespace-nowrap text-(--color-paragraph-text) transition-colors',
                    'focus:outline-none data-selected:border-brand-700 data-selected:text-(--color-text-base) data-hover:text-(--color-text-base)',
                  )}
                >
                  {story.logo}
                  {story.tabLabel}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {stories.map((story) => (
                <TabPanel
                  key={story.id}
                  className="grid grid-cols-1 gap-10 p-6 sm:p-10 md:grid-cols-2 md:items-stretch md:gap-15"
                >
                  <div className="flex flex-col justify-between gap-8">
                    <Heading
                      tag="h3"
                      className="font-heading text-2xl/8 font-medium text-balance sm:text-3xl/10"
                    >
                      {story.headline}
                    </Heading>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-(--color-paragraph-text-subtle)">
                        {productsUsedLabel}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {story.tags.map((tag) => (
                          <BaseLink
                            key={tag}
                            href={TAG_HREFS[tag] ?? FILECOIN_CLOUD_URL}
                            className="focus:brand-outline rounded-full transition-opacity hover:opacity-70"
                          >
                            <Badge
                              variant="neutral"
                              size="large"
                              textTransform="none"
                              icon={TAG_ICONS[tag]}
                            >
                              {tag}
                            </Badge>
                          </BaseLink>
                        ))}
                      </div>
                    </div>

                    <blockquote className="space-y-3 border-l-2 border-brand-600 pl-6">
                      <p className="text-xl/8 text-pretty text-(--color-text-base)">
                        &ldquo;{story.quote}&rdquo;
                      </p>
                      <cite className="flex flex-wrap items-center gap-2 text-sm text-(--color-paragraph-text-subtle) not-italic">
                        {story.attribution}
                        {/* TODO: remove this tag once a real, approved quote
                            replaces the sample copy above */}
                        <span className="rounded-full border border-(--color-border-base) px-2 py-0.5 text-xs">
                          Sample quote — pending approval
                        </span>
                      </cite>
                    </blockquote>

                    <Button
                      href={story.ctaHref}
                      variant="tertiary"
                      className="self-start"
                    >
                      {story.ctaLabel}
                    </Button>
                  </div>

                  <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                    <Image
                      fill
                      src={story.image.data}
                      alt={story.image.alt}
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="object-cover [filter:saturate(0.85)_contrast(1.05)]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-brand-950/10 mix-blend-multiply"
                    />
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </SectionContent>
    </PageSection>
  )
}
