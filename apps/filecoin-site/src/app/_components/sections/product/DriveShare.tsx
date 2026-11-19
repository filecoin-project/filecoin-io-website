'use client'

import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'

import clsx from 'clsx'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'fil-drive-share': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        accent?: string
        locale?: string
        interval?: string | number
        'hide-controls'?: '' | boolean
      }
    }
  }
}

type DriveShareProps = {
  locale?: string
  className?: string
}

/**
 * The Filecoin Drive hero: a photo, a document or a video drops into "My Drive" and opens in a
 * browser from a shared link (`<fil-drive-share>`, see ./drive-share/fil-drive-share.ts). The
 * element is defined in the browser only; until then the wrapper holds its 480 × 400 shape, so
 * the hero doesn't shift when it appears.
 *
 * Sized like the Archival Storage hero: the stage fills the column when stacked, and beside the
 * copy (from `lg`) it is drawn a quarter wider, bleeding into the gap and the page margin
 * (clipped by the hero), so the windows read at a size that suits the heading.
 */
export default function DriveShare({ locale, className }: DriveShareProps) {
  useEffect(() => {
    void import('./drive-share/fil-drive-share')
  }, [])

  return (
    <div
      className={clsx(
        'pointer-events-none aspect-[480/400] w-full lg:-mx-[13.158%] lg:w-[126.316%]',
        className,
      )}
    >
      {/* No pause button: it stops off screen and holds still for reduced motion. */}
      <fil-drive-share locale={locale} hide-controls="" />
    </div>
  )
}
