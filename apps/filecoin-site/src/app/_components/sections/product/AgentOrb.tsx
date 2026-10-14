'use client'

import { useEffect, useRef } from 'react'

import clsx from 'clsx'
import { useReducedMotion } from 'motion/react'
import {
  MODE_FRAMES,
  resolvePreset,
  scaleCounts,
  scaleRadii,
} from 'thinking-orbs'
import { paintFrame } from 'thinking-orbs/engine'

/** Filecoin blue (#0090FF) as the orb's ink tint. */
const TINT = { r: 0, g: 144, b: 255 }
/** Of the tuned 64px pace: calmer at hero size. */
const PACE = 0.6
/** A moment where the web is fully wired, for the still frame shown with reduced motion. */
const STILL_AT = 7.3

/**
 * The Agents hero's orb: thinking-orbs' "connecting" network sphere (the FilecoinOrb look), a
 * constellation that wires itself with packets running its edges, tinted Filecoin blue.
 *
 * thinking-orbs' <ThinkingOrb> only draws at its 20, 32 and 64px icon presets, so a hero-sized one
 * would be an upscaled, blurry 64px canvas. This draws the same mode with the library's own engine
 * (`MODE_FRAMES` and `paintFrame`) at the column's real size and pixel density, from the 64px
 * preset with more nodes and slightly bolder marks so it reads at this scale. Square, it fills its
 * container's width. Pauses off screen and in hidden tabs; holds a still frame for reduced motion.
 */
export default function AgentOrb({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { mode, speed, opts: preset } = resolvePreset('connecting', 64)
    const opts = { ...scaleRadii(scaleCounts(preset, 1.5), 1.6), lineW: 1.2 }
    const draw = MODE_FRAMES[mode]
    const pace = speed * PACE

    let size = 0
    let dpr = 1
    let raf = 0
    let running = false
    let visible = false

    const time = () =>
      reduceMotion ? STILL_AT : (performance.now() / 1000) * pace
    const paint = (t: number) => {
      if (!size) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      paintFrame(ctx, draw(size, t, opts), false, TINT)
    }
    const resize = () => {
      size = canvas.clientWidth
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      paint(time())
    }
    const loop = () => {
      paint(time())
      if (running) raf = requestAnimationFrame(loop)
    }
    const update = () => {
      const go =
        visible && !reduceMotion && document.visibilityState !== 'hidden'
      if (go && !running) {
        running = true
        raf = requestAnimationFrame(loop)
      } else if (!go && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    const resizer = new ResizeObserver(resize)
    resizer.observe(canvas)
    const viewer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    viewer.observe(canvas)
    document.addEventListener('visibilitychange', update)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      resizer.disconnect()
      viewer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={clsx('block aspect-square w-full', className)}
    />
  )
}
