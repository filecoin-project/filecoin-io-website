import type { ReactNode } from 'react'

/** One layer of an illustration: its box on the 720x560 stage and its SVG content. */
export type ArtPart = {
  name: string
  /** x, y, width, height in stage units. Also the part's viewBox. */
  box: [number, number, number, number]
  body: ReactNode
}
