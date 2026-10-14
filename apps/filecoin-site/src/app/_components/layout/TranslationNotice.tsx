import { cookies } from 'next/headers'

import { hash } from 'ohash'

import { TRANSLATION_NOTICE_TEXT } from '@/constants/translationNotice'

import { NoticeBar } from './NoticeBar'

/**
 * The AI-translation notice on the redesigned Chinese pages, dismissed with the same cookie as
 * the legacy pages' `PersistedBanner`, so dismissing it once hides it everywhere.
 */
export async function TranslationNotice() {
  const cookieName = `show-banner-${hash(TRANSLATION_NOTICE_TEXT)}`

  const cookieStore = await cookies()
  if (cookieStore.get(cookieName)?.value === 'false') {
    return null
  }

  return <NoticeBar text={TRANSLATION_NOTICE_TEXT} cookieName={cookieName} />
}
