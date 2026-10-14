'use client'

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react'

import clsx from 'clsx'
import { useReducedMotion } from 'motion/react'

import { useRevealed } from '@/components/ui/Reveal'

const LINE = 1.15 // em; one digit cell, matches the number's line-height
const DURATION = 2400 // ms per column
const STAGGER = 45 // ms between columns, left to right

type Phase = 'settled' | 'armed' | 'rolling'

const noopSubscribe = () => () => {}

function Digit({
  digit,
  index,
  total,
  phase,
}: {
  digit: number
  index: number
  total: number
  phase: Phase
}) {
  // Lower-order digits spin more full turns, like a mechanical counter.
  const turns = 1 + Math.round((index / Math.max(1, total - 1)) * 2)
  const stop = turns * 10 + digit
  const position = phase === 'armed' ? 0 : stop
  const rolling = phase === 'rolling'
  // On its own layer only while it rolls: parked and settled columns are plain content, so the
  // tall strips are not held on the GPU as the section scrolls into view.
  const style: CSSProperties = {
    transform: rolling
      ? `translate3d(0, ${-position * LINE}em, 0)`
      : `translateY(${-position * LINE}em)`,
    transition: rolling
      ? `transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${index * STAGGER}ms`
      : 'none',
    willChange: rolling ? 'transform' : undefined,
  }

  return (
    // Clips vertically only, so a wide glyph rolling through a narrow column is not cut off.
    <span
      className="relative block overflow-y-clip"
      style={{ height: `${LINE}em` }}
    >
      {/* The final glyph sizes the column, so the settled number keeps its natural spacing. */}
      <span className="invisible">{digit}</span>
      <span
        className="absolute top-0 left-1/2 flex -translate-x-1/2 flex-col"
        style={style}
      >
        {Array.from({ length: stop + 1 }, (_, n) => (
          <span
            key={n}
            className="block text-center"
            style={{ height: `${LINE}em` }}
          >
            {n % 10}
          </span>
        ))}
      </span>
    </span>
  )
}

/**
 * A number that rolls up digit by digit, odometer style, the first time it scrolls into view.
 * Server-renders the final value; screen readers get the plain number.
 */
export default function Odometer({
  value,
  decimals = 0,
  suffix,
  className,
}: {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useRevealed<HTMLSpanElement>(0.6)
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  const [rolling, setRolling] = useState(false)
  const [rolled, setRolled] = useState(false)

  const text = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  const label = suffix ? `${text} ${suffix}` : text
  const total = text.replace(/\D/g, '').length

  // The server renders the settled value. Once hydrated every column parks at zero, and rolls
  // when the number comes into view (two frames later, so the parked position paints first).
  useEffect(() => {
    if (!inView || reduceMotion) return
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setRolling(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [inView, reduceMotion])

  // Once every column has landed, settle (same position, no layer).
  useEffect(() => {
    if (!rolling) return
    const done = window.setTimeout(
      () => setRolled(true),
      DURATION + total * STAGGER + 100,
    )
    return () => window.clearTimeout(done)
  }, [rolling, total])

  const phase: Phase =
    reduceMotion || !hydrated || rolled
      ? 'settled'
      : rolling
        ? 'rolling'
        : 'armed'

  // Runs of digits ("1", "953", …) and the separators between them.
  const runs = text.match(/\d+|\D/g) ?? []
  let index = -1
  return (
    // Every cell is a fixed-height box aligned to the top, so digits, separators and the unit
    // share one baseline (a clipped inline-block's own baseline would sit at its bottom edge).
    <span
      ref={ref}
      className={clsx('inline-flex items-start leading-[1.15]', className)}
      role="img"
      aria-label={label}
    >
      <span aria-hidden="true" className="inline-flex items-start">
        {runs.map((run, r) =>
          /\d/.test(run) ? (
            // Soft top and bottom edges, so digits rolling past the clip fade instead of being
            // cut. Padded sideways so wide digits passing through narrow columns stay unmasked;
            // separators sit outside the mask so comma tails keep full ink.
            <span
              key={r}
              className="-mx-[0.2em] inline-flex items-start mask-[linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] px-[0.2em]"
            >
              {[...run].map((char, i) => {
                index += 1
                return (
                  <Digit
                    key={i}
                    digit={Number(char)}
                    index={index}
                    total={total}
                    phase={phase}
                  />
                )
              })}
            </span>
          ) : (
            <span
              key={r}
              className="relative block"
              style={{ height: `${LINE}em` }}
            >
              {run}
            </span>
          ),
        )}
      </span>
      {suffix && (
        <span aria-hidden="true" className="ml-[0.25em]">
          {suffix}
        </span>
      )}
    </span>
  )
}
