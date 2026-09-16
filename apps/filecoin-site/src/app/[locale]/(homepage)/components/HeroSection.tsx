import { useTranslations } from 'next-intl'

import { Announcement } from '@filecoin-foundation/ui-filecoin/Announcement'
import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { PageHeader } from '@filecoin-foundation/ui-filecoin/PageHeader'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'

import { PATHS } from '@/constants/paths'
import { FILECOIN_CLOUD_URL } from '@/constants/siteMetadata'

type HeroSectionProps = {
  latestPost?: { title: string; href: string }
}

export function HeroSection({ latestPost }: HeroSectionProps) {
  const t = useTranslations('/.hero')

  return (
    <PageSection backgroundVariant="transparentDark" paddingVariant="none">
      <div className="space-y-10 py-25 md:py-30">
        <Announcement
          centered
          badge="New"
          href={latestPost ? latestPost.href : FILECOIN_CLOUD_URL}
        >
          {latestPost ? latestPost.title : t('announcement')}
        </Announcement>

        <PageHeader
          centered
          title={t('headline')}
          description={t('description')}
          variant="highContrast"
          cta={[
            // TODO: replace "#" with the products page URL once available
            <Button href="#" variant="primary">
              {t('cta.main')}
            </Button>,
            <Button
              href={PATHS.STORE_DATA_TALK_TO_EXPERT.path}
              variant="ghost"
            >
              {t('cta.secondary')}
            </Button>,
          ]}
        />
      </div>
    </PageSection>
  )
}
