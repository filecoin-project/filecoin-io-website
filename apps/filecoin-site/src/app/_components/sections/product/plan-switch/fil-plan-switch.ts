/**
 * <fil-plan-switch>: the pricing page hero animation, for "Open storage you control, at a lower
 * cost."
 *
 * A white plan card steps through the ways to store on Filecoin (Warm, Archival, S3-Compatible), its
 * price rolling to each plan's rate per TB per month. Each time, the data leaves the card as three
 * blue copies, one to each of three independent providers, which tick as their copy lands.
 *
 * A native Web Component (Shadow DOM, no dependencies). It fills its container's width at a
 * 560 × 424 aspect ratio on a transparent background. Text is set in the site's Geist
 * (`--font-geist`). Rendered by `PlanSwitch.tsx`, which loads this module in the browser only.
 *
 * Attributes (all optional)
 *   plans          JSON list of {label, from, amount, unit}; amount like "$2.50"   default: the
 *                  three plans as priced on the pricing page
 *   accent         Filecoin blue                                                     default #0090FF
 *   hide-controls  hides the small pause/play button (WCAG 2.2.2: keep it unless the page offers
 *                  another way to stop motion)
 *
 * Only transform and opacity change per frame (and the copies' trails draw out); runs only while
 * on screen and the tab is visible; shows the still composition for reduced motion.
 */

export type Plan = { label: string; from: string; amount: string; unit: string }

const W = 560
const H = 424
/** The card, and the port on its bottom edge the copies leave from. */
const CARD = { x: 100, y: 32, w: 360, h: 232 }
const PORT: [number, number] = [W / 2, CARD.y + CARD.h]
/** The providers' pills, and the wires from the port down to the top of each. */
const TILE = { y: 348, w: 140, h: 44 }
const PROVIDERS = [
  { label: 'Toronto', x: 124 },
  { label: 'Stockholm', x: 280 },
  { label: 'Singapore', x: 436 },
]
const wire = (x: number) => {
  const [px, py] = PORT
  const mid = (py + TILE.y) / 2
  return x === px
    ? `M${px} ${py}V${TILE.y}`
    : `M${px} ${py}C${px} ${mid} ${x} ${mid} ${x} ${TILE.y}`
}

const DEFAULT_PLANS: Plan[] = [
  { label: 'Warm', from: 'From', amount: '$2.50', unit: 'per TB per month' },
  {
    label: 'Archival',
    from: 'From',
    amount: '$2.00',
    unit: 'per TB per month',
  },
  {
    label: 'S3-Compatible',
    from: 'Flat rate',
    amount: '$5.99',
    unit: 'per TB per month',
  },
]

/** Seconds: one plan per cycle; the copies leave after the price has rolled, then clear. */
const CYCLE = 5.6
const SEND = 0.95
const STAGGER = 0.16
const TRAVEL = 1.05
const CLEAR = 4.6

const SERVER =
  '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>'
const CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
const ROLL = 'cubic-bezier(.65,0,.35,1)'

