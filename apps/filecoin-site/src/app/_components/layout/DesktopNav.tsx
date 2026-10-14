'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'

import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from 'motion/react'

import type { NavLink, NavSection } from '@/data/site-nav'

import MenuColumns from '@/components/layout/MenuColumns'
import NavAnchor from '@/components/layout/NavAnchor'

const OPEN_DELAY = 70 // hover intent: ignore a pointer that is only passing through
const CLOSE_DELAY = 160 // lets the pointer cross the gap between trigger and panel
const MORPH: Transition = { type: 'spring', duration: 0.42, bounce: 0 }
const EASE_OUT = [0.23, 1, 0.32, 1] as const

const TRIGGER =
  'flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-base leading-[1.4375] font-semibold text-(--hdr-fg) ' +
  'transition-colors duration-200 ease-out hover:bg-(--hdr-hover) aria-expanded:bg-(--hdr-hover)'

type Size = { width: number; height: number }

function Chevron({ open }: { open: boolean }) {
  return (
    <CaretDownIcon
      aria-hidden="true"
      className={clsx(
        'ease-out-quint size-[20.894px] transition-transform duration-300',
        open && 'rotate-180',
      )}
    />
  )
}

/** Measures its content's natural size so the shared panel can morph to fit it. */
function PanelContent({
  section,
  direction,
  onMeasure,
  onNavigate,
}: {
  section: NavSection
  direction: number
  onMeasure: (size: Size) => void
  onNavigate: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (el) onMeasure({ width: el.offsetWidth, height: el.offsetHeight })
  }, [onMeasure])

  return (
    <motion.div
      ref={ref}
      id={`site-menu-${section.label.toLowerCase()}`}
      className="absolute top-0 left-0 w-max p-6"
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.26, ease: EASE_OUT }}
      variants={{
        enter: (d: number) => ({ opacity: 0, x: d * 36 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d * -36 }),
      }}
    >
      <MenuColumns section={section} layout="row" onNavigate={onNavigate} />
    </motion.div>
  )
}

export default function DesktopNav({
  menus,
  pricing,
  active,
  onActiveChange,
  boundsRef,
}: {
  menus: NavSection[]
  /** Optional plain link after the menus. */
  pricing?: NavLink
  active: string | null
  onActiveChange: (label: string | null) => void
  /** The element the panel must stay inside (the header's content column). */
  boundsRef: RefObject<HTMLElement | null>
}) {
  const reduceMotion = useReducedMotion()
  const navRef = useRef<HTMLDivElement>(null)
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const [direction, setDirection] = useState(0)
  const [ready, setReady] = useState(false)
  const placed = useRef(false)

  // Panel geometry lives in motion values: the first placement jumps, later ones morph.
  const x = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)

  const activeSection = menus.find((m) => m.label === active) ?? null

  const open = useCallback(
    (label: string) => {
      window.clearTimeout(closeTimer.current)
      if (label === active) return
      const from = menus.findIndex((m) => m.label === active)
      const to = menus.findIndex((m) => m.label === label)
      setDirection(from < 0 ? 0 : Math.sign(to - from))
      onActiveChange(label)
    },
    [active, menus, onActiveChange],
  )

  const close = useCallback(() => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    onActiveChange(null)
  }, [onActiveChange])

  const scheduleOpen = (label: string) => {
    window.clearTimeout(closeTimer.current)
    window.clearTimeout(openTimer.current)
    // Once a menu is open, moving between triggers switches instantly.
    if (active) open(label)
    else openTimer.current = window.setTimeout(() => open(label), OPEN_DELAY)
  }

  const scheduleClose = () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(close, CLOSE_DELAY)
  }

  const cancelClose = () => window.clearTimeout(closeTimer.current)

  // Centre the panel under its trigger, kept inside the content column.
  const place = useCallback(
    (size: Size) => {
      const nav = navRef.current
      const trigger = active ? triggers.current.get(active) : undefined
      if (!nav || !trigger) return
      const navBox = nav.getBoundingClientRect()
      const t = trigger.getBoundingClientRect()
      const bounds = boundsRef.current?.getBoundingClientRect() ?? navBox
      const min = bounds.left - navBox.left
      const max = bounds.right - navBox.left - size.width
      const next = Math.max(
        min,
        Math.min(t.left - navBox.left + t.width / 2 - size.width / 2, max),
      )

      if (!placed.current || reduceMotion) {
        x.jump(next)
        width.jump(size.width)
        height.jump(size.height)
        placed.current = true
        setReady(true)
      } else {
        animate(x, next, MORPH)
        animate(width, size.width, MORPH)
        animate(height, size.height, MORPH)
      }
    },
    [active, boundsRef, height, reduceMotion, width, x],
  )

  // Escape closes and returns focus; so does a click anywhere outside the nav.
  useEffect(() => {
    if (!active) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      triggers.current.get(active)?.focus()
      close()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && navRef.current?.contains(e.target)) return
      close()
    }
    const onResize = () => close()
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
    }
  }, [active, close])

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current)
      window.clearTimeout(closeTimer.current)
    },
    [],
  )

  return (
    <div
      ref={navRef}
      className="relative"
      onPointerLeave={(e) => e.pointerType === 'mouse' && scheduleClose()}
      onPointerEnter={cancelClose}
      onBlur={(e) => {
        // Tabbing out of the nav (not just between its links) closes the menu.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close()
      }}
    >
      <ul
        aria-label="Main navigation"
        className="flex items-center gap-[1.5625rem]"
      >
        {menus.map((menu) => {
          const expanded = menu.label === active
          return (
            <li key={menu.label}>
              <button
                ref={(el) => {
                  if (el) triggers.current.set(menu.label, el)
                  else triggers.current.delete(menu.label)
                }}
                type="button"
                className={TRIGGER}
                aria-expanded={expanded}
                aria-controls={
                  expanded ? `site-menu-${menu.label.toLowerCase()}` : undefined
                }
                onClick={() => (expanded ? close() : open(menu.label))}
                onPointerEnter={(e) =>
                  e.pointerType === 'mouse' && scheduleOpen(menu.label)
                }
              >
                {menu.label}
                <Chevron open={expanded} />
              </button>
            </li>
          )
        })}
        {pricing && (
          <li>
            <NavAnchor
              link={pricing}
              className="block rounded-[4px] px-2.5 py-1.5 text-base leading-[1.4375] font-semibold text-(--hdr-fg) transition-colors duration-200 ease-out hover:bg-(--hdr-hover)"
            />
          </li>
        )}
      </ul>

      <AnimatePresence
        onExitComplete={() => {
          placed.current = false
          setReady(false)
        }}
      >
        {activeSection && (
          <motion.div
            key="panel"
            className="absolute top-full left-0 pt-3"
            style={{ x }}
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            animate={
              ready
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: -6, scale: 0.985 }
            }
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.99,
              transition: { duration: 0.16, ease: EASE_OUT },
            }}
            onPointerEnter={cancelClose}
          >
            <motion.div
              className="relative origin-top overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/96 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.55)] backdrop-blur-xl"
              style={{ width, height }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <PanelContent
                  key={activeSection.label}
                  section={activeSection}
                  direction={direction}
                  onMeasure={place}
                  onNavigate={close}
                />
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
