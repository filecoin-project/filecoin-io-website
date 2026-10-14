import type { ReactNode } from 'react'

import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'

import SiteLink from '@/components/ui/SiteLink'

const PILL =
  'inline-flex items-center gap-2 rounded-full border border-[#d6d6d6]/50 bg-paper py-[clamp(0.875rem,0.831rem+0.188vw,1rem)] font-heading text-button font-book tracking-[-0.02em] whitespace-nowrap'

/** The same pill as a plain label, for something that is not available yet ("Coming soon"). */
export function PillLabel({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    // A 20px line box, the height of the link pills' arrow, so both kinds of pill line up.
    <span
      className={clsx(
        PILL,
        'text-carbon/64 px-[clamp(1.25rem,1.162rem+0.376vw,1.5rem)] leading-5',
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * Grey pill with a diagonal arrow ("Learn More ↗", "Documentation ↗"). The arrow nudges out on
 * hover and the pill darkens a touch; pressing scales it down slightly.
 */
export default function PillLink({
  href,
  children,
  context,
  className,
  focRef,
}: {
  href: string | null
  children: string
  /** The link's foc_ref for click tracking (`data-foc-cta`). */
  focRef?: string
  /** Read after the label by screen readers, so repeated "Learn More" links stay distinct. */
  context?: ReactNode
  className?: string
}) {
  return (
    <SiteLink
      href={href}
      data-foc-cta={focRef}
      className={clsx(
        PILL,
        'group/pill text-carbon pr-[clamp(1.125rem,1.037rem+0.376vw,1.375rem)] pl-[clamp(1.25rem,1.162rem+0.376vw,1.5rem)] leading-[1.15]',
        'transition-[background-color,scale] duration-200 ease-out hover:bg-[#e8e8e8] active:scale-[0.97]',
        className,
      )}
    >
      {children}
      {context && <span className="sr-only"> {context}</span>}
      <ArrowUpRightIcon
        aria-hidden="true"
        className="ease-out-quint size-5 shrink-0 transition-transform duration-300 group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5"
      />
    </SiteLink>
  )
}
