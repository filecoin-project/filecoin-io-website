'use client'

import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'

import clsx from 'clsx'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'fil-archive-stack': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        background?: string
        accent?: string
        interval?: string | number
        'hide-controls'?: '' | boolean
      }
    }
  }
}

/**
 * The Archival Storage hero's animated stack of archived files (`<fil-archive-stack>`, see
 * ./archive-stack/fil-archive-stack.ts). The element is defined in the browser only; until then
 * the wrapper holds its 480 × 400 shape, so the hero doesn't shift when it appears.
 *
 * The cards span 380 of the stage's 480 units, centred. Beside the copy (from `lg`) the empty
 * sides bleed past the column, so the cards themselves line up with its edges; stacked, the stage
 * stays inside the column so nothing scrolls sideways.
 */
export default function ArchiveStack({ className }: { className?: string }) {
  useEffect(() => {
    void import('./archive-stack/fil-archive-stack')
  }, [])

  return (
    <div
      className={clsx(
        'aspect-[480/400] w-full lg:-mx-[13.158%] lg:w-[126.316%]',
        className,
      )}
    >
      {/* No pause button: it stops off screen and holds still for reduced motion. */}
      <fil-archive-stack background="#F2F2F2" hide-controls="" />
    </div>
  )
}
