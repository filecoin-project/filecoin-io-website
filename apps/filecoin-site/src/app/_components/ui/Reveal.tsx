'use client'

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

import { useInView } from 'motion/react'

/** Becomes true once the element has scrolled into view, and stays true. */
export function useRevealed<T extends Element>(amount = 0.2) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, {
    once: true,
    amount,
    margin: '0px 0px -8% 0px',
  })
  return [ref, inView] as const
}

/**
 * Fades and lifts its content in the first time it scrolls into view. The transition itself
 * is CSS (see `[data-reveal]` in globals.css); this only flips `data-inview`.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  amount,
  className,
  children,
}: {
  as?: ElementType
  delay?: number
  amount?: number
  className?: string
  children: ReactNode
}) {
  const [ref, inView] = useRevealed<HTMLElement>(amount)
  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-inview={inView || undefined}
      className={className}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
