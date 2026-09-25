import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'

import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { ButtonRow } from '@filecoin-foundation/ui-filecoin/ButtonRow'
import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'
import { Icon } from '@filecoin-foundation/ui-filecoin/Icon'

import type { SpotlightFeature } from '../data/productSpotlight'

import { CodeSnippet, type CodeLine } from './CodeSnippet'

type ProductSpotlightProps = {
  eyebrow: string
  title: string
  description: string
  features: Array<SpotlightFeature>
  snippet: Array<CodeLine>
  agentPrompt: Array<CodeLine>
  cta: {
    primary: { href: string; label: string }
    secondary: { href: string; label: string }
  }
}

export function ProductSpotlight({
  eyebrow,
  title,
  description,
  features,
  snippet,
  agentPrompt,
  cta,
}: ProductSpotlightProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-15 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-16">
      <div className="flex flex-col gap-10">
        <div className="space-y-6">
          <p className="text-brand-400 text-sm font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
          <Heading tag="h2" variant="section-heading">
            {title}
          </Heading>
          <p className="text-2xl/8.5 text-pretty text-(--color-subheading-text-muted)">
            {description}
          </p>
        </div>

        <ul className="space-y-5">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-4">
              <span className="text-brand-500 mt-0.5 shrink-0">
                <Icon component={CheckCircleIcon} size={24} weight="fill" />
              </span>
              <div>
                <p className="font-medium text-(--color-text-base)">
                  {feature.title}
                </p>
                <p className="text-(--color-paragraph-text)">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <ButtonRow
          buttons={[
            <Button href={cta.primary.href} variant="primary">
              {cta.primary.label}
            </Button>,
            <Button href={cta.secondary.href} variant="tertiary">
              {cta.secondary.label}
            </Button>,
          ]}
        />
      </div>

      <div className="flex flex-col gap-6">
        <CodeSnippet filename="store.ts" language="ts" lines={snippet} />
        <CodeSnippet filename="prompt.txt" language="txt" lines={agentPrompt} />
      </div>
    </div>
  )
}
