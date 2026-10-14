import type { ReactNode } from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import type { UseCase } from '@/data/home'

import ScrollSteps from '@/components/sections/home/ScrollSteps'
import {
  AgentStorageArt,
  BackupArchivesArt,
  DataStorageArt,
  EnterpriseStorageArt,
  IpfsArt,
} from '@/components/sections/home/storage-art/StorageArts'

// Illustrations are server-rendered markup; the client part only switches which one plays.
const ART: Record<UseCase['id'], ReactNode> = {
  'data-storage': <DataStorageArt />,
  'backup-archives': <BackupArchivesArt />,
  'agent-storage': <AgentStorageArt />,
  ipfs: <IpfsArt />,
  enterprise: <EnterpriseStorageArt />,
}

/** "Store and serve for any type of data": pinned, scroll-driven walk through its use cases. */
export default function StorageUseCases({
  locale = 'en',
}: {
  locale?: Locale
}) {
  const { title, intro, linkLabel, steps } = copy(locale).home.STORAGE_USE_CASES
  return (
    <ScrollSteps
      id="store-and-serve"
      title={title}
      intro={intro}
      steps={steps.map(({ id, title, body, href }) => ({
        id,
        title,
        body,
        art: ART[id],
        link: { label: linkLabel, href },
      }))}
    />
  )
}