const CSS = `
:host{--acc:#0090FF;display:block;position:relative;width:100%;aspect-ratio:${W}/${H};color:#111;
  font-family:var(--font-geist, Geist),ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.fit{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
svg.lines{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
.card{position:absolute;left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;box-sizing:border-box;padding:22px 24px;
  display:flex;flex-direction:column;border-radius:20px;background:#fff;border:1px solid #E6E6E6;
  box-shadow:0 1px 2px rgba(17,17,17,.04),0 28px 56px -32px rgba(17,17,17,.28)}
.seg{position:relative;display:grid;grid-template-columns:repeat(var(--n),1fr);height:36px;padding:4px;box-sizing:border-box;border-radius:999px;background:#F2F2F2}
.thumb{position:absolute;left:4px;top:4px;bottom:4px;width:calc((100% - 8px) / var(--n));border-radius:999px;background:#fff;
  box-shadow:0 1px 2px rgba(17,17,17,.06),0 2px 8px -2px rgba(17,17,17,.12);transition:transform 520ms ${ROLL}}
.seg span{position:relative;display:grid;place-items:center;font-size:14px;font-weight:500;letter-spacing:-.01em;color:#8A8A8A;transition:color 320ms ease}
.seg span.on{color:#111}
.from{margin-top:22px;height:16px;font-size:13px;line-height:16px;color:#7A7A7A}
.price{margin-top:2px;display:flex;align-items:baseline;gap:8px;white-space:nowrap}
.amount{display:flex;font-size:52px;font-weight:500;letter-spacing:-.04em;line-height:1.2;font-variant-numeric:tabular-nums}
.amount>span{display:block;height:1.2em}
.col{overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent)}
.strip{display:block;transition:transform 900ms ${ROLL}}
.strip span{display:block;height:1.2em}
.unit{font-size:14px;letter-spacing:-.01em;color:#7A7A7A}
.rule{margin-top:16px;height:1px;background:#EFEFEF;flex:none}
.foot{margin-top:16px;display:flex;align-items:center;justify-content:space-between;height:16px;font-size:13px;color:#7A7A7A}
.dots{display:flex;gap:6px}
.dot{width:10px;height:10px;border-radius:50%;background:#E6E6E6;transition:background-color 300ms ease}
.dot.on{background:var(--acc)}
.port{position:absolute;left:${PORT[0] - 5}px;top:${PORT[1] - 5}px;width:10px;height:10px;box-sizing:border-box;border-radius:50%;
  background:#fff;border:1px solid #D6D6D6;transition:border-color 300ms ease}
.port::after{content:"";position:absolute;inset:2px;border-radius:50%;background:var(--acc);opacity:0;transition:opacity 300ms ease}
.port.send{border-color:color-mix(in srgb,var(--acc) 50%,#D6D6D6)}.port.send::after{opacity:1}
.tile{position:absolute;top:${TILE.y}px;width:${TILE.w}px;height:${TILE.h}px;box-sizing:border-box;border-radius:999px;background:#fff;border:1px solid #E6E6E6;
  box-shadow:0 1px 2px rgba(17,17,17,.05),0 12px 28px -14px rgba(17,17,17,.16);display:flex;align-items:center;justify-content:center;gap:8px;
  font-size:14px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;transition:border-color 500ms ease}
.tile svg{width:16px;height:16px;fill:none;stroke:#555;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.tile.ok{border-color:color-mix(in srgb,var(--acc) 45%,#E6E6E6)}
.badge{position:absolute;right:-6px;top:-6px;width:18px;height:18px;border-radius:50%;background:var(--acc);display:grid;place-items:center;
  box-shadow:0 0 0 2px #fff;opacity:0;transform:scale(.4);transition:opacity 420ms ease,transform 420ms ease}
.badge svg{width:10px;height:10px;stroke:#fff;fill:none}
.tile.ok .badge{opacity:1;transform:scale(1);transition:opacity 220ms ease,transform 320ms cubic-bezier(.34,1.56,.64,1)}
.part{transition:opacity 700ms ease,transform 800ms cubic-bezier(.23,1,.32,1)}
.intro .part{opacity:0;transform:translateY(10px)}
.toggle{position:absolute;right:2%;bottom:2%;width:28px;height:28px;border-radius:50%;border:1px solid #E6E6E6;background:#fff;color:#7A7A7A;
  display:grid;place-items:center;cursor:pointer;padding:0;opacity:.85}
.toggle:hover{opacity:1}.toggle svg{width:11px;height:11px}
.toggle:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.toggle .play{display:none}:host(.is-paused) .toggle .play{display:block}:host(.is-paused) .toggle .pause{display:none}
:host([hide-controls]) .toggle{display:none}
@media (prefers-reduced-motion: reduce){.toggle{display:none}}`

const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/** The plans from the `plans` attribute, or the built-in ones if it is missing or malformed. */
function parsePlans(value: string | null): Plan[] {
  if (!value) return DEFAULT_PLANS
  try {
    const list: unknown = JSON.parse(value)
    const ok =
      Array.isArray(list) &&
      list.length > 0 &&
      list.every(
        (p) =>
          p &&
          typeof p === 'object' &&
          ['label', 'from', 'amount', 'unit'].every(
            (k) => typeof p[k] === 'string',
          ),
      )
    return ok ? (list as Plan[]) : DEFAULT_PLANS
  } catch {
    return DEFAULT_PLANS
  }
}

export class FilPlanSwitch extends HTMLElement {
  static get observedAttributes() {
    return ['accent', 'plans']
  }

