import type { ReactNode } from 'react'

import clsx from 'clsx'

import SiteLink from '@/components/ui/SiteLink'

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={clsx('block size-full', className)}
    >
      <path
        d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * A text link with a diagonal arrow ("Learn More ↗"). On hover the arrow flies out to the top
 * right as a fresh one slides in from the bottom left, and an underline draws in under the label.
 */
export default function ArrowLink({
  href,
  label,
  context,
  tabIndex,
  className,
}: {
  href: string | null
  label: string
  /** Read after the label by screen readers, so repeated "Learn More" links stay distinct. */
  context?: ReactNode
  tabIndex?: number
  className?: string
}) {
  return (
    <SiteLink
      href={href}
      tabIndex={tabIndex}
      className={clsx(
        'group/arrow font-heading text-body font-book text-ink inline-flex items-center gap-1 rounded-sm leading-[1.15] tracking-[-0.02em]',
        className,
      )}
    >
      <span className="ease-out-quint bg-[linear-gradient(currentColor,currentColor)] bg-size-[0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-400 group-hover/arrow:bg-size-[100%_1px] motion-reduce:transition-none">
        {label}
        {context && <span className="sr-only"> {context}</span>}
      </span>
      <span className="relative size-4 shrink-0 overflow-hidden">
        <Arrow className="ease-out-quint transition-transform duration-400 group-hover/arrow:translate-x-full group-hover/arrow:-translate-y-full motion-reduce:transition-none" />
        <Arrow className="ease-out-quint absolute inset-0 -translate-x-full translate-y-full transition-transform duration-400 group-hover/arrow:translate-0 motion-reduce:hidden" />
      </span>
    </SiteLink>
  )
}
