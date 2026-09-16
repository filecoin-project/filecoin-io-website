'use client'

import { clsx } from 'clsx'

import { backgroundVariants, useBackground } from '../Section/Section'

import { NavigationMenuLink } from './NavigationMenuLink'
import { type NavigationMenuItem } from './types'

const roundedStyle = 'rounded-2xl'

type NavigationMenuPanelProps = {
  items: NavigationMenuItem['items']
  compactLinks?: NavigationMenuItem['compactLinks']
}

export function NavigationMenuPanel({
  items,
  compactLinks,
}: NavigationMenuPanelProps) {
  const { theme } = useBackground()

  return (
    <div className={clsx(roundedStyle, backgroundVariants[theme])}>
      <div
        className={clsx(
          roundedStyle,
          'border border-(--color-navigation-menu-panel-border) bg-(--color-navigation-menu-panel-background)',
        )}
      >
        <div className="flex divide-x divide-(--color-border-base) py-5">
          {items.map((item) => {
            const [primary, ...secondary] = item.links
            const isCompactTier =
              secondary.length > 0 && !secondary[0].description

            return (
              <div key={item.title} className="px-5">
                <p className="mb-1 px-3 text-xs font-semibold tracking-wide text-(--color-paragraph-text) uppercase">
                  {item.title}
                </p>
                <ul>
                  <li>
                    <NavigationMenuLink {...primary} />
                  </li>
                </ul>
                {secondary.length > 0 && (
                  <ul
                    className={clsx(
                      'mt-1',
                      isCompactTier &&
                        'flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs [&_svg]:size-3',
                    )}
                  >
                    {secondary.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink {...link} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
        {compactLinks && compactLinks.length > 0 && (
          <div className="flex flex-col divide-y divide-(--color-border-base) border-t border-(--color-border-base) text-xs [contain:inline-size] [&_svg]:size-3">
            {compactLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-1 px-5 py-5">
                <span className="px-3 text-(--color-paragraph-text)">
                  {group.title}
                </span>
                <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
