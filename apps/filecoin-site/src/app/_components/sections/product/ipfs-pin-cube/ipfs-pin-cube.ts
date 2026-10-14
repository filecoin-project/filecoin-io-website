/**
 * <ipfs-pin-cube>: the IPFS page hero animation, in the same flat card language as the other
 * Filecoin graphics. A white isometric box opens to show the blue content root inside, then closes
 * over it, on a loop.
 *
 * A native Web Component (inline SVG in Shadow DOM, no dependencies). It fills its container's
 * width, square, on a transparent background. Rendered by `PinCube.tsx`, which loads this module
 * in the browser only.
 *
 * Attributes (all optional)
 *   accent         Filecoin blue for the root cube outline                 default #0090FF
 *   duration       ms for one loop                                         default 6400
 *   hide-controls  hides the small pause/play button (WCAG 2.2.2: keep it unless the page offers
 *                  another way to stop motion)
 *
 * Web Animations API, transform only; pauses off screen and in hidden tabs; shows the closed,
 * pinned box without motion for reduced motion.
 */

const W = 480
const H = 480
const C: Point = [240, 236] // centre of the box on screen
const A = 112 // box edge
const OPEN = 30 // how far each face slides out along its normal
const CORE = 0.46 // inner root cube, relative to the box

type Point = [number, number]

const COS = Math.cos(Math.PI / 6)
const SIN = 0.5
const P = (x: number, y: number, z: number, c: Point = C): Point => [
  c[0] + (x - y) * COS,
  c[1] + (x + y) * SIN - z,
]

/** A polygon path with rounded corners. */
function rpath(pts: Point[], r: number) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const v1 = [p0[0] - p1[0], p0[1] - p1[1]]
    const v2 = [p2[0] - p1[0], p2[1] - p1[1]]
    const l1 = Math.hypot(v1[0], v1[1])
    const l2 = Math.hypot(v2[0], v2[1])
    const a = [p1[0] + (v1[0] / l1) * r, p1[1] + (v1[1] / l1) * r]
    const b = [p1[0] + (v2[0] / l2) * r, p1[1] + (v2[1] / l2) * r]
    d +=
      `${i === 0 ? 'M' : 'L'}${a[0].toFixed(2)} ${a[1].toFixed(2)}` +
      `Q${p1[0].toFixed(2)} ${p1[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`
  }
  return d + 'Z'
}

/** The six faces of a box with half-size `h` around centre `c`. */
function faces(h: number, c: Point = C) {
  const q = (x: number, y: number, z: number) => P(x, y, z, c)
  return {
    top: [q(-h, -h, h), q(h, -h, h), q(h, h, h), q(-h, h, h)],
    left: [q(-h, h, h), q(h, h, h), q(h, h, -h), q(-h, h, -h)], // y = +h, faces down-left
    right: [q(h, -h, h), q(h, h, h), q(h, h, -h), q(h, -h, -h)], // x = +h, faces down-right
    bottom: [q(-h, -h, -h), q(h, -h, -h), q(h, h, -h), q(-h, h, -h)],
    backL: [q(-h, -h, h), q(-h, h, h), q(-h, h, -h), q(-h, -h, -h)], // x = -h
    backR: [q(-h, -h, h), q(h, -h, h), q(h, -h, -h), q(-h, -h, -h)], // y = -h
  }
}

