/**
 * <fil-orbit-storage>: the Warm Storage hero animation, for "Everyday storage, built for data you
 * read often. Files, datasets, and media stay online and ready to retrieve."
 *
 * Files, Videos and Datasets drift on an orbit around the Filecoin core. Data drops in from them as
 * small blue packets, and every few seconds a blue integrity sweep circles the orbit and ticks each
 * one as verified.
 *
 * A native Web Component (Shadow DOM, no dependencies). It fills its container's width at a
 * 720 × 560 aspect ratio on a transparent background. Text is set in the site's Geist
 * (`--font-geist`). Rendered by `OrbitStorage.tsx`, which loads this module in the browser only.
 *
 * Attributes (all optional)
 *   accent         Filecoin blue                                  default #0090FF
 *   logo           URL of the Filecoin mark for the core          default: built-in mark
 *   hide-controls  hides the small pause/play button (WCAG 2.2.2: keep it unless the page offers
 *                  another way to stop motion)
 *
 * Only transform and opacity change per frame; runs only while on screen and the tab is visible;
 * shows the still composition for reduced motion.
 */

const W = 720
const H = 560
const CX = 360
const CY = 280
const R_IN = 150
const R_OUT = 238
const TAU = Math.PI * 2
const DATA = [
  {
    label: 'Files',
    icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    at: -150,
  },
  {
    label: 'Videos',
    icon: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
    at: -30,
  },
  {
    label: 'Datasets',
    icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    at: 90,
  },
]
const LOGO = `<svg viewBox="0 0 464 464" aria-hidden="true"><path fill="var(--acc)" d="M232 464C104.4 464 0 359.6 0 230.84 1.16 103.24 104.4-1.16 233.16 0 360.76 1.16 464 104.4 464 234.32 462.84 360.76 359.6 464 232 464Z"/><path fill="#fff" d="M254.04 204.16 247.08 241.28 313.2 250.56 308.56 267.96 243.6 258.68C238.96 273.76 236.64 290 230.84 303.92 225.04 320.16 219.24 336.4 212.28 351.48 203 371.2 186.76 385.12 164.72 388.6 151.96 390.92 138.04 389.76 127.6 381.64 124.12 379.32 120.64 374.68 120.64 371.2 120.64 366.56 122.96 360.76 126.44 358.44 128.76 357.28 134.56 358.44 138.04 359.6 141.52 363.08 145 367.72 147.32 372.36 154.28 381.64 163.56 382.8 172.84 375.84 183.28 366.56 189.08 353.8 192.56 341.04 199.52 313.2 206.48 286.52 212.28 258.68V254.04L150.8 244.76 153.12 227.36 216.92 236.64 225.04 200.68 158.92 190.24 161.24 171.68 229.68 180.96C232 174 233.16 168.2 235.48 162.4 241.28 141.52 247.08 120.64 261 102.08 274.92 83.52 291.16 71.92 315.52 73.08 325.96 73.08 336.4 76.56 343.36 84.68 344.52 85.84 346.84 88.16 346.84 90.48 346.84 95.12 346.84 100.92 343.36 104.4 338.72 107.88 332.92 106.72 328.28 102.08 324.8 98.6 322.48 95.12 319 91.64 312.04 82.36 301.6 81.2 293.48 89.32 287.68 95.12 281.88 103.24 278.4 111.36 270.28 135.72 264.48 161.24 256.36 186.76L320.16 196.04 315.52 213.44 254.04 204.16Z"/></svg>`
const CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'

