/**
 * <fil-drive-share>: the Filecoin Drive hero animation, for "Store your photos, documents and
 * videos, open them from any browser, and share them with a link."
 *
 * A photo, a document or a video drops into a "My Drive" window and lands at the top of the file
 * list, then a "Share link" chip travels from it to a small browser window, which opens the file. The next file follows, and the oldest row slides out
 * of the bottom of the list.
 *
 * A native Web Component (Shadow DOM, no dependencies). It fills its container's width at a
 * 480 × 400 aspect ratio on a transparent background. Text is set in the site's Geist and Geist
 * Mono (`--font-geist`, `--font-geist-mono`). Rendered by `DriveShare.tsx`, which loads this
 * module in the browser only.
 *
 * Attributes (all optional)
 *   accent         Filecoin blue                                       default #0090FF
 *   locale         "zh-cn" sets the window's own words in Chinese       default English
 *   interval       milliseconds between files                          default 4200
 *   hide-controls  hides the small pause/play button (WCAG 2.2.2: keep it unless the page offers
 *                  another way to stop motion)
 *
 * Animates only transform and opacity; pauses when off screen or the tab is hidden; shows the
 * still composition when the visitor prefers reduced motion.
 */

const W = 480
const H = 400

// The "My Drive" window and its file list, in stage units.
const WIN = { x: 24, y: 70, w: 296, h: 268 }
const LIST = { x: WIN.x + 10, y: WIN.y + 54, w: WIN.w - 20 }
const ROW_H = 44
const STEP = 52
const VISIBLE = 4
// The browser window a shared link opens in.
const CARD = { x: 300, y: 230, w: 160, h: 140 }

const ICONS = {
  photo:
    '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  video:
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
}
const LINK =
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
const CHECK = '<path d="M20 6 9 17l-5-5"/>'
const LOGO = `<svg viewBox="0 0 464 464" aria-hidden="true"><path fill="var(--acc)" d="M232 464C104.4 464 0 359.6 0 230.84 1.16 103.24 104.4-1.16 233.16 0 360.76 1.16 464 104.4 464 234.32 462.84 360.76 359.6 464 232 464Z"/><path fill="#fff" d="M254.04 204.16 247.08 241.28 313.2 250.56 308.56 267.96 243.6 258.68C238.96 273.76 236.64 290 230.84 303.92 225.04 320.16 219.24 336.4 212.28 351.48 203 371.2 186.76 385.12 164.72 388.6 151.96 390.92 138.04 389.76 127.6 381.64 124.12 379.32 120.64 374.68 120.64 371.2 120.64 366.56 122.96 360.76 126.44 358.44 128.76 357.28 134.56 358.44 138.04 359.6 141.52 363.08 145 367.72 147.32 372.36 154.28 381.64 163.56 382.8 172.84 375.84 183.28 366.56 189.08 353.8 192.56 341.04 199.52 313.2 206.48 286.52 212.28 258.68V254.04L150.8 244.76 153.12 227.36 216.92 236.64 225.04 200.68 158.92 190.24 161.24 171.68 229.68 180.96C232 174 233.16 168.2 235.48 162.4 241.28 141.52 247.08 120.64 261 102.08 274.92 83.52 291.16 71.92 315.52 73.08 325.96 73.08 336.4 76.56 343.36 84.68 344.52 85.84 346.84 88.16 346.84 90.48 346.84 95.12 346.84 100.92 343.36 104.4 338.72 107.88 332.92 106.72 328.28 102.08 324.8 98.6 322.48 95.12 319 91.64 312.04 82.36 301.6 81.2 293.48 89.32 287.68 95.12 281.88 103.24 278.4 111.36 270.28 135.72 264.48 161.24 256.36 186.76L320.16 196.04 315.52 213.44 254.04 204.16Z"/></svg>`

type Kind = keyof typeof ICONS
type DriveFile = { kind: Kind; name: string }

// Newest first in the still composition; the loop then brings in FILES[3], FILES[4] and so on.
const FILES: DriveFile[] = [
  { kind: 'doc', name: 'recipes.docx' },
  { kind: 'photo', name: 'garden.jpg' },
  { kind: 'video', name: 'first-steps.mov' },
  { kind: 'photo', name: 'beach-day.jpg' },
  { kind: 'doc', name: 'lease.pdf' },
  { kind: 'video', name: 'birthday.mp4' },
  { kind: 'photo', name: 'new-flat.jpg' },
  { kind: 'doc', name: 'trip-plan.pdf' },
  { kind: 'video', name: 'concert.mov' },
]

const WORDS = {
  en: {
    drive: 'My Drive',
    share: 'Share link',
    opened: 'Opened from a link',
    label:
      'Photos, documents and videos go into Filecoin Drive and open from a shared link',
  },
  'zh-cn': {
    drive: '我的 Drive',
    share: '分享链接',
    opened: '通过链接打开',
    label: '照片、文档和视频放进 Filecoin Drive，并通过分享链接打开',
  },
}

