'use client'

import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'

import clsx from 'clsx'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ipfs-pin-cube': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        accent?: string
        duration?: string | number
        'hide-controls'?: '' | boolean
      }
    }
  }
}

/**
 * The IPFS hero's box that opens on its pinned content root (`<ipfs-pin-cube>`, see
 * ./ipfs-pin-cube/ipfs-pin-cube.ts). The element is defined in the browser only; until then the
 * wrapper holds its square, so the hero doesn't shift when it appears.
 *
 * The box and its shadow fill only the middle of the square stage, so the stage is drawn half as
 * wide again as its column and its empty margins spill past it (sideways into the gap and page
 * margin, clipped by the hero; less above and below), leaving the box at a size that suits the
 * heading. It takes no clicks, so those transparent margins never cover anything.
 */
export default function PinCube({ className }: { className?: string }) {
  useEffect(() => {
    void import('./ipfs-pin-cube/ipfs-pin-cube')
  }, [])

  return (
    <div
      className={clsx(
        'pointer-events-none -mx-[25%] -my-[20%] aspect-square w-[150%]',
        className,
      )}
    >
      {/* No pause button: it stops off screen and holds still for reduced motion. */}
      <ipfs-pin-cube hide-controls="" />
    </div>
  )
}
