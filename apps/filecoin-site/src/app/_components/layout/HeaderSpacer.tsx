import { clsx } from 'clsx'

type HeaderSpacerProps = {
  /** The header's colour over this page's top: dark text on a light page. */
  tone?: 'dark' | 'light'
}

/**
 * Room for the fixed header on the legacy pages, which were laid out for an in-flow one; it
 * also carries the header's tone. On a light page it is white; otherwise the page's own
 * background shows through, so a hero image reaches up behind the header.
 */
export function HeaderSpacer({ tone = 'dark' }: HeaderSpacerProps) {
  return (
    <div
      aria-hidden="true"
      data-header-tone={tone}
      className={clsx('h-(--header-h)', tone === 'light' && 'bg-white')}
    />
  )
}
