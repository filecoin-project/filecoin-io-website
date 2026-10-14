// The EN / 中文 switch. Every page of this build exists in both languages, and so do the
// filecoin.io pages it links to (Learn, Blog, Case Studies, Community Hub), so the switch keeps
// the reader on the same page in the other language.

import { localePath, splitPath, type Locale } from '@/i18n/locales'

/** Where the switch to `to` goes from `pathname`: the same page in that language. */
export function switchHref(pathname: string | null, to: Locale): string {
  return localePath(to, splitPath(pathname).path)
}
