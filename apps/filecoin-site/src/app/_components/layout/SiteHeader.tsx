'use client'

import { useCallback, useRef, useState } from 'react'

import { copy } from '@/i18n/copy'
import { localePath, type Locale } from '@/i18n/locales'

import clsx from 'clsx'
import { useMotionValueEvent, useScroll } from 'motion/react'

import DesktopNav from '@/components/layout/DesktopNav'
import LanguageSwitch from '@/components/layout/LanguageSwitch'
import MobileNav, { MenuToggle } from '@/components/layout/MobileNav'

const SOLID_AFTER = 16 // px scrolled before the bar gets its glass background
const HIDE_AFTER = 480 // px scrolled before scrolling down tucks the bar away

/**
 * Fixed header. Transparent over the hero, frosted glass once the page scrolls, tucked away
 * while reading down the page and back as soon as the reader scrolls up.
 */
export default function SiteHeader({ locale = 'en' }: { locale?: Locale }) {
  const { nav, ui } = copy(locale)
  const menus = nav.NAV.home
  const boundsRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [tucked, setTucked] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - (scrollY.getPrevious() ?? y)
    setSolid(y > SOLID_AFTER)
    if (y < HIDE_AFTER) setTucked(false)
    else if (Math.abs(delta) > 4) setTucked(delta > 0)
  })

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const hidden = tucked && !menu && !mobileOpen

  return (
    <>
      <header
        data-solid={solid || undefined}
        data-menu-open={mobileOpen || undefined}
        className={clsx(
          'site-header group/header ease-out-expo fixed inset-x-0 top-0 z-50 transition-transform duration-500',
          hidden && '-translate-y-full',
        )}
      >
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-data-solid/header:opacity-100',
            // Over the open mobile sheet the bar stays clear so the sheet reads as one surface.
            !mobileOpen &&
              'border-b border-(--hdr-border) bg-(--hdr-glass) backdrop-blur-xl backdrop-saturate-150',
          )}
        />
        <div
          ref={boundsRef}
          className="container-site relative grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center"
        >
          <a
            href={localePath(locale, '/')}
            aria-label={ui.HEADER.home}
            className="justify-self-start rounded-full transition-transform duration-200 ease-out active:scale-[0.96]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/brand/filecoin-mark.svg"
              alt=""
              width={41.7881}
              height={41.7881}
              className="size-[41.7881px]"
            />
          </a>

          <nav aria-label={ui.HEADER.primary} className="hidden lg:block">
            <DesktopNav
              menus={menus}
              active={menu}
              boundsRef={boundsRef}
              onActiveChange={setMenu}
            />
          </nav>

          <div className="col-start-3 flex items-center justify-self-end">
            <LanguageSwitch locale={locale} className="hidden lg:flex" />
            <div className="-mr-2 lg:hidden">
              <MenuToggle
                locale={locale}
                open={mobileOpen}
                onToggle={() => setMobileOpen((open) => !open)}
              />
            </div>
          </div>
        </div>
      </header>
      <MobileNav
        locale={locale}
        open={mobileOpen}
        menus={menus}
        onClose={closeMobile}
      />
    </>
  )
}
