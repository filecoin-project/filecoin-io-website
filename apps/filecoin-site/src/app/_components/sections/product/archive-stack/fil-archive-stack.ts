/**
 * <fil-archive-stack>: the Archival Storage hero animation, a stack of archived files with the
 * newest in front. Every few seconds a new archive card rises into the front and the older ones
 * tuck back one step; the oldest fades into the background.
 *
 * A native Web Component (Shadow DOM, so its styles neither leak nor get affected by the site's
 * CSS). It fills its container's width at a 480 × 400 aspect ratio. Text is set in the site's
 * Geist and Geist Mono (`--font-geist`, `--font-geist-mono`, which reach into the shadow tree).
 * Rendered by `ArchiveStack.tsx`, which loads this module in the browser only.
 *
 * Attributes (all optional)
 *   background     Colour of the section behind it; back cards fade into it.  Default #F2F2F2
 *   accent         Filecoin blue for the front card's icon and check.          Default #0090FF
 *   interval       Milliseconds between new cards.                             Default 3800
 *   hide-controls  Hides the small pause/play button (keep it unless the page offers another
 *                  way to stop motion; WCAG 2.2.2).
 * Property
 *   el.items = [{ icon, name, size, cid }, …]   at least 7 entries.
 *
 * Animates only transform and opacity; pauses when off screen or the tab is hidden; shows a still
 * stack when the visitor prefers reduced motion.
 */

const ICONS = {
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  drive:
    '<path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M6 16h.01"/><path d="M10 16h.01"/>',
  film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  sheet:
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 9v12"/><path d="M15 9v12"/>',
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  folder:
    '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  archive:
    '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
}
const LOCK =
  '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
const CHECK = '<path d="M20 6 9 17l-5-5"/>'

export type ArchiveItem = {
  icon: keyof typeof ICONS
  name: string
  size: string
  cid: string
}

const DEFAULT_ITEMS: ArchiveItem[] = [
  {
    icon: 'db',
    name: 'postgres-prod.sql.gz',
    size: '4.2 GB',
    cid: 'bafybeigdyr…x7q2',
  },
  {
    icon: 'drive',
    name: 'system-snapshot.img',
    size: '38 GB',
    cid: 'bafybeih2kq…k2a4',
  },
  {
    icon: 'film',
    name: 'media-library',
    size: '12.6 TB',
    cid: 'bafybeif7vn…9xqe',
  },
  {
    icon: 'file',
    name: 'records-2025.zip',
    size: '1.1 GB',
    cid: 'bafybeic4ol…m3k9',
  },
  {
    icon: 'sheet',
    name: 'finance-ledger.csv',
    size: '86 MB',
    cid: 'bafybeid9ts…7mc1',
  },
  {
    icon: 'cpu',
    name: 'checkpoints-v2',
    size: '1.4 GB',
    cid: 'bafybeie3wa…c4e8',
  },
  {
    icon: 'mail',
    name: 'mail-archive-2024.mbox',
    size: '9.8 GB',
    cid: 'bafybeia6pz…q8r2',
  },
  {
    icon: 'folder',
    name: 'design-assets',
    size: '640 GB',
    cid: 'bafybeib1hx…5tj0',
  },
  {
    icon: 'film',
    name: 'raw-footage-A001.mov',
    size: '212 GB',
    cid: 'bafybeig8cu…1pz3',
  },
  {
    icon: 'archive',
    name: 'audit-logs-2023.tar',
    size: '3.3 GB',
    cid: 'bafybeif0rd…w6n5',
  },
]

