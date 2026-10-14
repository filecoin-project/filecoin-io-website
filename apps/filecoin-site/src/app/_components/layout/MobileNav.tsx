'use client'

import { useEffect, useState } from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import clsx from 'clsx'
import { useLenis } from 'lenis/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import type { NavLink, NavSection } from '@/data/site-nav'

import LanguageSwitch from '@/components/layout/LanguageSwitch'
import MenuColumns from '@/components/layout/MenuColumns'
import NavAnchor from '@/components/layout/NavAnchor'
import ButtonLink from '@/components/ui/ButtonLink'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Hamburger that morphs into a close icon. */
export function MenuToggle({
  locale = 'en',
  open,
  onToggle,
}: {
  locale?: Locale
  open: boolean
  onToggle: () => void
}) {
  const { HEADER } = copy(locale).ui
  return (
    <button
      type="button"
      aria-label={open ? HEADER.closeMenu : HEADER.openMenu}
      aria-expanded={open}
      aria-controls="site-mobile-nav"
      className="relative grid size-11 place-items-center rounded-full transition-colors duration-200 ease-out hover:bg-(--hdr-hover) active:scale-[0.96]"
      onClick={onToggle}
    >
      <span aria-hidden="true" className="relative block h-3 w-5">
        <span
          className={clsx(
            'ease-out-quint absolute left-0 h-[1.5px] w-5 rounded-full bg-(--hdr-fg) transition-[top,transform,background-color] duration-300',
            open ? 'top-[5.25px] rotate-45' : 'top-0',
          )}
        />
        <span
          className={clsx(
            'ease-out-quint absolute left-0 h-[1.5px] w-5 rounded-full bg-(--hdr-fg) transition-[top,transform,background-color] duration-300',
            open ? 'top-[5.25px] -rotate-45' : 'top-[10.5px]',
          )}
        />
      </span>
    </button>
  )
}

function Accordion({
  section,
  open,
  onToggle,
  onNavigate,
}: {
  section: NavSection
  open: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  const id = `site-mobile-${section.label.toLowerCase()}`
  return (
    <div className="border-b border-white/8">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        className="font-heading font-book flex w-full items-center justify-between py-4 text-left text-2xl tracking-[-0.02em] text-slate-50"
        onClick={onToggle}
      >
        {section.label}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/icons/chevron-down.svg"
          alt=""
          width={20.894}
          height={20.894}
          className={clsx(
            'ease-out-quint size-[20.894px] transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            transition={{
              height: { duration: 0.38, ease: EASE_OUT },
              opacity: { duration: 0.24 },
            }}
          >
            <div className="pt-1 pb-6">
              <MenuColumns
                section={section}
                layout="stack"
                onNavigate={onNavigate}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MobileNav({
  locale = 'en',
  open,
  menus,
  pricing,
  onClose,
}: {
  locale?: Locale
  open: boolean
  menus: NavSection[]
  /** Optional plain link after the accordions. */
  pricing?: NavLink
  onClose: () => void
}) {
  const { HERO } = copy(locale).home
  const { HEADER } = copy(locale).ui
  const lenis = useLenis()
  const reduceMotion = useReducedMotion()
  const [expanded, setExpanded] = useState<string | null>(null)

  // Freeze the page behind the sheet, close on Escape or when the desktop nav takes over.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    lenis?.stop()
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const desktop = window.matchMedia('(min-width: 64rem)')
    const onChange = () => desktop.matches && onClose()
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onChange)
    return () => {
      root.style.overflow = previous
      lenis?.start()
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onChange)
    }
  }, [open, lenis, onClose])

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    shown: { opacity: 1, y: 0 },
  }

  return (
    <AnimatePresence onExitComplete={() => setExpanded(null)}>
      {open && (
        <motion.div
          key="sheet"
          id="site-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={HEADER.siteMenu}
          className="fixed inset-0 z-40 bg-slate-950/97 backdrop-blur-xl lg:hidden"
          transition={{ duration: 0.55, ease: EASE_OUT }}
          initial={
            reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : {
                  clipPath: 'inset(0 0 100% 0)',
                  transition: { duration: 0.32, ease: [0.77, 0, 0.175, 1] },
                }
          }
        >
          <div
            data-lenis-prevent
            className="h-full overflow-y-auto overscroll-contain pt-(--header-h)"
          >
            <motion.nav
              aria-label={HEADER.mainNavigation}
              className="container-site flex min-h-full flex-col pt-4 pb-10"
              initial="hidden"
              animate="shown"
              transition={{ staggerChildren: 0.045, delayChildren: 0.12 }}
            >
              {menus.map((section) => (
                <motion.div
                  key={section.label}
                  variants={item}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  <Accordion
                    section={section}
                    open={expanded === section.label}
                    onNavigate={onClose}
                    onToggle={() =>
                      setExpanded((cur) =>
                        cur === section.label ? null : section.label,
                      )
                    }
                  />
                </motion.div>
              ))}
              {pricing && (
                <motion.div
                  variants={item}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="border-b border-white/8"
                >
                  <NavAnchor
                    link={pricing}
                    navGroup="products"
                    className="font-heading font-book block py-4 text-2xl tracking-[-0.02em] text-slate-50"
                    onNavigate={onClose}
                  />
                </motion.div>
              )}

              <motion.div
                variants={item}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="mt-auto flex flex-col gap-6 pt-10"
              >
                <div className="grid grid-cols-2 gap-3">
                  <ButtonLink
                    href={HERO.primary.href}
                    data-foc-cta={HERO.primary.ref}
                    variant="primary"
                    className="w-full"
                  >
                    {HERO.primary.label}
                  </ButtonLink>
                  <ButtonLink
                    href={HERO.secondary.href}
                    data-foc-cta={HERO.secondary.ref}
                    variant="secondary"
                    className="w-full"
                  >
                    {HERO.secondary.label}
                  </ButtonLink>
                </div>
                <LanguageSwitch locale={locale} className="justify-center" />
              </motion.div>
            </motion.nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
