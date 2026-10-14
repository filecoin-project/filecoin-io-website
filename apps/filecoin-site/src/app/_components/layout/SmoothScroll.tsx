'use client'

import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useReducedMotion } from 'motion/react'

/**
 * Inertia scrolling for the whole page. Lenis drives the native scroll position, so sticky
 * elements, scroll-linked animations and anchor links keep working. Off for reduced motion.
 */
export default function SmoothScroll() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null
  return (
    <ReactLenis
      root
      options={{
        // A touch quicker than Lenis's default (0.1): smooth, but it settles sooner.
        lerp: 0.125,
        wheelMultiplier: 1,
        // Lands targets under the fixed header via the root's scroll-padding-top (globals.css).
        anchors: true,
        // Touch devices keep their native momentum scrolling.
        syncTouch: false,
      }}
    />
  )
}