// Geometry, in stage units (480 × 400). Slot 0 is the front card; 1–4 sit behind it; 5 is leaving.
const STAGE_W = 480
const STAGE_H = 400
const VISIBLE = 5
const SLOTS: {
  y: number
  s: number
  fog: number
  shadow: number
  out?: boolean
}[] = [
  { y: 0, s: 1, fog: 0, shadow: 1 },
  { y: -36, s: 0.95, fog: 0.14, shadow: 0.55 },
  { y: -70, s: 0.9, fog: 0.28, shadow: 0.3 },
  { y: -102, s: 0.85, fog: 0.42, shadow: 0.15 },
  { y: -132, s: 0.8, fog: 0.56, shadow: 0.06 },
  { y: -158, s: 0.76, fog: 0.8, shadow: 0, out: true },
]
const ENTER_Y = 140 // newcomers start fully below the front card, so nothing shows through them

const SANS =
  'var(--font-geist, Geist), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
const MONO =
  'var(--font-geist-mono, "Geist Mono"), ui-monospace, SFMono-Regular, Menlo, monospace'

const CSS = `
:host{--fcs-bg:#F2F2F2;--fcs-accent:#0090FF;--fcs-dur:1500ms;--fcs-ease:cubic-bezier(.65,0,.35,1);
  display:block;position:relative;width:100%;aspect-ratio:${STAGE_W}/${STAGE_H};
  font-family:${SANS};-webkit-font-smoothing:antialiased}
.stage{position:absolute;left:0;top:0;width:${STAGE_W}px;height:${STAGE_H}px;transform-origin:0 0}
.card{position:absolute;left:50px;top:200px;width:380px;height:132px;transform-origin:50% 0;
  transition:transform var(--fcs-dur) var(--fcs-ease),opacity var(--fcs-dur) var(--fcs-ease)}
.shadow{position:absolute;inset:0;border-radius:16px;
  box-shadow:0 1px 2px rgba(17,17,17,.05),0 24px 40px -22px rgba(17,17,17,.22);transition:opacity var(--fcs-dur) var(--fcs-ease)}
.body{position:absolute;inset:0;border-radius:16px;background:#FFFFFF;border:1px solid #E6E6E6;overflow:hidden}
.fog{position:absolute;inset:-1px;border-radius:17px;background:var(--fcs-bg);opacity:0;pointer-events:none;
  transition:opacity var(--fcs-dur) var(--fcs-ease)}
.head{height:42px;display:flex;align-items:center;gap:10px;padding:0 14px 0 10px;border-bottom:1px solid #F0F0F0}
.tile{width:26px;height:26px;border-radius:8px;background:#F5F5F5;display:grid;place-items:center;flex:none}
.tile svg{width:14px;height:14px;fill:none;stroke:#7A7A7A;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;transition:stroke 600ms ease}
.card.front .tile svg{stroke:var(--fcs-accent)}
.name{font-size:13px;font-weight:500;line-height:18px;color:#111111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.size{margin-left:auto;font:400 11px/1 ${MONO};color:#A8A8A8;white-space:nowrap}
.cid{margin:12px 14px 0;height:34px;border-radius:10px;background:#FAFAFA;border:1px solid #EEEEEE;display:flex;align-items:center;gap:10px;padding:0 10px}
.tag{font:500 10px/14px ${MONO};letter-spacing:.08em;color:#555555;background:#EEEEEE;border-radius:6px;padding:2px 6px}
.cid code{font:400 12px/16px ${MONO};color:#111111}
.meta{display:flex;justify-content:space-between;margin:12px 16px 0;font:400 10px/14px ${MONO};color:#7A7A7A}
.meta span{display:flex;align-items:center;gap:6px}
.meta svg{width:11px;height:11px;fill:none;stroke:#7A7A7A;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.meta .ok{stroke:var(--fcs-accent)}
.toggle{position:absolute;right:2%;bottom:2%;width:28px;height:28px;border-radius:50%;border:1px solid #E6E6E6;background:#FFFFFF;
  color:#7A7A7A;display:grid;place-items:center;cursor:pointer;padding:0;opacity:.85}
.toggle:hover{opacity:1}
.toggle svg{width:11px;height:11px}
.toggle:focus-visible{outline:2px solid var(--fcs-accent);outline-offset:2px}
.toggle .play{display:none}
:host(.is-paused) .toggle .play{display:block}
:host(.is-paused) .toggle .pause{display:none}
:host([hide-controls]) .toggle{display:none}
@media (prefers-reduced-motion: reduce){
  .card,.fog,.shadow{transition:none}
  .toggle{display:none}
}`