  private plans: Plan[] = DEFAULT_PLANS
  private raf = 0
  private last = 0
  private t = 0
  private visible = true
  private paused = false
  private reduce = false
  /** The cycle on show, the copies landed in it, and whether the port is lit. */
  private cycle = 0
  private landed: boolean[] = []
  private sending = false
  private shape = ''
  private fit?: HTMLDivElement
  private seg?: HTMLDivElement
  private thumb?: HTMLDivElement
  private fromEl?: HTMLSpanElement
  private amountEl?: HTMLSpanElement
  private unitEl?: HTMLSpanElement
  private port?: HTMLDivElement
  private tiles: HTMLDivElement[] = []
  private dots: HTMLSpanElement[] = []
  private wires: SVGPathElement[] = []
  private trails: SVGPathElement[] = []
  private packets: SVGGElement[] = []
  private lengths: number[] = []
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
    if (name === 'plans') {
      this.plans = parsePlans(value)
      if (this.seg) this.renderPlans()
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'img')
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute(
        'aria-label',
        'A storage plan card stepping through Warm, Archival and S3-Compatible prices per TB per month, with copies of the data going to three independent providers',
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

  private build() {
    const root = this.shadowRoot!
    root.innerHTML = `<style>${CSS}</style>
      <div class="fit intro">
        <svg class="lines" viewBox="0 0 ${W} ${H}" aria-hidden="true">
          <g class="part">${PROVIDERS.map((p) => `<path class="wire" d="${wire(p.x)}" fill="none" stroke="#D6D6D6" stroke-width="1.25" stroke-dasharray="2 5"/>`).join('')}</g>
          ${PROVIDERS.map((p) => `<path class="trail" d="${wire(p.x)}" fill="none" stroke="var(--acc)" stroke-width="1.5" stroke-linecap="round" style="opacity:0"/>`).join('')}
          ${PROVIDERS.map(() => `<g class="pk" style="opacity:0"><circle r="8" fill="var(--acc)" fill-opacity=".16"/><circle r="3.5" fill="var(--acc)"/></g>`).join('')}
        </svg>
        <div class="card part">
          <div class="seg"><div class="thumb"></div></div>
          <span class="from"></span>
          <div class="price"><span class="amount"></span><span class="unit"></span></div>
          <div class="rule"></div>
          <div class="foot"><span>Stored with independent providers</span><span class="dots">${PROVIDERS.map(() => '<span class="dot"></span>').join('')}</span></div>
        </div>
        <div class="port part"></div>
        ${PROVIDERS.map((p) => `<div class="tile part" style="left:${p.x - TILE.w / 2}px"><svg viewBox="0 0 24 24">${SERVER}</svg><span></span><span class="badge">${CHECK}</span></div>`).join('')}
      </div>
      <button class="toggle" type="button" aria-label="Pause animation">
        <svg class="pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        <svg class="play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
      </button>`
    const q = <T extends Element>(selector: string) =>
      root.querySelector<T>(selector)!
    const all = <T extends Element>(selector: string) => [
      ...root.querySelectorAll<T>(selector),
    ]
    const fit = q<HTMLDivElement>('.fit')
    this.fit = fit
    this.seg = q<HTMLDivElement>('.seg')
    this.thumb = q<HTMLDivElement>('.thumb')
    this.fromEl = q<HTMLSpanElement>('.from')
    this.amountEl = q<HTMLSpanElement>('.amount')
    this.unitEl = q<HTMLSpanElement>('.unit')
    this.port = q<HTMLDivElement>('.port')
    this.tiles = all<HTMLDivElement>('.tile')
    this.tiles.forEach(
      (tile, i) =>
        (tile.querySelector('span')!.textContent = PROVIDERS[i].label),
    )
    this.dots = all<HTMLSpanElement>('.dot')
    this.wires = all<SVGPathElement>('.wire')
    this.trails = all<SVGPathElement>('.trail')
    this.packets = all<SVGGElement>('.pk')
    this.lengths = this.wires.map((w) => w.getTotalLength())
    this.trails.forEach(
      (trail, i) =>
        (trail.style.strokeDasharray = `${this.lengths[i]} ${this.lengths[i]}`),
    )

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
      this.kick()
    })

    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    // A beat for the intro before the first copies leave.
    this.t = -0.5
    this.cycle = 0
    this.landed = PROVIDERS.map(() => false)
    this.sending = false
    this.shape = ''
    this.renderPlans()
    if (this.reduce) PROVIDERS.forEach((_, i) => this.land(i, false))
    else this.place(this.t)