const CSS = `
:host{--acc:#0090FF;display:block;position:relative;width:100%;aspect-ratio:${W}/${H};
  font-family:var(--font-geist, Geist),ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.fit{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
svg.lines{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
.ring-out{transform-box:fill-box;transform-origin:center;animation:spin 140s linear infinite}
@keyframes spin{to{transform:rotate(-360deg)}}
.core{position:absolute;left:${CX - 60}px;top:${CY - 60}px;width:120px;height:120px;border-radius:30px;background:#FAFAFA;border:1px solid #F0F0F0;box-sizing:border-box}
.core-in{position:absolute;left:15px;top:15px;width:88px;height:88px;border-radius:22px;background:#fff;border:1px solid #E6E6E6;box-sizing:border-box;
  box-shadow:0 1px 2px rgba(17,17,17,.05),0 12px 28px -12px rgba(17,17,17,.14);display:grid;place-items:center}
.core-in svg,.core-in img{width:40px;height:40px;display:block}
.pill{position:absolute;left:0;top:0;width:124px;height:40px;box-sizing:border-box;border-radius:999px;background:#fff;border:1px solid #E6E6E6;
  box-shadow:0 1px 2px rgba(17,17,17,.05),0 12px 28px -14px rgba(17,17,17,.16);display:flex;align-items:center;justify-content:center;gap:8px;
  font-size:13px;font-weight:500;letter-spacing:-.005em;color:#111;white-space:nowrap;will-change:transform;transition:border-color 500ms ease}
.pill svg{width:16px;height:16px;fill:none;stroke:#555;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.pill.ok{border-color:color-mix(in srgb,var(--acc) 45%,#E6E6E6)}
.badge{position:absolute;right:-6px;top:-6px;width:18px;height:18px;border-radius:50%;background:var(--acc);display:grid;place-items:center;
  box-shadow:0 0 0 2px #fff;opacity:0;transform:scale(.4);transition:opacity 420ms ease,transform 420ms ease}
.badge svg{width:10px;height:10px;stroke:#fff;fill:none}
.pill.ok .badge{opacity:1;transform:scale(1);transition:opacity 220ms ease,transform 320ms cubic-bezier(.34,1.56,.64,1)}
.intro .ring,.intro .core,.intro .pill-wrap{opacity:0}
.ring,.core,.pill-wrap{transition:opacity 700ms ease}
.toggle{position:absolute;right:2%;bottom:2%;width:28px;height:28px;border-radius:50%;border:1px solid #E6E6E6;background:#fff;color:#7A7A7A;
  display:grid;place-items:center;cursor:pointer;padding:0;opacity:.85}
.toggle:hover{opacity:1}.toggle svg{width:11px;height:11px}
.toggle:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.toggle .play{display:none}:host(.is-paused) .toggle .play{display:block}:host(.is-paused) .toggle .pause{display:none}
:host([hide-controls]) .toggle{display:none}
@media (prefers-reduced-motion: reduce){.ring-out{animation:none}.toggle{display:none}}`

const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
const bell = (x: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, x)))
const norm = (a: number) => ((a % TAU) + TAU) % TAU

type Point = [number, number]
type Sweep = { t0: number; ticked: Set<number> }
type Drop = { t0: number; i: number }
type Run = { from: () => Point; to: Point; f: number }

export class FilOrbitStorage extends HTMLElement {
  static get observedAttributes() {
    return ['accent', 'logo']
  }