const SANS =
  'var(--font-geist, Geist), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
const MONO =
  'var(--font-geist-mono, "Geist Mono"), ui-monospace, SFMono-Regular, Menlo, monospace'
const EASE = 'cubic-bezier(.65,0,.35,1)'

const CSS = `
:host{--acc:#0090FF;display:block;position:relative;width:100%;aspect-ratio:${W}/${H};
  font-family:${SANS};-webkit-font-smoothing:antialiased}
.stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
.shade{box-shadow:0 1px 2px rgba(17,17,17,.05),0 24px 40px -22px rgba(17,17,17,.22)}
.win{position:absolute;left:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px;box-sizing:border-box;border-radius:20px;
  background:#fff;border:1px solid #E6E6E6;overflow:hidden}
.head{height:44px;display:flex;align-items:center;gap:10px;padding:0 14px;border-bottom:1px solid #F0F0F0;
  font-size:13px;font-weight:500;letter-spacing:-.005em;color:#111}
.head svg{width:20px;height:20px;display:block}
.list{position:absolute;left:${LIST.x - WIN.x - 1}px;top:${LIST.y - WIN.y - 1}px;width:${LIST.w}px;height:${STEP * VISIBLE - (STEP - ROW_H)}px;overflow:hidden}
.row{position:absolute;left:0;top:0;width:100%;height:${ROW_H}px;box-sizing:border-box;border-radius:12px;background:#FAFAFA;border:1px solid #EEEEEE;
  display:flex;align-items:center;gap:10px;padding:0 12px 0 9px;
  transition:transform 700ms ${EASE},opacity 500ms ease,border-color 500ms ease,background-color 500ms ease}
.row.new{background:#fff;border-color:color-mix(in srgb,var(--acc) 40%,#E6E6E6)}
.tile{width:26px;height:26px;border-radius:8px;background:#F0F0F0;display:grid;place-items:center;flex:none}
.tile svg,.chip svg,.big svg{fill:none;stroke-linecap:round;stroke-linejoin:round}
.tile svg{width:14px;height:14px;stroke:#7A7A7A;stroke-width:1.75;transition:stroke 500ms ease}
.row.new .tile svg{stroke:var(--acc)}
.name{font-size:13px;font-weight:500;line-height:18px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chip{position:absolute;left:0;top:0;height:40px;box-sizing:border-box;border-radius:999px;background:#fff;border:1px solid #E6E6E6;
  display:flex;align-items:center;gap:8px;padding:0 16px 0 12px;font-size:13px;font-weight:500;color:#111;white-space:nowrap;opacity:0;will-change:transform,opacity}
.chip svg{width:16px;height:16px;stroke:var(--acc);stroke-width:1.75}
.link{height:30px;padding:0 12px 0 10px;gap:6px;font-size:12px;color:var(--acc);border-color:color-mix(in srgb,var(--acc) 45%,#E6E6E6)}
.link svg{width:13px;height:13px;stroke-width:2}
.card{position:absolute;left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;box-sizing:border-box;border-radius:16px;
  background:#fff;border:1px solid #E6E6E6;overflow:hidden}
.bar{height:28px;display:flex;align-items:center;gap:4px;padding:0 10px;border-bottom:1px solid #F0F0F0;background:#FAFAFA}
.bar i{width:6px;height:6px;border-radius:50%;background:#E0E0E0}
.url{margin-left:6px;flex:1;height:14px;border-radius:7px;background:#fff;border:1px solid #EEEEEE;display:flex;align-items:center;padding:0 5px}
.url svg{width:8px;height:8px;fill:none;stroke:#A8A8A8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.open{padding:14px 14px 0;transition:opacity 260ms ease,transform 420ms ${EASE}}
.open.out{opacity:0;transform:translateY(6px)}
.big{width:40px;height:40px;border-radius:12px;background:color-mix(in srgb,var(--acc) 10%,#fff);display:grid;place-items:center}
.big svg{width:20px;height:20px;stroke:var(--acc);stroke-width:1.75}
.open .name{margin-top:10px;display:block}
.seen{margin-top:6px;display:flex;align-items:center;gap:5px;font:400 10px/14px ${MONO};color:#7A7A7A;white-space:nowrap}
.seen svg{width:11px;height:11px;fill:none;stroke:var(--acc);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.intro .win,.intro .card{opacity:0;transform:translateY(10px)}
.win,.card{transition:opacity 700ms ease,transform 700ms ${EASE}}
.toggle{position:absolute;right:2%;bottom:2%;width:28px;height:28px;border-radius:50%;border:1px solid #E6E6E6;background:#fff;color:#7A7A7A;
  display:grid;place-items:center;cursor:pointer;padding:0;opacity:.85}
.toggle:hover{opacity:1}.toggle svg{width:11px;height:11px}
.toggle:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.toggle .play{display:none}:host(.is-paused) .toggle .play{display:block}:host(.is-paused) .toggle .pause{display:none}
:host([hide-controls]) .toggle{display:none}
@media (prefers-reduced-motion: reduce){.row,.open,.win,.card{transition:none}.toggle{display:none}}`

