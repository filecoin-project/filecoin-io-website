import { Badge } from '@filecoin-foundation/ui-filecoin/Badge'
import { BaseLink } from '@filecoin-foundation/ui-filecoin/BaseLink'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'
import { SectionContent } from '@filecoin-foundation/ui-filecoin/SectionContent'

import type { BuildingBlockRow } from '../data/buildingBlocks'

type BuildingBlocksSectionProps = {
  title: string
  description: string
  rows: Array<BuildingBlockRow>
}

export function BuildingBlocksSection({
  title,
  description,
  rows,
}: BuildingBlocksSectionProps) {
  return (
    <PageSection backgroundVariant="gray">
      <SectionContent headingTag="h2" title={title} description={description}>
        <ul className="divide-y divide-(--color-border-muted)">
          {rows.map((row) => (
            <li
              key={row.category}
              className="grid grid-cols-1 gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-6"
            >
              <div className="md:col-span-4">
                <p className="font-medium text-(--color-text-base)">
                  {row.category}
                </p>
                <p className="mt-1 text-(--color-paragraph-text)">
                  {row.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:col-span-8">
                {row.pills.map((pill) =>
                  pill.href === '#' ? (
                    <span
                      key={pill.label}
                      aria-label={`${pill.label} (coming soon)`}
                      className="cursor-default opacity-60"
                    >
                      <Badge
                        variant="neutral"
                        size="large"
                        textTransform="none"
                        icon={pill.icon}
                      >
                        {pill.label}
                      </Badge>
                    </span>
                  ) : (
                    <BaseLink
                      key={pill.label}
                      href={pill.href}
                      className="focus:brand-outline rounded-full transition-opacity hover:opacity-70"
                    >
                      <Badge
                        variant="neutral"
                        size="large"
                        textTransform="none"
                        icon={pill.icon}
                      >
                        {pill.label}
                      </Badge>
                    </BaseLink>
                  ),
                )}
              </div>
            </li>
          ))}
        </ul>
      </SectionContent>
    </PageSection>
  )
}
