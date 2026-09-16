'use client'

import Image from 'next/image'

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr'
import { clsx } from 'clsx'

import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'
import { Icon } from '@filecoin-foundation/ui-filecoin/Icon'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'
import { SectionContent } from '@filecoin-foundation/ui-filecoin/SectionContent'

import type { NetworkRole } from '../data/oneNetworkRoles'

export type NetworkRoleTab = Omit<NetworkRole, 'icon'> & {
  icon: React.ReactNode
}

type OneNetworkSectionProps = {
  title: string
  description: string
  tablistLabel: string
  roles: Array<NetworkRoleTab>
}

export function OneNetworkSection({
  title,
  description,
  tablistLabel,
  roles,
}: OneNetworkSectionProps) {
  return (
    <PageSection backgroundVariant="light">
      <SectionContent headingTag="h2" title={title} description={description}>
        <TabGroup className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-15">
          <TabList
            aria-label={tablistLabel}
            className="divide-y divide-(--color-border-muted) border-y border-(--color-border-muted) lg:col-span-2 lg:border-y-0"
          >
            {roles.map((role) => (
              <Tab
                key={role.id}
                className={clsx(
                  'group flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left transition-colors',
                  'focus:outline-none data-hover:bg-slate-50',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="text-brand-500 group-data-selected:text-brand-700">
                    {role.icon}
                  </span>
                  <span
                    className={clsx(
                      'font-medium text-(--color-paragraph-text) transition-colors',
                      'group-data-selected:text-(--color-text-base) group-data-hover:text-(--color-text-base)',
                    )}
                  >
                    {role.tabLabel}
                  </span>
                </span>

                <span className="text-brand-500 opacity-30 transition-opacity group-data-hover:opacity-60 group-data-selected:opacity-100">
                  <Icon component={CaretRightIcon} size={16} weight="bold" />
                </span>
              </Tab>
            ))}
          </TabList>

          <TabPanels className="lg:col-span-9">
            {roles.map((role) => (
              <TabPanel
                key={role.id}
                className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-15"
              >
                <div className="flex flex-col justify-center gap-6">
                  <Heading
                    tag="h3"
                    className="font-heading text-2xl/8 font-medium text-balance sm:text-3xl/10"
                  >
                    {role.headline}
                  </Heading>
                  <div className="space-y-4">
                    {role.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base/7 text-pretty text-(--color-paragraph-text)"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <Button
                    href={role.ctaHref}
                    variant="primary"
                    size="compact"
                    className="self-start"
                  >
                    {role.ctaLabel}
                  </Button>
                </div>

                <div className="relative min-h-64 overflow-hidden rounded-xl">
                  <Image
                    fill
                    src={role.image.data}
                    alt={role.image.alt}
                    sizes="(min-width: 768px) 35vw, 90vw"
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
      </SectionContent>
    </PageSection>
  )
}
