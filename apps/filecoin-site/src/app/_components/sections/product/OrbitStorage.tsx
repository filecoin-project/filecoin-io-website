'use client'

import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'

import clsx from 'clsx'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'fil-orbit-storage': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        accent?: string
        logo?: string
        'hide-controls'?: '' | boolean
      }
    }
  }
}

/**
 * The Warm Storage hero's orbit: files, videos and datasets circling the Filecoin core, with data
 * dropping in and an integrity sweep ticking each one (`<fil-orbit-storage>`, see
 * ./orbit-storage/fil-orbit-storage.ts). The element is defined in the browser only; until then
 * the wrapper holds its 720 × 560 shape, so the hero doesn't shift when it appears.
 *
 * The orbit spans about two thirds of the stage's width, so the stage is drawn half as wide again
 * as its column and its empty margins spill past it (sideways into the gap and page margin,
 * clipped by the hero; a little above and below). It takes no clicks, so those transparent
 * margins never cover anything.
 */
export default function OrbitStorage({ className }: { className?: string }) {
  useEffect(() => {
    void import('./orbit-storage/fil-orbit-storage')
  }, [])

  return (
    <div
      className={clsx(
        'pointer-events-none -mx-[25%] -my-[8%] aspect-[720/560] w-[150%]',
        className,
      )}
    >
      {/* No pause button: it stops off screen and holds still for reduced motion. */}
      <fil-orbit-storage hide-controls="" />
    </div>
  )
}
