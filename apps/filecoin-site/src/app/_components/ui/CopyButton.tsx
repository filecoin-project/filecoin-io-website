'use client'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

type State = 'idle' | 'copied' | 'failed'

/** For browsers without the async clipboard API (or outside a secure context). */
function copyWithSelection(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.cssText =
    'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
  document.body.append(area)
  area.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    area.remove()
  }
}

export type CopyLabels = {
  idle: string
  copied: string
  failed: string
  copiedStatus: string
  failedStatus: string
  prompt: string
}

const ENGLISH: CopyLabels = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Failed',
  copiedStatus: 'Copied to clipboard',
  failedStatus: 'Could not copy. Select the text to copy it.',
  prompt: 'Copy prompt',
}
const STATES: State[] = ['idle', 'copied', 'failed']

/**
 * Small pill that copies `text` to the clipboard. The label swaps to "Copied" for a moment
 * (without changing the pill's width) and screen readers hear the result.
 */
export default function CopyButton({
  text,
  label,
  idleLabel,
  labels = ENGLISH,
  size = 'compact',
  className,
}: {
  text: string
  label: string
  idleLabel?: string
  /** The pill's labels and the screen reader statuses, for another language. */
  labels?: CopyLabels
  size?: 'compact' | 'cta'
  className?: string
}) {
  idleLabel ??= labels.idle
  const [state, setState] = useState<State>('idle')
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    let ok: boolean
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = copyWithSelection(text)
    }
    setState(ok ? 'copied' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2000)
  }

  const copied = state === 'copied'
  return (
    <>
      <button
        type="button"
        aria-label={label}
        className={clsx(
          'bg-brand inline-flex items-center gap-1.5 rounded-full text-white',
          size === 'cta'
            ? 'font-heading text-button font-book justify-center px-[clamp(1.25rem,1.162rem+0.376vw,1.5rem)] py-[clamp(0.875rem,0.831rem+0.188vw,1rem)] leading-[1.15] tracking-[-0.02em] whitespace-nowrap'
            : 'h-7 pr-3 pl-2.5 text-xs leading-none',
          'transition-[background-color,scale] duration-200 ease-out hover:bg-[#1a9bff] active:scale-[0.96]',
          className,
        )}
        onClick={copy}
      >
        <span className="relative size-3 shrink-0" aria-hidden="true">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className={clsx(
              'ease-out-quint absolute inset-0 transition-[opacity,scale] duration-300',
              copied && 'scale-50 opacity-0',
            )}
          >
            <rect
              x="3.9"
              y="3.9"
              width="7.5"
              height="7.5"
              rx="1.1"
              stroke="currentColor"
              strokeWidth=".9"
            />
            <path
              d="M1.9 8.1C1.3 8.1.6 7.6.6 7V1.8C.6 1.2 1.1.6 1.8.6H7c.6 0 1.1.5 1.1 1.2"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
            />
          </svg>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className={clsx(
              'ease-out-quint absolute inset-0 transition-[opacity,scale] duration-300',
              !copied && 'scale-50 opacity-0',
            )}
          >
            <path
              d="m2 6.4 2.6 2.5L10 3.3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {/* Every label sits in the same cell, so the pill keeps the widest one's width. */}
        <span className="grid" aria-hidden="true">
          {STATES.map((key) => (
            <span
              key={key}
              className={clsx(
                'ease-out-quint col-start-1 row-start-1 transition-[opacity,translate] duration-300',
                key !== state && 'translate-y-1 opacity-0',
              )}
            >
              {key === 'idle' ? idleLabel : labels[key]}
            </span>
          ))}
        </span>
      </button>
      <span className="sr-only" role="status">
        {state === 'copied'
          ? labels.copiedStatus
          : state === 'failed'
            ? labels.failedStatus
            : ''}
      </span>
    </>
  )
}
