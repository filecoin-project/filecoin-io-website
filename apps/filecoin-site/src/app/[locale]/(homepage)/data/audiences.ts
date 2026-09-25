import type { TranslationFunction } from '@/i18n/types'

import { PATHS } from '@/constants/paths'
import { FILECOIN_CLOUD_DOCS_URL } from '@/constants/siteMetadata'

import { graphicsData } from '@/data/graphicsData'

import motherboard from '@/assets/images/computer-motherboard-circuit.webp'
import pairProgramming from '@/assets/images/pair-programming.webp'

import type { Audience } from '../components/AudienceSelector'

// PLACEHOLDER — ICP list from the wireframe (Developer, Enterprise, Startup,
// Data center, Agent). Copy and CTA targets to be confirmed against the
// Propaganda positioning work (workstream 1). Order (agents first) and icons
// follow design review feedback (round 1, item 6); icons themselves are
// resolved client-side in AudienceSelector, keyed by id.
export function getAudiences(t: TranslationFunction): Array<Audience> {
  return [
    {
      id: 'agents',
      label: t('audiences.agents.label'),
      headline: t('audiences.agents.headline'),
      description: [
        t('audiences.agents.paragraph1'),
        t('audiences.agents.paragraph2'),
      ],
      cta: { label: t('audiences.agents.cta'), href: FILECOIN_CLOUD_DOCS_URL },
      image: { data: motherboard, alt: t('audiences.agents.imageAlt') },
    },
    {
      id: 'developers',
      label: t('audiences.developers.label'),
      headline: t('audiences.developers.headline'),
      description: [
        t('audiences.developers.paragraph1'),
        t('audiences.developers.paragraph2'),
      ],
      cta: {
        label: t('audiences.developers.cta'),
        href: FILECOIN_CLOUD_DOCS_URL,
      },
      image: { data: pairProgramming, alt: t('audiences.developers.imageAlt') },
    },
    {
      id: 'enterprises',
      label: t('audiences.enterprises.label'),
      headline: t('audiences.enterprises.headline'),
      description: [
        t('audiences.enterprises.paragraph1'),
        t('audiences.enterprises.paragraph2'),
      ],
      cta: {
        label: t('audiences.enterprises.cta'),
        href: PATHS.STORE_DATA_TALK_TO_EXPERT.path,
      },
      image: graphicsData.dataCenterServerRow,
    },
    {
      id: 'startups',
      label: t('audiences.startups.label'),
      headline: t('audiences.startups.headline'),
      description: [
        t('audiences.startups.paragraph1'),
        t('audiences.startups.paragraph2'),
      ],
      cta: { label: t('audiences.startups.cta'), href: PATHS.STORE_DATA.path },
      image: graphicsData.rocketLaunch,
    },
    {
      id: 'data-centers',
      label: t('audiences.dataCenters.label'),
      headline: t('audiences.dataCenters.headline'),
      description: [
        t('audiences.dataCenters.paragraph1'),
        t('audiences.dataCenters.paragraph2'),
      ],
      cta: {
        label: t('audiences.dataCenters.cta'),
        href: PATHS.PROVIDE_STORAGE.path,
      },
      image: graphicsData.serverBladeChassis,
    },
  ]
}