const esc = (s: string) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  )

const cardHTML = ({ icon, name, size, cid }: ArchiveItem) => `
  <div class="shadow"></div>
  <div class="body">
    <div class="head"><span class="tile"><svg viewBox="0 0 24 24">${ICONS[icon] || ICONS.file}</svg></span>
      <span class="name">${esc(name)}</span><span class="size">${esc(size)}</span></div>
    <div class="cid"><span class="tag">CID</span><code>${esc(cid)}</code></div>
    <div class="meta">
      <span><svg viewBox="0 0 24 24">${LOCK}</svg>Archived</span>
      <span><svg class="ok" viewBox="0 0 24 24">${CHECK}</svg>Verified today</span>
    </div>
    <div class="fog"></div>
  </div>`

// `stackSlot`, not `slot`: elements already have a `slot` property (the shadow DOM attribute).
type Card = HTMLDivElement & { stackSlot?: number }

export class FilArchiveStack extends HTMLElement {
  static get observedAttributes() {
    return ['background', 'accent', 'interval']
  }

  private itemList: ArchiveItem[] = DEFAULT_ITEMS
  private timers: ReturnType<typeof setTimeout>[] = []
  private tickTimer?: ReturnType<typeof setTimeout>
  private running = false
  private paused = false
  private visible = true
  private started = false
  private front = 0
  private cards: Card[] = []
  private ro?: ResizeObserver
  private io?: IntersectionObserver
  private reduce?: MediaQueryList
  private readonly onChange = () => this.update()

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  get items() {
    return this.itemList
  }

  set items(list: ArchiveItem[]) {
    if (!Array.isArray(list) || list.length < VISIBLE + 2) {
      console.warn(
        `<fil-archive-stack>: items needs at least ${VISIBLE + 2} entries; keeping the defaults.`,
      )
      return
    }
    this.itemList = list
    if (this.isConnected) {
      this.teardown()
      this.build()
    }
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ) {
    if (name === 'background')
      this.style.setProperty('--fcs-bg', value || '#F2F2F2')
    if (name === 'accent')
      this.style.setProperty('--fcs-accent', value || '#0090FF')
    if (name === 'interval' && this.running) this.schedule()
  }

