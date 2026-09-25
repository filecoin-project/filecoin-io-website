import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'
import { SectionContent } from '@filecoin-foundation/ui-filecoin/SectionContent'

import { PATHS } from '@/constants/paths'
import { FILECOIN_CLOUD_DOCS_URL } from '@/constants/siteMetadata'

type StartBuildingSectionProps = {
  title: string
  description: string
  startCta: string
  talkToSalesCta: string
}

export function StartBuildingSection({
  title,
  description,
  startCta,
  talkToSalesCta,
}: StartBuildingSectionProps) {
  return (
    <PageSection backgroundVariant="dark" paddingVariant="bottomCompact">
      <div className="mx-auto max-w-xl">
        <SectionContent
          centerTitle
          headingTag="h2"
          title={title}
          description={description}
          ctaPosition="below-center"
          cta={[
            <Button href={FILECOIN_CLOUD_DOCS_URL} variant="primary">
              {startCta}
            </Button>,
            <Button href={PATHS.STORE_DATA_TALK_TO_EXPERT.path} variant="tertiary">
              {talkToSalesCta}
            </Button>,
          ]}
        />
      </div>
    </PageSection>
  )
}
