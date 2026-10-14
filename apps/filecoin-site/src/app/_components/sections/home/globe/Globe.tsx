'use client'

import { useEffect, useRef } from 'react'

import {
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from 'd3-geo'
import { useReducedMotion } from 'motion/react'

import type { GlobeMarker } from '@/data/globe'

// Look and proportions from scripts/globe/simpleglobe.mjs (dark theme). Sizes are in that script's
// units, where the globe is 780 across, and scale with the globe as drawn.
const BASE = 780
const C = {
  ocean: '#1F1F1F',
  land: '#2E2E2E',
  landStroke: '#3F3F3F',
  grid: '#242424',
  rim: '#3A3A3A',
  top: '#D6D6D3',
  edge: '#7A7A77',
  front: '#9C9C99',
  led: '#34C759',
}

const START: [number, number] = [140, 48] // view centre as in the design: East Asia, tilted north
const LAT_RANGE: [number, number] = [12, 72]
const AUTO_SPIN = -3.5 // degrees of longitude per second; negative turns the globe eastward
const SCROLL_TURN = 0.04 // degrees per pixel scrolled, so the globe turns as you pass it
const SHOWN = 0.573 // share of the globe above the section's bottom edge, as in the design
const HALF_PI = Math.PI / 2

const DIAMETER = { share: 0.64, min: 512, max: 960 } // of the section's width, in px
const PAD_TOP = 16 // room for icons standing on the top edge, in BASE units

/**
 * The canvas height as CSS, so the page lays out at its final size before any script runs (the
 * canvas would otherwise start at the browser's default 2:1 and shift everything below it).
 */
const CANVAS_HEIGHT = `calc(clamp(${DIAMETER.min}px, ${DIAMETER.share * 100}cqw, ${DIAMETER.max}px) * ${PAD_TOP / BASE + SHOWN})`

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The script's "mini server" icon, pre-rendered once per size so each frame only blits it.
 * Drawn with 3 units of padding for its drop shadow: spans x -16..16 and y -17..7 around its
 * anchor, the base centre.
 */
function renderIcon(scale: number): HTMLCanvasElement {
  const pad = 3
  const w = Math.ceil((26 + pad * 2) * scale)
  const h = Math.ceil((18 + pad * 2) * scale)
  const shape = document.createElement('canvas')
  shape.width = w
  shape.height = h
  const g = shape.getContext('2d')!
  g.scale(scale, scale)
  g.translate(13 + pad, 14 + pad)
  g.lineWidth = 0.7

  g.fillStyle = 'rgba(0, 0, 0, 0.45)'
  g.beginPath()
  g.ellipse(0, 1.6, 12.5, 2.4, 0, 0, Math.PI * 2)
  g.fill()

  g.strokeStyle = C.edge
  g.fillStyle = C.front
  g.beginPath()
  g.roundRect(-11, -6, 22, 7, 3)
  g.fill()
  g.stroke()

  g.fillStyle = C.top
  g.beginPath()
  g.roundRect(-11, -13, 22, 11, 3.4)
  g.fill()
  g.stroke()

  g.fillStyle = 'rgba(255, 255, 255, 0.55)'
  g.beginPath()
  g.roundRect(-9.6, -11.8, 19.2, 2.2, 1.1)
  g.fill()

  g.fillStyle = C.led
  g.beginPath()
  g.arc(7.6, -0.6, 1.05, 0, Math.PI * 2)
  g.fill()

  // The whole icon lifts off the globe with one soft shadow (the script's `lift` filter).
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const o = out.getContext('2d')!
  o.shadowColor = 'rgba(0, 0, 0, 0.6)'
  o.shadowBlur = 1.6 * scale
  o.shadowOffsetY = 1 * scale
  o.drawImage(shape, 0, 0)
  return out
}

/**
 * A slowly turning globe of storage provider locations, drawn on a canvas with d3-geo. Drag (or
 * use the arrow keys) to turn it; it eases back into its spin when let go. Only the top of the
 * globe shows, rising from the section's bottom edge. Rendering pauses while off screen.
 */
export default function Globe({
  markers,
  label,
}: {
  markers: GlobeMarker[]
  label: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const projection = geoOrthographic().clipAngle(90).precision(0.5)
    const path = geoPath(projection, ctx)
    const graticule = geoGraticule10()
    const sphere: GeoPermissibleObjects = { type: 'Sphere' }
    let land: GeoPermissibleObjects | null = null

    const autoSpin = reduceMotion ? 0 : AUTO_SPIN
    let lon = START[0]
    let lat = START[1]
    let spin = autoSpin

    let width = 0
    let height = 0
    let dpr = 1
    let radius = 0
    let unit = 1
    let icon: HTMLCanvasElement | null = null
    let shade: CanvasGradient | null = null

    // Markers drop in one after another, top to bottom, the first time the globe is seen.
    let introStart = reduceMotion ? -Infinity : 0
    const introOrder = new Map<number, number>()

    const draw = (now: number) => {
      projection.rotate([-lon, -lat])
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      ctx.beginPath()
      path(sphere)
      ctx.fillStyle = C.ocean
      ctx.fill()

      ctx.beginPath()
      path(graticule)
      ctx.lineWidth = 0.8 * unit
      ctx.strokeStyle = C.grid
      ctx.stroke()

      if (land) {
        ctx.beginPath()
        path(land)
        ctx.fillStyle = C.land
        ctx.fill()
        ctx.lineWidth = 0.9 * unit
        ctx.lineJoin = 'round'
        ctx.strokeStyle = C.landStroke
        ctx.stroke()
      }

      // Fixed lighting from the upper left, so the land turns underneath it.
      ctx.beginPath()
      path(sphere)
      if (shade) {
        ctx.fillStyle = shade
        ctx.fill()
      }
      ctx.lineWidth = 1.2 * unit
      ctx.strokeStyle = C.rim
      ctx.stroke()

      if (!icon) return
      const centre: [number, number] = [lon, lat]
      const visible: [number, number, number][] = []
      markers.forEach((marker, i) => {
        const distance = geoDistance(marker, centre)
        if (distance >= HALF_PI) return
        const point = projection(marker)
        if (!point) return
        // Fade out over the last two degrees before the horizon instead of popping.
        let alpha = clamp((HALF_PI - distance) / 0.035, 0, 1)
        let lift = 0
        if (Number.isFinite(introStart)) {
          const order = introOrder.get(i) ?? 0
          const t = clamp((now - introStart - 250 - order * 22) / 450, 0, 1)
          alpha *= easeOut(t)
          lift = -6 * unit * (1 - easeOut(t))
        }
        if (alpha > 0) visible.push([point[0], point[1] + lift, alpha])
      })
      visible.sort((a, b) => a[1] - b[1]) // back to front
      for (const [x, y, alpha] of visible) {
        ctx.globalAlpha = alpha
        ctx.drawImage(icon, x - 16 * unit, y - 17 * unit, 32 * unit, 24 * unit)
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      width = wrap.clientWidth
      const diameter = clamp(width * DIAMETER.share, DIAMETER.min, DIAMETER.max)
      radius = diameter / 2
      unit = diameter / BASE
      const padTop = PAD_TOP * unit
      height = canvas.clientHeight // set by CANVAS_HEIGHT: padTop + diameter * SHOWN
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      projection.scale(radius).translate([width / 2, padTop + radius])
      icon = renderIcon(unit * dpr)
      const [cx, cy] = [width / 2, padTop + radius]
      const d = radius * 2
      const fx = cx - radius + 0.38 * d
      const fy = cy - radius + 0.32 * d
      shade = ctx.createRadialGradient(fx, fy, 0, fx, fy, 0.75 * d)
      shade.addColorStop(0, 'rgba(0, 0, 0, 0)')
      shade.addColorStop(0.75, 'rgba(0, 0, 0, 0.12)')
      shade.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      draw(performance.now())
    }

    // Render loop: runs only while the globe is on screen and something is moving.
    let frame = 0
    let last = 0
    let onScreen = false
    let dragging = false
    const introRunning = (now: number) =>
      Number.isFinite(introStart) &&
      now - introStart < 250 + markers.length * 22 + 450

    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragging) {
        spin += (autoSpin - spin) * (1 - Math.exp(-dt * 1.2))
        lon += spin * dt
      }
      draw(now)
      if (
        onScreen &&
        !document.hidden &&
        (dragging || Math.abs(spin) > 0.01 || introRunning(now))
      ) {
        frame = requestAnimationFrame(tick)
      }
    }

    const play = () => {
      if (frame || !onScreen || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const pause = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const startIntro = () => {
      if (introStart !== 0) return
      projection.rotate([-lon, -lat])
      markers
        .map((m, i) => [i, projection(m)?.[1] ?? Infinity] as const)
        .sort((a, b) => a[1] - b[1])
        .forEach(([i], order) => introOrder.set(i, order))
      introStart = performance.now()
    }

    // Dragging turns the globe under the pointer; letting go hands its speed to the spin.
    const degPerPx = () => 180 / (Math.PI * radius)
    let lastX = 0
    let lastY = 0
    let lastT = 0
    let velocity = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      canvas.setPointerCapture(e.pointerId)
      lastX = e.clientX
      lastY = e.clientY
      lastT = e.timeStamp
      velocity = 0
      spin = 0
      play()
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const k = degPerPx()
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const dt = Math.max(1, e.timeStamp - lastT) / 1000
      lon -= dx * k
      // Touch keeps vertical movement for page scrolling (touch-action: pan-y).
      if (e.pointerType === 'mouse') lat = clamp(lat + dy * k, ...LAT_RANGE)
      velocity = velocity * 0.6 + ((-dx * k) / dt) * 0.4
      lastX = e.clientX
      lastY = e.clientY
      lastT = e.timeStamp
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      // A pointer that stopped before letting go throws nothing.
      const held = e.timeStamp - lastT > 80
      spin = reduceMotion || held ? 0 : clamp(velocity, -240, 240)
      play()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const turn = { ArrowLeft: 90, ArrowRight: -90 }[
        e.key as 'ArrowLeft' | 'ArrowRight'
      ]
      const tilt = { ArrowUp: -6, ArrowDown: 6 }[
        e.key as 'ArrowUp' | 'ArrowDown'
      ]
      if (turn === undefined && tilt === undefined) return
      e.preventDefault()
      if (turn !== undefined) spin = turn
      if (tilt !== undefined) lat = clamp(lat + tilt, ...LAT_RANGE)
      if (reduceMotion && turn !== undefined) {
        spin = 0
        lon -= turn / 6
      }
      if (frame) return
      draw(performance.now())
      play()
    }

    let lastScroll = window.scrollY
    const onScroll = () => {
      const delta = window.scrollY - lastScroll
      lastScroll = window.scrollY
      if (!onScreen || reduceMotion || dragging) return
      lon -= delta * SCROLL_TURN
      play()
    }

    const onVisibility = () => (document.hidden ? pause() : play())

    // Fetch the land outlines a little before the globe comes into view.
    let landRequested = false
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || landRequested) return
        landRequested = true
        fetch('/assets/data/land-110m.json')
          .then((r) => r.json())
          .then((data: GeoPermissibleObjects) => {
            land = data
            draw(performance.now())
          })
          .catch(() => {})
      },
      { rootMargin: '800px 0px' },
    )
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) {
        startIntro()
        play()
      } else {
        pause()
      }
    })

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(wrap)
    nearObserver.observe(wrap)
    viewObserver.observe(canvas)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      pause()
      resizeObserver.disconnect()
      nearObserver.disconnect()
      viewObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [markers, reduceMotion])

  return (
    <div ref={wrapRef} className="@container relative w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        tabIndex={0}
        style={{ height: CANVAS_HEIGHT }}
        className="block w-full cursor-grab touch-pan-y select-none focus-visible:outline-offset-[-4px] active:cursor-grabbing"
      />
    </div>
  )
}
