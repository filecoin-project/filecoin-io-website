'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import clsx from 'clsx'
import { useInView, useReducedMotion } from 'motion/react'

const INTERVAL = 2800 // ms each phrase stays
const FIRST_DELAY = 1200 // extra wait before the first change, so the page intro can finish

/**
 * A few phrases taking turns in one spot of a heading ("Claude does the" → "ChatGPT does the" →
 * …): the current one fades up and away as the next rises in.
 *
 * From `sm` the phrases sit inline, and the slot's width eases to each phrase's measured width so
 * the words after it glide rather than jump. Below `sm` the slot is a block sized to its tallest
 * phrase, so whatever follows starts on the next line and the heading never changes height.
 * Changes only while on screen; with reduced motion the first phrase stays. Decorative: the
 * heading should carry the full sentence for assistive tech.
 */
export default function RotatingPhrase({
  phrases,
  className,
  style,
}: {
  phrases: readonly string[]
  className?: string
  style?: CSSProperties
}) {
  const root = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLSpanElement | null)[]>([])
  const [index, setIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const inView = useInView(root)
  const reduceMotion = useReducedMotion()

  // Each phrase's width, re-measured whenever the heading resizes (its type is fluid).
  useLayoutEffect(() => {
    const heading = root.current?.parentElement
    if (!heading) return
    const measure = () =>
      setWidths(
        items.current.map((el) => el?.getBoundingClientRect().width ?? 0),
      )
    const observer = new ResizeObserver(measure)
    observer.observe(heading)
    void document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reduceMotion || phrases.length < 2) return
    let timer: ReturnType<typeof setTimeout>
    const step = (wait: number) => {
      timer = setTimeout(() => {
        if (document.visibilityState !== 'hidden')
          setIndex((i) => (i + 1) % phrases.length)
        step(INTERVAL)
      }, wait)
    }
    step(INTERVAL + FIRST_DELAY)
    return () => clearTimeout(timer)
  }, [inView, reduceMotion, phrases.length])

  const previous = (index - 1 + phrases.length) % phrases.length
  return (
    <span
      ref={root}
      className={clsx(
        'sm:ease-out-quint relative grid grid-cols-[minmax(0,1fr)] sm:inline-grid sm:w-(--w) sm:transition-[width] sm:duration-[450ms]',
        className,
      )}
      style={
        {
          ...style,
          ...(widths[index] ? { '--w': `${widths[index]}px` } : {}),
        } as CSSProperties
      }
    >
      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          ref={(el) => {
            items.current[i] = el
          }}
          className={clsx(
            'ease-out-quint justify-self-start transition-[opacity,translate,filter] duration-500 [grid-area:1/1] motion-reduce:transition-none sm:whitespace-nowrap',
            // From `sm` only the current phrase is in the flow, so the slot is its width even
            // before the widths are measured (and stays put while they are).
            // The incoming phrase waits a beat, so a wider one has room before it appears.
            i === index
              ? 'opacity-100 delay-[120ms]'
              : clsx(
                  'opacity-0 blur-[3px] sm:absolute sm:top-0 sm:left-0',
                  i === previous
                    ? '-translate-y-[0.3em]'
                    : 'translate-y-[0.3em]',
                ),
          )}
        >
          {phrase}
        </span>
      ))}
    </span>
  )
}
