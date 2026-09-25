'use client'

import Image, { type StaticImageData } from 'next/image'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import {
  BuildingsIcon,
  CaretRightIcon,
  CodeIcon,
  CpuIcon,
  RobotIcon,
  RocketLaunchIcon,
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'
import { Icon } from '@filecoin-foundation/ui-filecoin/Icon'

export type AudienceId =
  | 'agents'
  | 'developers'
  | 'enterprises'
  | 'startups'
  | 'data-centers'

export type Audience = {
  id: AudienceId
  label: string
  headline: string
  description: Array<string>
  cta: { label: string; href: string }
  image: { data: StaticImageData; alt: string }
}

type AudienceSelectorProps = {
  audiences: Array<Audience>
}

// Resolved here rather than in data/audiences.ts: Phosphor icons are
// functions and cannot be serialised across the server → client boundary.
const AUDIENCE_ICONS = {
  agents: RobotIcon,
  developers: CodeIcon,
  enterprises: BuildingsIcon,
  startups: RocketLaunchIcon,
  'data-centers': CpuIcon,
} satisfies Record<AudienceId, typeof RobotIcon>

export function AudienceSelector({ audiences }: AudienceSelectorProps) {
  const t = useTranslations('/.audiences')

  return (
    <TabGroup className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <TabList
        aria-label={t('tabListLabel')}
        className="logo-section-scroll-bar flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
      >
        {audiences.map(({ id, label }) => (
          <Tab
            key={id}
            className="group data-selected:border-brand-700 flex shrink-0 cursor-pointer items-center justify-between gap-4 rounded-full border border-(--color-border-muted) px-5 py-3 text-left text-lg font-medium text-(--color-paragraph-text) transition-colors hover:text-(--color-text-base) focus:outline-none data-focus:bg-(--color-card-background-hover) data-selected:text-(--color-text-base) lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:px-0 lg:py-5 lg:text-2xl/8 lg:data-selected:border-(--color-border-muted)"
          >
            <span className="flex items-center gap-3">
              <span className="text-brand-700 shrink-0">
                <Icon component={AUDIENCE_ICONS[id]} size={24} />
              </span>
              <span>{label}</span>
            </span>
            <span className="text-brand-700 hidden opacity-0 transition-opacity group-data-selected:opacity-100 lg:block">
              <Icon component={CaretRightIcon} size={24} weight="bold" />
            </span>
          </Tab>
        ))}
      </TabList>

      <TabPanels className="lg:col-span-8">
        {audiences.map(({ id, headline, description, cta, image }) => (
          <TabPanel
            key={id}
            className="grid grid-cols-1 gap-10 focus:outline-none md:grid-cols-2 md:gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-16"
          >
            <div className="flex flex-col justify-center gap-8">
              <Heading tag="h3" className="text-2xl/8.5 font-medium">
                {headline}
              </Heading>
              <div className="space-y-5">
                {description.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-xl/7 text-pretty text-(--color-paragraph-text)"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div>
                <Button href={cta.href} variant="primary">
                  {cta.label}
                </Button>
              </div>
            </div>

            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-(--color-border-muted) md:aspect-auto md:min-h-96">
              <Image
                fill
                src={image.data}
                alt={image.alt}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}
