'use client'

import { useState } from 'react'

import { XIcon } from '@phosphor-icons/react/dist/ssr'
import Cookies from 'js-cookie'

const COOKIE_EXPIRY_DAYS = 365

type NoticeBarProps = {
  text: string
  cookieName: string
}

/**
 * A dismissible bar along the bottom of the viewport (the header is fixed to the top). It
 * sticks while the page scrolls and comes to rest after the footer, so it never covers it.
 */
export function NoticeBar({ text, cookieName }: NoticeBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  function dismiss() {
    Cookies.set(cookieName, 'false', {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'Lax',
    })
    setVisible(false)
  }

  return (
    <div
      role="status"
      className="bg-brand sticky bottom-0 z-40 border-t border-white/10 text-white"
    >
      <div className="container-site flex items-center justify-between gap-4 py-3">
        <p className="text-small grow text-center leading-[1.4] text-balance">
          {text}
        </p>
        <button
          type="button"
          aria-label="关闭"
          className="-m-2 shrink-0 cursor-pointer rounded-full p-2 transition-colors duration-200 ease-out hover:bg-white/15"
          onClick={dismiss}
        >
          <XIcon size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
