import type { ComponentProps } from 'react'

import { PlaceholderLink } from '@/components/PlaceholderLink'

/**
 * A link that may not have a destination yet. `href: null` renders a placeholder link (looks
 * like a link, goes nowhere); other sites open in a new tab.
 */
export default function SiteLink({
  href,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { href: string | null }) {
  if (href === null) return <PlaceholderLink aria-disabled="true" {...props} />
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  )
}
