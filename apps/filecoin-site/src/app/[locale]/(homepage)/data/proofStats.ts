import type { TranslationFunction } from '@/i18n/types'

import type { StatItem } from '../components/StatsRow'

// PLACEHOLDER DATA — figures below are illustrative for design review.
// `capacity` and `clients` carry over from the previous homepage (last updated
// early 2026). `proofSuccess` and `startingPrice` need a verified source before
// launch. See docs/homepage-redesign.md → "Placeholder inventory".
export function getProofStats(t: TranslationFunction): Array<StatItem> {
  return [
    {
      value: '1.95 EiB',
      label: t('proof.capacity.label'),
      description: t('proof.capacity.description'),
    },
    {
      value: '482',
      label: t('proof.clients.label'),
      description: t('proof.clients.description'),
    },
    {
      value: '99.9%',
      label: t('proof.proofSuccess.label'),
      description: t('proof.proofSuccess.description'),
    },
    {
      value: '$2.50',
      label: t('proof.startingPrice.label'),
      description: t('proof.startingPrice.description'),
    },
  ]
}