function svg() {
  const h = A / 2
  const F = faces(h)
  const K = faces(h * CORE, [C[0], C[1] + h * (1 - CORE)])
  const bottomTip = P(h, h, -h)
  const face = (pts: Point[], fill: string, stroke = '#E3E3E3', r = 7) =>
    `<path d="${rpath(pts, r)}" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>`
  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="shadow"><stop offset="0" stop-color="#111" stop-opacity=".09"/><stop offset=".6" stop-color="#111" stop-opacity=".04"/><stop offset="1" stop-color="#111" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse class="shadow" cx="${C[0]}" cy="${bottomTip[1] - 8}" rx="${A * 1.25}" ry="${A * 0.5}" fill="url(#shadow)"/>

  <!-- inside of the box -->
  ${face(F.bottom, '#EFEFEF', '#E6E6E6')}
  ${face(F.backL, '#F6F6F6', '#E6E6E6')}
  ${face(F.backR, '#F1F1F1', '#E6E6E6')}

  <!-- the pinned root -->
  <g class="core">
    ${face(K.top, '#FFFFFF', 'var(--acc)', 4)}
    ${face(K.left, '#F7FBFF', 'var(--acc)', 4)}
    ${face(K.right, '#EEF6FF', 'var(--acc)', 4)}
  </g>

  <!-- the three lids -->
  <g class="f-left">${face(F.left, '#F7F7F7')}</g>
  <g class="f-right">${face(F.right, '#EFEFEF')}</g>
  <g class="f-top">${face(F.top, '#FFFFFF')}</g>
</svg>`
}

const CSS = `:host{--acc:#0090FF;display:block;position:relative;width:100%;aspect-ratio:1/1}
svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.toggle{position:absolute;right:3%;bottom:3%;width:28px;height:28px;border-radius:50%;border:1px solid #E6E6E6;background:#FFFFFF;
  color:#7A7A7A;display:grid;place-items:center;cursor:pointer;padding:0;opacity:.85}
.toggle:hover{opacity:1}
.toggle svg{position:static;width:11px;height:11px}
.toggle:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.toggle .play{display:none}
:host(.is-paused) .toggle .play{display:block}
:host(.is-paused) .toggle .pause{display:none}
:host([hide-controls]) .toggle{display:none}
@media (prefers-reduced-motion: reduce){ .toggle{display:none} }`

const IN_OUT = 'cubic-bezier(.65,0,.35,1)'
const OUT = 'cubic-bezier(.23,1,.32,1)'

export class IpfsPinCube extends HTMLElement {
  static get observedAttributes() {
    return ['accent', 'duration']
  }

  private anims: Animation[] = []
  private paused = false
  private visible = true
  private io?: IntersectionObserver
  private readonly onVisibility = () => this.sync()

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ) {
    if (name === 'accent') this.style.setProperty('--acc', value || '#0090FF')
    else if (this.isConnected) {
      this.teardown()
      this.build()
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'img')
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute(
        'aria-label',
        'A box opens to show the content root inside, then closes over it',
      )
    }
    this.build()
  }

  disconnectedCallback() {
    this.teardown()
  }

  private build() {
    const root = this.shadowRoot!
    root.innerHTML = `<style>${CSS}</style>${svg()}
      <button class="toggle" type="button" aria-label="Pause animation">
        <svg class="pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        <svg class="play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
      </button>`
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const duration = Math.max(
      3000,
      Number(this.getAttribute('duration')) || 6400,
    )
    const timing = { duration, iterations: Infinity }
    const q = (selector: string) => root.querySelector<SVGGElement>(selector)!

    // Each lid slides out along its own face normal, then back.
    const lid = (el: SVGGElement, dx: number, dy: number, lag = 0) =>
      this.anims.push(
        el.animate(
          [
            { offset: 0, transform: 'translate(0px,0px)' },
            {
              offset: 0.26 + lag,
              transform: 'translate(0px,0px)',
              easing: IN_OUT,
            },
            { offset: 0.44 + lag, transform: `translate(${dx}px,${dy}px)` },
            {
              offset: 0.66 - lag,
              transform: `translate(${dx}px,${dy}px)`,
              easing: IN_OUT,
            },
            { offset: 0.82 - lag, transform: 'translate(0px,0px)' },
            { offset: 1, transform: 'translate(0px,0px)' },
          ],
          timing,
        ),
      )
    lid(q('.f-top'), 0, -OPEN * 1.2)
    lid(q('.f-left'), -OPEN * COS, OPEN * SIN, 0.015)
    lid(q('.f-right'), OPEN * COS, OPEN * SIN, 0.015)

    // The root rises a touch while the box is open.
    this.anims.push(
      q('.core').animate(
        [
          { offset: 0, transform: 'translate(0px,0px)' },
          { offset: 0.36, transform: 'translate(0px,0px)', easing: OUT },
          { offset: 0.5, transform: 'translate(0px,-14px)' },
          { offset: 0.62, transform: 'translate(0px,-14px)', easing: IN_OUT },
          { offset: 0.76, transform: 'translate(0px,0px)' },
          { offset: 1, transform: 'translate(0px,0px)' },
        ],
        timing,
      ),
    )

    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      this.sync()
    })
    this.io.observe(this)
    document.addEventListener('visibilitychange', this.onVisibility)

    const toggle = root.querySelector<HTMLButtonElement>('.toggle')!
    toggle.addEventListener('click', () => {
      this.paused = !this.paused
      this.classList.toggle('is-paused', this.paused)
      toggle.setAttribute(
        'aria-label',
        this.paused ? 'Play animation' : 'Pause animation',
      )
      this.sync()
    })
  }

  private sync() {
    const run = !this.paused && this.visible && !document.hidden
    this.anims.forEach((anim) => (run ? anim.play() : anim.pause()))
  }

  private teardown() {
    this.anims.forEach((anim) => anim.cancel())
    this.anims = []
    this.io?.disconnect()
    document.removeEventListener('visibilitychange', this.onVisibility)
  }
}

if (!customElements.get('ipfs-pin-cube'))
  customElements.define('ipfs-pin-cube', IpfsPinCube)