  private raf = 0
  private last = 0
  private t = 0
  private visible = true
  private paused = false
  private reduce = false
  private sched: {
    sweepAt: number
    dropAt: number
    sweep: Sweep | null
    drop: Drop | null
  } = {
    sweepAt: 2.2,
    dropAt: 1.4,
    sweep: null,
    drop: null,
  }
  private fit?: HTMLDivElement
  private core?: HTMLDivElement
  private pills: HTMLDivElement[] = []
  private sweepEl?: SVGGElement
  private beams: SVGLineElement[] = []
  private packets: SVGCircleElement[] = []
  private ripple?: SVGCircleElement
  private ro?: ResizeObserver
  private io?: IntersectionObserver
  private readonly onVisibility = () => this.kick()

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
    if (name === 'logo') this.setLogo(value)
  }

  connectedCallback() {
    this.setAttribute('role', 'img')
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute(
        'aria-label',
        'Files, videos and datasets orbit the Filecoin core and are checked for integrity',
      )
    }
    this.build()
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.ro?.disconnect()
    this.io?.disconnect()
    document.removeEventListener('visibilitychange', this.onVisibility)
  }

  /** The built-in mark, or an image (set through the DOM, so the URL is never parsed as HTML). */
  private setLogo(url: string | null) {
    if (!this.core) return
    if (!url) {
      this.core.innerHTML = LOGO
      return
    }
    const img = document.createElement('img')
    img.alt = ''
    img.src = url
    this.core.replaceChildren(img)
  }

  private build() {
    const root = this.shadowRoot!
    const ring = (radius: number, cls: string, extra: string) =>
      `<circle class="ring ${cls}" cx="${CX}" cy="${CY}" r="${radius}" fill="none" ${extra}/>`
    // Integrity sweep: a bright head with a fading tail, drawn as short arcs.
    let sweep = ''
    for (let i = 0; i < 16; i++) {
      const a0 = -i * 4.5
      const a1 = a0 - 4.2
      const p = (deg: number) => [
        CX + R_IN * Math.cos((deg * Math.PI) / 180),
        CY + R_IN * Math.sin((deg * Math.PI) / 180),
      ]
      const [x0, y0] = p(a0)
      const [x1, y1] = p(a1)
      sweep += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${R_IN} ${R_IN} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)}" stroke="var(--acc)" stroke-opacity="${(0.9 * Math.pow(1 - i / 16, 1.6)).toFixed(3)}" stroke-width="${i === 0 ? 2.5 : 2}" stroke-linecap="round" fill="none"/>`
    }
    root.innerHTML = `<style>${CSS}</style>
      <div class="fit intro">
        <svg class="lines" viewBox="0 0 ${W} ${H}" aria-hidden="true">
          ${ring(R_OUT, 'ring-out', 'stroke="#E9E9E9" stroke-width="1" stroke-dasharray="2 6"')}
          ${ring(R_IN, 'ring-in', 'stroke="#E6E6E6" stroke-width="1"')}
          <g class="sweep" style="opacity:0">${sweep}</g>
          <line class="beam b0" stroke="var(--acc)" stroke-width="1.5" stroke-linecap="round" style="opacity:0"/>
          <circle class="ripple" cx="${CX}" cy="${CY}" r="46" fill="none" stroke="var(--acc)" stroke-width="1.5" style="opacity:0;transform-box:fill-box;transform-origin:center"/>
          <circle class="pk p0" r="3.5" fill="var(--acc)" style="opacity:0"/>
        </svg>
        <div class="core"><div class="core-in"></div></div>
        ${DATA.map((d, i) => `<div class="pill-wrap"><div class="pill d${i}"><svg viewBox="0 0 24 24">${d.icon}</svg>${d.label}<span class="badge">${CHECK}</span></div></div>`).join('')}
      </div>
      <button class="toggle" type="button" aria-label="Pause animation">
        <svg class="pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        <svg class="play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
      </button>`
    const q = <T extends Element>(selector: string) =>
      root.querySelector<T>(selector)!
    const fit = q<HTMLDivElement>('.fit')
    this.fit = fit
    this.core = q<HTMLDivElement>('.core-in')
    this.setLogo(this.getAttribute('logo'))
    this.pills = DATA.map((_, i) => q<HTMLDivElement>(`.d${i}`))
    this.sweepEl = q<SVGGElement>('.sweep')
    this.beams = [q<SVGLineElement>('.b0')]
    this.packets = [q<SVGCircleElement>('.p0')]
    this.ripple = q<SVGCircleElement>('.ripple')

    this.ro = new ResizeObserver(() => {
      fit.style.transform = `scale(${this.clientWidth / W})`
    })
    this.ro.observe(this)
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      this.kick()
    })
    this.io.observe(this)
    document.addEventListener('visibilitychange', this.onVisibility)
    const toggle = q<HTMLButtonElement>('.toggle')
    toggle.addEventListener('click', () => {
      this.paused = !this.paused
      this.classList.toggle('is-paused', this.paused)
      toggle.setAttribute(
        'aria-label',
        this.paused ? 'Play animation' : 'Pause animation',
      )
      q<SVGCircleElement>('.ring-out').style.animationPlayState = this.paused
        ? 'paused'
        : ''
      this.kick()
    })

    this.t = 0
    this.sched = { sweepAt: 2.2, dropAt: 1.4, sweep: null, drop: null }
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.place(0)
    // Intro: the rings, then the core, then the orbiting pieces.
    const parts = [
      ...root.querySelectorAll<HTMLElement>('.ring, .core, .pill-wrap'),
    ]
    requestAnimationFrame(() => {
      fit.classList.remove('intro')
      if (!this.reduce)
        parts.forEach((el, i) => (el.style.transitionDelay = `${i * 90}ms`))
      setTimeout(
        () => parts.forEach((el) => (el.style.transitionDelay = '')),
        parts.length * 90 + 800,
      )
    })
    this.kick()
  }

  private running() {
    return (
      !this.reduce &&
      this.visible &&
      !document.hidden &&
      !this.paused &&
      this.isConnected
    )
  }

  private kick() {
    if (this.running() && !this.raf) {
      this.last = performance.now()
      this.raf = requestAnimationFrame((now) => this.frame(now))
    } else if (!this.running() && this.raf) {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    }
  }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    this.t += dt
    this.place(this.t)
    this.raf = this.running() ? requestAnimationFrame((n) => this.frame(n)) : 0
  }

  // Where things sit at time t (radians, screen y down).
  private inner(i: number, t: number) {
    return (DATA[i].at * Math.PI) / 180 + t * (TAU / 80)
  }

  private pos(a: number, radius: number): Point {
    return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)]
  }

  private place(t: number) {
    const S = this.sched
    this.pills.forEach((el, i) => {
      const [x, y] = this.pos(this.inner(i, t), R_IN)
      el.style.transform = `translate(${(x - 62).toFixed(2)}px,${(y - 20).toFixed(2)}px)`
    })

    // Integrity sweep: one lap in 2.8s every ~7s, ticking each pill as the head passes it.
    const sweepEl = this.sweepEl!
    if (t >= S.sweepAt && !S.sweep) S.sweep = { t0: t, ticked: new Set() }
    if (S.sweep) {
      const sweep = S.sweep
      const f = (t - sweep.t0) / 2.8
      const head = -Math.PI / 2 + ease(Math.min(1, f)) * TAU * 1.04
      sweepEl.style.transform = `rotate(${((head * 180) / Math.PI).toFixed(2)}deg)`
      sweepEl.style.transformOrigin = `${CX}px ${CY}px`
      sweepEl.style.opacity = (
        Math.min(1, f * 6) *
        (1 - Math.max(0, (f - 0.85) / 0.25))
      ).toFixed(3)
      this.pills.forEach((el, i) => {
        if (sweep.ticked.has(i)) return
        const gap = norm(head - this.inner(i, t))
        if (gap < 0.35 && f > 0.02) {
          sweep.ticked.add(i)
          el.classList.add('ok')
          setTimeout(() => el.classList.remove('ok'), 2600)
        }
      })
      if (f >= 1.15) {
        sweepEl.style.opacity = '0'
        S.sweep = null
        S.sweepAt = t + 4.4
      }
    }

    // Data drops in from a pill to the core.
    if (t >= S.dropAt && !S.drop)
      S.drop = { t0: t, i: Math.floor(t * 7.3) % DATA.length }
    const drop = S.drop
    this.packet(
      0,
      drop && {
        from: () => this.pos(this.inner(drop.i, t), R_IN - 22),
        to: [CX, CY],
        f: (t - drop.t0) / 1.2,
      },
      () => {
        this.ripple!.animate(
          [
            { transform: 'scale(1)', opacity: 0.5 },
            { transform: 'scale(1.9)', opacity: 0 },
          ],
          { duration: 900, easing: 'cubic-bezier(.23,1,.32,1)' },
        )
        this.core!.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.035)' },
            { transform: 'scale(1)' },
          ],
          {
            duration: 520,
            easing: 'ease-out',
          },
        )
        S.drop = null
        S.dropAt = t + 1.4 + ((t * 13) % 1.2)
      },
    )
  }

  private packet(k: number, run: Run | null, done: () => void) {
    const pk = this.packets[k]
    const beam = this.beams[k]
    if (!run) {
      pk.style.opacity = '0'
      beam.style.opacity = '0'
      return
    }
    const f = Math.min(1, run.f)
    const e = ease(f)
    const a = run.from()
    const b = run.to
    const x = a[0] + (b[0] - a[0]) * e
    const y = a[1] + (b[1] - a[1]) * e
    // Keep the packet outside the core tile while it travels.
    const inside = Math.hypot(x - CX, y - CY) < 50
    pk.setAttribute('cx', x.toFixed(2))
    pk.setAttribute('cy', y.toFixed(2))
    pk.style.opacity = inside ? '0' : Math.min(1, f * 5).toFixed(3)
    beam.setAttribute('x1', a[0].toFixed(2))
    beam.setAttribute('y1', a[1].toFixed(2))
    beam.setAttribute('x2', b[0].toFixed(2))
    beam.setAttribute('y2', b[1].toFixed(2))
    beam.style.opacity = (0.22 * bell(f)).toFixed(3)
    if (run.f >= 1) done()
  }
}

if (!customElements.get('fil-orbit-storage'))
  customElements.define('fil-orbit-storage', FilOrbitStorage)