    // Intro: the card, the port and wires, then the providers left to right.
    const parts = all<HTMLElement>('.part')
    requestAnimationFrame(() => {
      fit.classList.remove('intro')
      if (!this.reduce)
        parts.forEach((el, i) => (el.style.transitionDelay = `${i * 90}ms`))
      setTimeout(
        () => parts.forEach((el) => (el.style.transitionDelay = '')),
        parts.length * 90 + 900,
      )
    })
    this.kick()
  }

  /** The plan names in the switch, then the current plan shown without rolling. */
  private renderPlans() {
    const seg = this.seg!
    seg.style.setProperty('--n', String(this.plans.length))
    seg.querySelectorAll('span').forEach((el) => el.remove())
    for (const plan of this.plans) {
      const label = document.createElement('span')
      label.textContent = plan.label
      seg.append(label)
    }
    this.shape = ''
    this.select(this.cycle % this.plans.length, false)
  }

  /** Shows plan i: the switch slides over, the label changes and the price rolls to its amount. */
  private select(i: number, animate: boolean) {
    const plan = this.plans[i]
    this.thumb!.style.transform = `translateX(${i * 100}%)`
    this.seg!.querySelectorAll('span').forEach((el, j) =>
      el.classList.toggle('on', j === i),
    )
    this.unitEl!.textContent = plan.unit
    const from = this.fromEl!
    if (from.textContent !== plan.from) {
      if (animate) {
        from.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 160,
          easing: 'ease-in',
        }).onfinish = () => {
          from.textContent = plan.from
          from.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 260,
            easing: 'ease-out',
          })
        }
      } else from.textContent = plan.from
    }
    this.setAmount(plan.amount, animate)
  }

  /**
   * The price as rolling digit columns between fixed characters ("$", "."). Amounts of the same
   * shape roll from one to the next; a differently shaped one is set in place.
   */
  private setAmount(amount: string, animate: boolean) {
    const el = this.amountEl!
    const shape = amount.replace(/\d/g, '0')
    if (shape !== this.shape) {
      this.shape = shape
      animate = false
      el.replaceChildren(
        ...[...amount].map((ch) => {
          const span = document.createElement('span')
          if (/\d/.test(ch)) {
            span.className = 'col'
            const strip = document.createElement('span')
            strip.className = 'strip'
            for (let d = 0; d < 10; d++)
              strip.append(
                Object.assign(document.createElement('span'), {
                  textContent: String(d),
                }),
              )
            span.append(strip)
          } else span.textContent = ch
          return span
        }),
      )
    }
    const digits = [...amount].filter((ch) => /\d/.test(ch)).map(Number)
    el.querySelectorAll<HTMLSpanElement>('.strip').forEach((strip, j) => {
      strip.style.transition = animate ? '' : 'none'
      strip.style.transitionDelay = animate ? `${j * 70}ms` : ''
      strip.style.transform = `translateY(${-1.2 * digits[j]}em)`
    })
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

  /** A copy reached provider i: its pill ticks and its dot on the card fills. */
  private land(i: number, bump: boolean) {
    this.landed[i] = true
    this.tiles[i].classList.add('ok')
    this.dots[i].classList.add('on')
    if (bump) {
      this.tiles[i].animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.04)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: 460,
          easing: 'ease-out',
        },
      )
    }
  }

  private place(t: number) {
    const cycle = Math.max(0, Math.floor(t / CYCLE))
    const local = t - cycle * CYCLE
    if (cycle !== this.cycle) {
      this.cycle = cycle
      this.select(cycle % this.plans.length, true)
    }

    let sending = false
    PROVIDERS.forEach((_, i) => {
      const start = SEND + i * STAGGER
      const f = (local - start) / TRAVEL
      const pk = this.packets[i]
      const trail = this.trails[i]
      const len = this.lengths[i]
      if (f < 0 || local >= CLEAR) {
        pk.style.opacity = '0'
        trail.style.opacity = '0'
        return
      }
      if (f < 1) {
        sending = true
        const e = ease(f)
        const point = this.wires[i].getPointAtLength(e * len)
        pk.setAttribute(
          'transform',
          `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
        )
        // In from the port, and gone into the pill as it arrives.
        pk.style.opacity = Math.min(1, f * 6, (1 - f) * 8).toFixed(3)
        trail.style.strokeDashoffset = (len * (1 - e)).toFixed(2)
        trail.style.opacity = '1'
        return
      }
      pk.style.opacity = '0'
      trail.style.strokeDashoffset = '0'
      // The trail fades over 0.7s once the copy is in.
      trail.style.opacity = (1 - clamp01(((f - 1) * TRAVEL) / 0.7)).toFixed(3)
      if (!this.landed[i]) this.land(i, true)
    })
    if (sending !== this.sending) {
      this.sending = sending
      this.port!.classList.toggle('send', sending)
    }
    if (local >= CLEAR && this.landed.some(Boolean)) {
      this.landed = this.landed.map(() => false)
      this.tiles.forEach((tile) => tile.classList.remove('ok'))
      this.dots.forEach((dot) => dot.classList.remove('on'))
    }
  }
}

if (!customElements.get('fil-plan-switch'))
  customElements.define('fil-plan-switch', FilPlanSwitch)
