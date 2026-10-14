'use client'

import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'

import clsx from 'clsx'

import type { Plan } from './plan-switch/fil-plan-switch'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'fil-plan-switch': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        plans?: string
        accent?: string
        'hide-controls'?: '' | boolean
      }
    }
  }
}

/**
 * The pricing hero's plan card: it steps through the plans, rolling to each one's price, and
 * sends three copies of the data to three independent providers (`<fil-plan-switch>`, see
 * ./plan-switch/fil-plan-switch.ts). The element is defined in the browser only; until then the
 * wrapper holds its 560 × 424 shape, so the hero doesn't shift when it appears.
 *
 * The card and providers span about four fifths of the stage's width, so the stage is drawn a
 * quarter wider than its column and its empty margins spill past it (clipped by the hero). It
 * takes no clicks, so those transparent margins never cover anything.
 */
export default function PlanSwitch({
  plans,
  className,
}: {
  plans: readonly Plan[]
  className?: string
}) {
  useEffect(() => {
    void import('./plan-switch/fil-plan-switch')
  }, [])

  return (
    <div
      className={clsx(
        'pointer-events-none -mx-[12.5%] aspect-[560/424] w-[125%]',
        className,
      )}
    >
      {/* No pause button: it stops off screen and holds still for reduced motion. */}
      <fil-plan-switch plans={JSON.stringify(plans)} hide-controls="" />
    </div>
  )
}
