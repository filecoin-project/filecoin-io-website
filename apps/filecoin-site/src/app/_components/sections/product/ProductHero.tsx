import type { CSSProperties, ReactNode } from 'react'

import clsx from 'clsx'

import RotatingPhrase from '@/components/sections/product/RotatingPhrase'
import ButtonLink from '@/components/ui/ButtonLink'

type Action = { label: string; href: string }

/** A title line that opens with phrases taking turns ("Claude does the" …) before fixed words. */
export type RotatingLine = { rotate: readonly string[]; rest: string }

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

const BODY_WIDTH = {
  narrow: 'max-w-[34rem]',
  default: 'max-w-[40rem]',
  wide: 'max-w-[45.5rem]',
} as const

/**
 * A product page's opening: heading, intro and two calls to action on the light grey
 * page colour. Fills the first screen (up to the design's 900px) with the copy a little above
 * centre, and plays the same CSS intro as the homepage hero, word by word.
 *
 * Optional `art` sits to the right of the copy from `lg`, vertically centred, in a column that
 * grows from 15rem (at 1024) to 24.5rem (from 1280), so a first title line of up to about 12.9em
 * still fits beside it; below `lg` it follows the buttons.
 *
 * A title line can rotate its opening phrase (see `RotatingPhrase`); the heading then reads as
 * `label` to assistive tech, since the visible words keep changing.
 */
export default function ProductHero({
  title,
  body,
  primary,
  secondary,
  bodyWidth = 'default',
  art,
  label,
}: {
  /** The designed lines: each starts on its own line and wraps on its own where it doesn't fit. */
  title: readonly (string | RotatingLine)[]
  /** The heading as one fixed sentence, for a title with a rotating line. */
  label?: string
  body: string
  primary: Action
  /** Optional: the pricing page opens with a single call to action. */
  secondary?: Action
  /** The intro's measure, so it breaks into its two designed lines: 34rem, 40rem or 45.5rem. */
  bodyWidth?: 'narrow' | 'default' | 'wide'
  /** An illustration for the right-hand side. */
  art?: ReactNode
}) {
  // Words rise in one after another across both lines.
  let wordIndex = 0
  return (
    <section
      aria-labelledby="product-hero-title"
      // Clipped sideways: art may bleed its empty margins past the column into the page margin.
      className="bg-paper flex min-h-[min(100svh,clamp(34rem,24.6rem+40vw,56.25rem))] items-center overflow-x-clip pt-(--header-h) pb-[clamp(3rem,2.472rem+2.254vw,4.5rem)]"
    >
      <div
        className={clsx(
          'container-site pt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] lg:pt-0',
          art &&
            'grid grid-cols-1 items-center gap-x-12 gap-y-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] lg:grid-cols-[minmax(0,1fr)_clamp(15rem,59.375vw_-_23rem,24.5rem)]',
        )}
      >
        <div>
          <h1
            id="product-hero-title"
            className="font-heading text-h1 font-book text-ink leading-[1.15] tracking-[-0.02em] text-pretty"
          >
            {label && <span className="sr-only">{label}</span>}
            {/* Each designed line starts on its own line, and wraps on its own where it doesn't fit. */}
            <span aria-hidden={label ? true : undefined}>
              {title.map((line, l) => {
                const rotating = typeof line === 'string' ? null : line
                const words = (
                  typeof line === 'string' ? line : line.rest
                ).split(' ')
                return (
                  <span key={l}>
                    {l > 0 && ' '}
                    <span className="block text-balance">
                      {rotating && (
                        <RotatingPhrase
                          phrases={rotating.rotate}
                          className="intro"
                          style={delay(140 + wordIndex++ * 55)}
                        />
                      )}
                      {words.map((word, i) => (
                        <span key={i}>
                          {(i > 0 || rotating) && ' '}
                          <span
                            className="intro inline-block"
                            style={delay(140 + wordIndex++ * 55)}
                          >
                            {word}
                          </span>
                        </span>
                      ))}
                    </span>
                  </span>
                )
              })}
            </span>
          </h1>
          <p
            className={`intro mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] ${BODY_WIDTH[bodyWidth]} text-lead text-ink/64 leading-[1.15] tracking-[-0.02em] text-pretty`}
            style={delay(480)}
          >
            {body}
          </p>
          <div className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)] flex flex-wrap gap-[clamp(0.75rem,0.486rem+1.127vw,1.5rem)]">
            <ButtonLink
              href={primary.href}
              variant="ink"
              className="intro"
              style={delay(600)}
            >
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink
                href={secondary.href}
                variant="white"
                className="intro"
                style={delay(660)}
              >
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
        {art && (
          <div
            className="intro-fade w-full max-w-[26rem] lg:max-w-none"
            style={delay(300)}
          >
            {art}
          </div>
        )}
      </div>
    </section>
  )
}
