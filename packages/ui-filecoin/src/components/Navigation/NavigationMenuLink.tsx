import { clsx } from 'clsx'

import { getUIConfig } from '../../config/ui-config'
import { isExternalLink } from '../../utils/linkUtils'

import { ExternalLink, type ExternalLinkProps } from './components/ExternalLink'
import { InternalLink, type InternalLinkProps } from './components/InternalLink'

export type NavigationMenuLinkProps = InternalLinkProps | ExternalLinkProps

export function NavigationMenuLink({
  href,
  label,
  description,
  ...rest
}: NavigationMenuLinkProps) {
  const { baseDomain } = getUIConfig()

  const isExternal = isExternalLink(href, baseDomain)

  const props = {
    href,
    label,
    description,
    className: clsx(
      'group focus:brand-outline inline-block max-w-56 rounded-lg text-(--color-navigation-menu-panel-icon) hover:bg-(--color-navigation-menu-link-background-hover) focus:bg-(--color-navigation-menu-link-background-hover)',
      description ? 'p-3' : 'px-3 py-1.5',
    ),
    ['aria-label']: `${label} page (${isExternal ? 'external link' : 'internal link'})`,
    ...rest,
  }

  const Link = isExternal ? ExternalLink : InternalLink

  return <Link {...props} />
}
