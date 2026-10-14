import { Fragment, type CSSProperties, type ReactNode } from 'react'

import type { ArtPart } from './types'

const W = 720
const H = 560

/** Position and size of a part on the stage, in percentages so the stage can scale. */
function placement([x, y, w, h]: ArtPart['box']): CSSProperties {
  return {
    left: `${(x / W) * 100}%`,
    top: `${(y / H) * 100}%`,
    width: `${(w / W) * 100}%`,
    aspectRatio: `${w} / ${h}`,
  }
}

/**
 * How a part arrives each time its illustration becomes active (keyframes in globals.css):
 * rise/drop/left slide in 12px (or from `from`), scale grows from 92%, reveal-down/reveal-right
 * wipe in with a clip, fade only fades, switch appears off and slides on. `delay` is in ms.
 * `loop` names an ambient animation that runs while the illustration is active: flow-down and
 * flow-right sweep a highlight along connector dots, pulse/blink/twinkle are for markers.
 */
export type Enter =
  | 'rise'
  | 'drop'
  | 'left'
  | 'scale'
  | 'reveal-down'
  | 'reveal-right'
  | 'fade'
  | 'switch'
export type Choreography = Record<
  string,
  { enter: Enter; delay: number; loop?: string; from?: string }
>

/** The 12px dot grid behind every illustration, brightest in the middle (as in the Figma file). */
function DotField({ id }: { id: string }) {
  return (
    <svg className="art-dots" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <pattern
          id={`${id}-dots`}
          width="12"
          height="12"
          x="-6"
          y="-6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="6" cy="6" r="1.15" fill="#fff" />
        </pattern>
        {/* Opacity falls from 0.1 at the centre to 0 at ~60% of the stage, on a 720:560 ellipse. */}
        <radialGradient id={`${id}-fade`} cx="0.5" cy="0.4991" r="0.594">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width={W} height={H} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect
        width={W}
        height={H}
        fill={`url(#${id}-dots)`}
        mask={`url(#${id}-mask)`}
      />
    </svg>
  )
}

/**
 * A 720x560 illustration built from separately positioned parts, so each part can move on its
 * own layer. `crop` is the box shown when the illustration is not pinned (phones and tablets):
 * the content without the empty margins, so it stays legible at small widths.
 */
export default function ArtStage({
  id,
  label,
  parts,
  choreography,
  crop,
  extras,
}: {
  id: string
  label: string
  parts: ArtPart[]
  choreography: Choreography
  crop: [number, number, number, number]
  /** Additional layers, e.g. a switch's "off" track, keyed by the part they sit under. */
  extras?: Record<string, ReactNode>
}) {
  const [cx, cy, cw, ch] = crop
  return (
    <div
      className="art-stage"
      role="img"
      aria-label={label}
      style={
        { '--cx': cx, '--cy': cy, '--cw': cw, '--ch': ch } as CSSProperties
      }
    >
      <div className="art-canvas">
        <DotField id={id} />
        {parts.map(({ name, box, body }) => {
          const step = choreography[name]
          const flows = step?.loop?.startsWith('flow')
          const style = {
            ...placement(box),
            '--d': `${step?.delay ?? 0}ms`,
            ...(step?.from ? { '--from': step.from } : {}),
          } as CSSProperties
          return (
            <Fragment key={name}>
              {extras?.[name]}
              <svg
                className="art-part"
                data-part={name}
                data-enter={step?.enter}
                data-loop={flows ? undefined : step?.loop}
                viewBox={box.join(' ')}
                fill="none"
                aria-hidden="true"
                style={style}
              >
                {body}
              </svg>
              {flows && (
                <svg
                  className="art-part art-flow"
                  data-loop={step?.loop}
                  viewBox={box.join(' ')}
                  fill="none"
                  aria-hidden="true"
                  style={style}
                >
                  {body}
                </svg>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

/** A plain layer at stage coordinates, for shapes the source does not have (e.g. a switch's off state). */
export function ExtraLayer({
  box,
  enter,
  delay = 0,
  children,
}: {
  box: ArtPart['box']
  enter?: Enter
  delay?: number
  children: ReactNode
}) {
  return (
    <svg
      className="art-part"
      data-enter={enter}
      viewBox={box.join(' ')}
      fill="none"
      aria-hidden="true"
      style={{ ...placement(box), '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </svg>
  )
}
