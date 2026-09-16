import { CheckIcon } from '@phosphor-icons/react/dist/ssr'

import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { ButtonRow } from '@filecoin-foundation/ui-filecoin/ButtonRow'
import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'
import { IconBadge } from '@filecoin-foundation/ui-filecoin/IconBadge'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'

import { FILECOIN_CLOUD_DOCS_URL, FILECOIN_CLOUD_URL } from '@/constants/siteMetadata'

import { filecoinCloudCodeWindows } from '../data/filecoinCloudCode'

import { CodeWindow } from './FilecoinCloud/CodeWindow'

type ChecklistItem = {
  title: string
  description: string
}

type FilecoinCloudSectionProps = {
  eyebrow: string
  title: string
  description: string
  quickstartCta: string
  exploreCta: string
  checklist: Array<ChecklistItem>
}

export function FilecoinCloudSection({
  eyebrow,
  title,
  description,
  quickstartCta,
  exploreCta,
  checklist,
}: FilecoinCloudSectionProps) {
  return (
    <PageSection backgroundVariant="dark">
      <div className="grid grid-cols-1 gap-15 lg:grid-cols-11 lg:gap-10">
        <div className="space-y-12 lg:col-span-5">
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">
              {eyebrow}
            </p>
            <Heading tag="h2" variant="section-heading">
              {title}
            </Heading>
            <p className="text-xl/8 text-pretty text-(--color-paragraph-text)">
              {description}
            </p>
          </div>

          <ul className="space-y-8">
            {checklist.map((item) => (
              <li key={item.title} className="flex gap-4">
                <div className="pt-0.5">
                  <IconBadge component={CheckIcon} size="xs" variant="filled" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-medium text-(--color-text-base)">
                    {item.title}
                  </p>
                  <p className="text-(--color-paragraph-text)">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <ButtonRow
            buttons={[
              <Button href={FILECOIN_CLOUD_DOCS_URL} variant="primary">
                {quickstartCta}
              </Button>,
              <Button href={FILECOIN_CLOUD_URL} variant="tertiary">
                {exploreCta}
              </Button>,
            ]}
          />
        </div>

        <div className="space-y-6 lg:col-span-6">
          {filecoinCloudCodeWindows.map((codeWindow) => (
            <CodeWindow key={codeWindow.filename} {...codeWindow} />
          ))}
        </div>
      </div>
    </PageSection>
  )
}
