'use client'

import type { ComponentProps } from 'react'

/** A link to a destination that does not exist yet. Looks like a link, goes nowhere. */
export function PlaceholderLink({
  onClick,
  ...props
}: Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href="#"
      title="Placeholder destination"
      data-nav-placeholder=""
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
      }}
      {...props}
    />
  )
}
