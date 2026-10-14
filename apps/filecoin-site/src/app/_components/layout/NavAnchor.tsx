import type { ReactNode } from 'react'

import clsx from 'clsx'

import { opensInNewTab, type NavLink } from '@/data/site-nav'

import { PlaceholderLink } from '@/components/PlaceholderLink'

/**
 * A menu link. `href: null` is a destination that does not exist yet; external sites open in a
 * new tab. Internal links are plain anchors so each page load gets its own review session.
 */
export default function NavAnchor({
  link,
  className,
  onNavigate,
  navGroup,
  children,
}: {
  link: NavLink
  className?: string
  /** The `nav_group` sent with a click on the link. */
  navGroup?: string
  onNavigate?: () => void
  children?: ReactNode
}) {
  const content = children ?? link.label
  if (link.href === null || link.href === '#') {
    return (
      <PlaceholderLink className={className} aria-disabled="true">
        {content}
      </PlaceholderLink>
    )
  }
  const external = opensInNewTab(link.href)
  return (
    <a
      className={className}
      href={link.href}
      data-foc-cta={link.ref}
      data-foc-nav={link.ref ? navGroup : undefined}
      title={link.title}
      onClick={onNavigate}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  )
}

/** The small pill after a label, e.g. "Coming soon". */
export function NavBadge({
  children,
  blue = false,
}: {
  children: ReactNode
  blue?: boolean
}) {
  return (
    <span
      className={clsx(
        'ml-2 inline-flex h-5 items-center rounded-full px-2 align-middle text-[0.625rem] font-semibold tracking-wide whitespace-nowrap uppercase',
        blue ? 'bg-blue-500/20 text-blue-300' : 'bg-white/8 text-slate-300',
      )}
    >
      {children}
    </span>
  )
}