  connectedCallback() {
    this.setAttribute('role', 'img')
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute(
        'aria-label',
        'A growing stack of archived files, newest in front, older ones tucked behind it',
      )
    }
    this.build()
  }

  disconnectedCallback() {
    this.teardown()
  }

  private get interval() {
    return Math.max(1800, Number(this.getAttribute('interval')) || 3800)
  }

  private build() {
    const root = this.shadowRoot!
    root.innerHTML = `<style>${CSS}</style><div class="stage" part="stage"></div>
      <button class="toggle" type="button" aria-label="Pause animation">
        <svg class="pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        <svg class="play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
      </button>`
    const stage = root.querySelector<HTMLDivElement>('.stage')!
    const toggle = root.querySelector<HTMLButtonElement>('.toggle')!
    this.started = false

    this.cards = []
    for (let i = 0; i <= VISIBLE; i++) {
      const card: Card = document.createElement('div')
      card.className = 'card'
      card.innerHTML = cardHTML(this.itemList[i])
      stage.appendChild(card)
      this.cards.push(card)
    }
    this.front = 0 // newcomers count backwards through items, so they are never already on screen

    this.ro = new ResizeObserver(() => {
      stage.style.transform = `scale(${this.clientWidth / STAGE_W})`
    })
    this.ro.observe(this)

    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      this.update()
    })
    this.io.observe(this)

    document.addEventListener('visibilitychange', this.onChange)
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)')
    this.reduce.addEventListener('change', this.onChange)

    toggle.addEventListener('click', () => {
      this.paused = !this.paused
      this.classList.toggle('is-paused', this.paused)
      toggle.setAttribute(
        'aria-label',
        this.paused ? 'Play animation' : 'Pause animation',
      )
      this.update()
    })

    // Intro: the stack settles from the back to the front, once.
    this.cards.forEach((card) =>
      this.instant(card, () => this.place(card, VISIBLE)),
    )
    if (this.reduce.matches) {
      this.cards.forEach((card, i) =>
        this.instant(card, () => this.place(card, Math.min(i, VISIBLE))),
      )
      this.started = true
    } else {
      requestAnimationFrame(() => {
        for (let i = VISIBLE - 1; i >= 0; i--)
          this.later(
            () => this.place(this.cards[i], i),
            (VISIBLE - 1 - i) * 100,
          )
        this.later(
          () => {
            this.started = true
            this.update()
          },
          VISIBLE * 100 + 1200,
        )
      })
    }
  }

  private teardown() {
    this.timers.forEach(clearTimeout)
    this.timers = []
    clearTimeout(this.tickTimer)
    this.running = false
    this.ro?.disconnect()
    this.io?.disconnect()
    document.removeEventListener('visibilitychange', this.onChange)
    this.reduce?.removeEventListener('change', this.onChange)
  }

  private later(fn: () => void, ms: number) {
    this.timers.push(setTimeout(fn, ms))
  }

  private place(card: Card, slot: number) {
    let y: number
    let s: number
    let opacity = 1
    let fog = 0
    let shadow: number
    if (slot < 0) {
      y = ENTER_Y
      s = 1
      opacity = 0
      shadow = 1
    } else {
      const d = SLOTS[slot]
      y = d.y
      s = d.s
      fog = d.fog
      shadow = d.shadow
      if (d.out) opacity = 0
    }
    card.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`
    card.style.opacity = String(opacity)
    card.style.zIndex = String(100 - slot)
    card.querySelector<HTMLElement>('.fog')!.style.opacity = String(fog)
    card.querySelector<HTMLElement>('.shadow')!.style.opacity = String(shadow)
    card.classList.toggle('front', slot === 0)
    card.stackSlot = slot
  }

  private instant(card: Card, fn: () => void) {
    const parts = [card, ...card.querySelectorAll<HTMLElement>('.fog,.shadow')]
    parts.forEach((n) => (n.style.transition = 'none'))
    fn()
    void card.offsetWidth
    parts.forEach((n) => (n.style.transition = ''))
  }

  private tick() {
    const fresh = this.cards.find((card) => (card.stackSlot ?? 0) >= VISIBLE)
    if (!fresh) return
    this.front = (this.front - 1 + this.itemList.length) % this.itemList.length
    fresh.innerHTML = cardHTML(this.itemList[this.front])
    this.instant(fresh, () => this.place(fresh, -1))
    // The newcomer turns opaque quickly while it is still below the stack.
    fresh.style.transition =
      'transform var(--fcs-dur) var(--fcs-ease), opacity 450ms cubic-bezier(.23,1,.32,1)'
    this.cards.forEach((card) => {
      if (card !== fresh)
        this.place(card, Math.min((card.stackSlot ?? 0) + 1, VISIBLE))
    })
    this.place(fresh, 0)
    this.later(() => (fresh.style.transition = ''), 1600)
    this.schedule()
  }

  private schedule() {
    clearTimeout(this.tickTimer)
    if (this.running)
      this.tickTimer = setTimeout(() => this.tick(), this.interval)
  }

  private update() {
    const go =
      this.started &&
      !this.paused &&
      this.visible &&
      !document.hidden &&
      !this.reduce?.matches
    if (go && !this.running) {
      this.running = true
      this.schedule()
    }
    if (!go && this.running) {
      this.running = false
      clearTimeout(this.tickTimer)
    }
  }
}

if (!customElements.get('fil-archive-stack'))
  customElements.define('fil-archive-stack', FilArchiveStack)