const esc = (s: string) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  )
const icon = (kind: Kind) => `<svg viewBox="0 0 24 24">${ICONS[kind]}</svg>`

// `listSlot`, not `slot`: elements already have a `slot` property (the shadow DOM attribute).
type Row = HTMLDivElement & { listSlot?: number }

export class FilDriveShare extends HTMLElement {
  static get observedAttributes() {
    return ['accent', 'locale', 'interval']
  }

  private timers: ReturnType<typeof setTimeout>[] = []
  private tickTimer?: ReturnType<typeof setTimeout>
  private running = false
  private paused = false
  private visible = true
  private started = false
  private next = 3
  private rows: Row[] = []
  private stage?: HTMLDivElement
  private chip?: HTMLDivElement
  private link?: HTMLDivElement
  private open?: HTMLDivElement
  private ro?: ResizeObserver
  private io?: IntersectionObserver
  private reduce?: MediaQueryList
  private readonly onChange = () => this.update()

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ) {
    if (name === 'accent') this.style.setProperty('--acc', value || '#0090FF')
    if (name === 'locale' && old !== value && this.stage) {
      this.teardown()
      this.build()
    }
    if (name === 'interval' && this.running) this.schedule()
  }

  connectedCallback() {
    this.setAttribute('role', 'img')
    this.build()
  }

  disconnectedCallback() {
    this.teardown()
  }

  private get words() {
    return this.getAttribute('locale') === 'zh-cn' ? WORDS['zh-cn'] : WORDS.en
  }

  private get interval() {
    return Math.max(3600, Number(this.getAttribute('interval')) || 4200)
  }

  private rowHTML({ kind, name }: DriveFile) {
    return `<span class="tile">${icon(kind)}</span><span class="name">${esc(name)}</span>`
  }

  private openHTML({ kind, name }: DriveFile) {
    return `<div class="big">${icon(kind)}</div><span class="name">${esc(name)}</span>
      <span class="seen"><svg viewBox="0 0 24 24">${CHECK}</svg>${esc(this.words.opened)}</span>`
  }

  private build() {
    const root = this.shadowRoot!
    const words = this.words
    if (!this.hasAttribute('aria-label') || this.dataset.autoLabel) {
      this.setAttribute('aria-label', words.label)
      this.dataset.autoLabel = '1'
    }
    root.innerHTML = `<style>${CSS}</style>
      <div class="stage intro">
        <div class="win shade">
          <div class="head">${LOGO}${esc(words.drive)}</div>
          <div class="list"></div>
        </div>
        <div class="card shade">
          <div class="bar"><i></i><i></i><i></i><span class="url"><svg viewBox="0 0 24 24">${LINK}</svg></span></div>
          <div class="open"></div>
        </div>
        <div class="chip drop shade"></div>
        <div class="chip link shade"><svg viewBox="0 0 24 24">${LINK}</svg>${esc(words.share)}</div>
      </div>
      <button class="toggle" type="button" aria-label="Pause animation">
        <svg class="pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        <svg class="play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
      </button>`
    const q = <T extends Element>(selector: string) =>
      root.querySelector<T>(selector)!
    const stage = q<HTMLDivElement>('.stage')
    const list = q<HTMLDivElement>('.list')
    this.stage = stage
    this.chip = q<HTMLDivElement>('.drop')
    this.link = q<HTMLDivElement>('.link')
    this.open = q<HTMLDivElement>('.open')
    this.started = false
    this.next = 3

    // Rows 0–2 hold the still composition; the rest wait out of view.
    this.rows = []
    for (let i = 0; i <= VISIBLE; i++) {
      const row: Row = document.createElement('div')
      row.className = 'row'
      row.innerHTML = this.rowHTML(FILES[Math.min(i, FILES.length - 1)])
      list.appendChild(row)
      this.rows.push(row)
      this.instant(row, () => this.place(row, i < 3 ? i : VISIBLE))
    }
    this.open.innerHTML = this.openHTML(FILES[0])

    this.ro = new ResizeObserver(() => {
      stage.style.transform = `scale(${this.clientWidth / W})`
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

    const toggle = q<HTMLButtonElement>('.toggle')
    toggle.addEventListener('click', () => {
      this.paused = !this.paused
      this.classList.toggle('is-paused', this.paused)
      toggle.setAttribute(
        'aria-label',
        this.paused ? 'Play animation' : 'Pause animation',
      )
      this.update()
    })

    // Intro: the drive window, then the browser window, once.
    const parts = [q<HTMLElement>('.win'), q<HTMLElement>('.card')]
    if (this.reduce.matches) {
      stage.classList.remove('intro')
      this.started = true
    } else {
      requestAnimationFrame(() => {
        parts.forEach((el, i) => (el.style.transitionDelay = `${i * 140}ms`))
        stage.classList.remove('intro')
        this.later(
          () => parts.forEach((el) => (el.style.transitionDelay = '')),
          1000,
        )
        this.later(() => {
          this.started = true
          this.update()
        }, 900)
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

  /** Slot 0 is the top of the list; VISIBLE is out of view below it; -1 is just above it. */
  private place(row: Row, slot: number) {
    row.style.transform = `translate3d(0,${slot * STEP}px,0)`
    row.style.opacity = slot < 0 || slot >= VISIBLE ? '0' : '1'
    row.listSlot = slot
  }

  private instant(row: Row, fn: () => void) {
    row.style.transition = 'none'
    fn()
    void row.offsetWidth
    row.style.transition = ''
  }

  /** One file: drop in, land on top of the list, share, open. */
  private tick() {
    const file = FILES[this.next]
    this.next = (this.next + 1) % FILES.length
    const chip = this.chip!
    const link = this.link!
    const open = this.open!

    // 1. The file drops into the drive window, onto the top row.
    chip.innerHTML = `${icon(file.kind)}${esc(file.name)}`
    const top: [number, number] = [LIST.x + 4, LIST.y + 2]
    chip.animate(
      [
        { transform: `translate(${WIN.x + 96}px,-6px) scale(.96)`, opacity: 0 },
        {
          transform: `translate(${WIN.x + 92}px,12px) scale(1)`,
          opacity: 1,
          offset: 0.2,
        },
        {
          transform: `translate(${WIN.x + 64}px,${WIN.y + 4}px) scale(1)`,
          opacity: 1,
          offset: 0.62,
          easing: EASE,
        },
        {
          transform: `translate(${top[0]}px,${top[1]}px) scale(.94)`,
          opacity: 0,
        },
      ],
      { duration: 1150, easing: 'cubic-bezier(.33,0,.2,1)', fill: 'forwards' },
    )

    // 2. The list makes room while the file is still falling, and the file lands in the gap.
    const fresh = this.rows.find((row) => (row.listSlot ?? 0) >= VISIBLE)
    this.later(() => {
      if (!fresh) return
      fresh.innerHTML = this.rowHTML(file)
      this.instant(fresh, () => {
        this.place(fresh, 0)
        fresh.style.opacity = '0'
      })
      this.rows.forEach((row) => {
        row.classList.remove('new')
        if (row !== fresh)
          this.place(row, Math.min((row.listSlot ?? 0) + 1, VISIBLE))
      })
    }, 380)
    this.later(() => {
      if (!fresh) return
      fresh.style.opacity = '1'
      fresh.classList.add('new')
    }, 1000)

    // 3. A share link travels to the browser window, which opens the file.
    this.later(() => {
      link.animate(
        [
          {
            transform: `translate(${LIST.x + LIST.w - 100}px,${LIST.y - 16}px) scale(.9)`,
            opacity: 0,
          },
          {
            transform: `translate(${LIST.x + LIST.w - 80}px,${LIST.y - 34}px) scale(1)`,
            opacity: 1,
            offset: 0.22,
          },
          {
            transform: `translate(${CARD.x + 26}px,${CARD.y - 40}px) scale(1)`,
            opacity: 1,
            offset: 0.78,
            easing: EASE,
          },
          {
            transform: `translate(${CARD.x + 30}px,${CARD.y - 2}px) scale(.9)`,
            opacity: 0,
          },
        ],
        {
          duration: 1100,
          easing: 'cubic-bezier(.33,0,.2,1)',
          fill: 'forwards',
        },
      )
    }, 1450)
    this.later(() => open.classList.add('out'), 2350)
    this.later(() => {
      open.innerHTML = this.openHTML(file)
      void open.offsetWidth
      open.classList.remove('out')
    }, 2620)
    this.later(() => fresh?.classList.remove('new'), 3300)

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
      // The first file comes in soon after the window settles; later ones every `interval`.
      clearTimeout(this.tickTimer)
      this.tickTimer = setTimeout(() => this.tick(), 600)
    }
    if (!go && this.running) {
      this.running = false
      clearTimeout(this.tickTimer)
    }
  }
}

if (!customElements.get('fil-drive-share'))
  customElements.define('fil-drive-share', FilDriveShare)
