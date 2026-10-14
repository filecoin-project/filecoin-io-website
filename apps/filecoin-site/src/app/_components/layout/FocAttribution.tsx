'use client'

import { useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'

import { usePlausible } from 'next-plausible'

import {
  decorate,
  firstTouch,
  labelProps,
  linkType,
  PRODUCT_PAGES,
  sitePath,
  type FirstTouch,
} from '@/utils/focAttribution'

const STORAGE_KEY = 'foc_ft'

function readTouch(): FirstTouch | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FirstTouch) : null
  } catch {
    return null
  }
}

function writeTouch(touch: FirstTouch) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(touch))
  } catch {
    // Storage blocked: the labels last for this page only.
  }
}

/**
 * The website side of the product funnel tracking, mounted once in each root layout:
 *
 * - On landing, works out the visit's first touch (utm_* or the referrer) and sends
 *   `journey_start` once per visit.
 * - On a funnel entry page (see `PRODUCT_PAGES`), sends `product_page_view`.
 * - On a click on any `a[data-foc-cta]`, sends `cta_click` with the link's foc_ref and the
 *   labels; a link to the docs or the Console first gets utm_* and foc_* parameters so the
 *   campaign arrives with the visitor.
 *
 * Labels only: no visitor ID is created, stored or sent.
 */
export function FocAttribution() {
  const pathname = usePathname()
  const plausible = usePlausible()
  const touchRef = useRef<FirstTouch | null>(null)

  // Landing: the first touch, kept for the visit.
  useEffect(() => {
    let touch = readTouch()
    if (!touch) {
      // A referral from our own docs or Console with nothing recorded counts as direct.
      touch =
        firstTouch(location.href, document.referrer) ??
        firstTouch(location.href, '')
      if (touch) {
        writeTouch(touch)
        plausible('journey_start', {
          props: { ...labelProps(touch), ref_domain: touch.ref_domain },
        })
      }
    }
    touchRef.current = touch
    // Once per page load; the labels do not change within it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Funnel entry pages.
  useEffect(() => {
    const product = PRODUCT_PAGES[sitePath(pathname)]
    if (product) {
      plausible('product_page_view', {
        props: { product, ...labelProps(touchRef.current) },
      })
    }
  }, [pathname, plausible])

  // Clicks on tracked links.
  useEffect(() => {
    function tracked(event: MouseEvent): [HTMLAnchorElement, string] | null {
      const anchor = (event.target as Element | null)?.closest?.(
        'a[data-foc-cta]',
      )
      const focRef =
        anchor instanceof HTMLAnchorElement ? anchor.dataset.focCta : undefined
      return anchor instanceof HTMLAnchorElement && focRef
        ? [anchor, focRef]
        : null
    }

    function onClick(event: MouseEvent) {
      if (event.button !== 0) return
      const hit = tracked(event)
      if (!hit) return
      const [anchor, focRef] = hit
      const touch = touchRef.current
      const type = linkType(anchor.getAttribute('href') ?? '', location.origin)
      if (type === 'decorate')
        anchor.href = decorate(anchor.href, focRef, touch)

      const props = {
        foc_ref: focRef,
        nav_group: anchor.dataset.focNav ?? 'in-page',
        link_type: type,
        hop_source: sitePath(location.pathname),
        ...labelProps(touch),
      }

      const leavesInThisTab =
        type === 'redirect' &&
        anchor.target !== '_blank' &&
        !event.defaultPrevented &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      if (!leavesInThisTab) {
        plausible('cta_click', { props })
        return
      }

      // A full page load would cut the request short: send first, then go.
      event.preventDefault()
      const href = anchor.href
      let gone = false
      const go = () => {
        if (gone) return
        gone = true
        location.assign(href)
      }
      plausible('cta_click', { props, callback: go })
      window.setTimeout(go, 400)
    }

    // Middle clicks open a new tab: decorate, no event.
    function onAuxClick(event: MouseEvent) {
      if (event.button !== 1) return
      const hit = tracked(event)
      if (!hit) return
      const [anchor, focRef] = hit
      if (
        linkType(anchor.getAttribute('href') ?? '', location.origin) ===
        'decorate'
      ) {
        anchor.href = decorate(anchor.href, focRef, touchRef.current)
      }
    }

    document.addEventListener('click', onClick)
    document.addEventListener('auxclick', onAuxClick)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('auxclick', onAuxClick)
    }
  }, [plausible])

  return null
}
