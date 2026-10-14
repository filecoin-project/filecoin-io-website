'use client'

import { useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import type { Icon } from '@phosphor-icons/react'
import {
  CodeIcon,
  DownloadSimpleIcon,
  PushPinIcon,
  RobotIcon,
  TerminalIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'
import { useInView } from 'motion/react'

import type { CodeExample } from '@/data/products/data-storage'

import PillLink from '@/components/ui/PillLink'
import PromptCard from '@/components/ui/PromptCard'

const ICONS: Record<CodeExample['icon'], Icon> = {
  upload: UploadSimpleIcon,
  download: DownloadSimpleIcon,
  pin: PushPinIcon,
  terminal: TerminalIcon,
  code: CodeIcon,
  robot: RobotIcon,
}

/**
 * Tabs down the left pick a snippet shown in the card on the right. A proper tab list: arrow
 * keys, Home and End move between tabs (and select them), and the panel is labelled by its tab.
 * Each newly picked snippet rises in.
 *
 * The tabs also step on by themselves. The active tab has a line beside it, on the heading's left
 * edge with the tabs indented past it (as in the homepage's "Store and serve" steps): a light
 * track that fills in ink from the top over 2.5s (CSS, see `.tab-progress`), and the next tab is
 * picked when it is full. It holds while the pointer is over the block, while a tab has keyboard
 * focus and while the block is off screen; picking a tab starts its line again. With reduced
 * motion the line is solid and the tabs don't step.
 */
export default function CodeExamples({
  id,
  examples,
  docs,
  locale = 'en',
}: {
  id: string
  examples: CodeExample[]
  docs: { label: string; href: string; ref?: string }
  locale?: Locale
}) {
  const { LABELS, COPY_BUTTON } = copy(locale).ui
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [keyboardFocus, setKeyboardFocus] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useInView(rootRef, { amount: 0.4 })
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const current = examples[active]
  const paused = hovered || keyboardFocus || !onScreen

  const advance = () => setActive((index) => (index + 1) % examples.length)
  const onFocus = (e: FocusEvent<HTMLDivElement>) =>
    setKeyboardFocus(e.target.matches(':focus-visible'))
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardFocus(false)
  }

  const select = (index: number) => {
    const next = (index + examples.length) % examples.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: examples.length - 1,
    }
    if (!(e.key in moves)) return
    e.preventDefault()
    select(moves[e.key])
  }

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 items-center gap-[clamp(2rem,1.296rem+3.005vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,37.5rem)]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        role="tablist"
        aria-label={LABELS.codeExamples}
        aria-orientation="vertical"
        // No gap: each tab carries half of it above and below, so the lines beside them are as
        // tall as a row and meet from one tab to the next.
        className="flex flex-col items-start"
      >
        {examples.map((example, i) => {
          const Glyph = ICONS[example.icon]
          const selected = i === active
          return (
            <button
              key={example.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${example.id}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              className={clsx(
                'font-heading font-book text-ink relative flex gap-[clamp(0.625rem,0.581rem+0.188vw,0.75rem)] rounded-md py-[clamp(0.4375rem,0.394rem+0.188vw,0.5625rem)] pl-[clamp(1.25rem,1.074rem+0.751vw,1.75rem)] text-left text-[clamp(1.125rem,1.037rem+0.376vw,1.375rem)] leading-[1.15] tracking-[-0.02em] transition-opacity duration-300 ease-out',
                // With a line of subtext the icon sits on the label's line, not between the two.
                example.body
                  ? 'items-start py-[clamp(0.625rem,0.537rem+0.376vw,0.875rem)]'
                  : 'items-center',
                selected ? 'opacity-100' : 'opacity-40 hover:opacity-70',
              )}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
            >
              {selected && (
                <span
                  aria-hidden="true"
                  className="bg-ink/16 absolute inset-y-0 left-0 w-0.5 overflow-hidden rounded-full"
                >
                  <span
                    // A new line for every tab change, so its fill starts from empty.
                    key={active}
                    className="tab-progress bg-ink block size-full rounded-full"
                    style={{
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                    onAnimationEnd={advance}
                  />
                </span>
              )}
              <Glyph
                weight="bold"
                aria-hidden="true"
                className="size-[clamp(1.375rem,1.287rem+0.376vw,1.625rem)] shrink-0"
              />
              {example.body ? (
                <span className="flex flex-col gap-1">
                  {example.label}
                  <span className="text-small text-ink/64 font-sans leading-[1.3] tracking-[-0.01em]">
                    {example.body}
                  </span>
                </span>
              ) : (
                example.label
              )}
            </button>
          )
        })}
      </div>

      {/*
        Every example sits in the same grid cell and only the picked one shows, so the card is
        always as tall as the tallest example (the agent prompt) and nothing below it moves when
        the tabs change. The others stay out of sight and out of reach (`invisible`, `inert`).
      */}
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${current.id}`}
        className="grid min-h-[clamp(14rem,13.472rem+2.254vw,15.5rem)] rounded-3xl bg-white/40 p-[clamp(1.5rem,1.236rem+1.127vw,2.25rem)] shadow-[0_2px_8px_rgb(0_0_0/0.12)]"
      >
        {examples.map((example, i) => {
          const shown = i === active
          return (
            <div
              key={example.id}
              aria-hidden={!shown || undefined}
              inert={!shown}
              className={clsx(
                'col-start-1 row-start-1 flex min-w-0 flex-col',
                !shown && 'invisible',
              )}
            >
              {/* `code-in` is only on the shown example, so each newly picked one rises in again. */}
              <pre
                className={clsx(
                  shown && 'code-in',
                  'text-ink font-sans text-[clamp(1.125rem,1.037rem+0.376vw,1.375rem)] leading-[1.15] tracking-[-0.02em] whitespace-pre-wrap',
                )}
              >
                {example.comment && (
                  <span className="text-ink/40 block">{example.comment}</span>
                )}
                {example.prompt ? (
                  <PromptCard
                    label={example.prompt.label}
                    lines={example.prompt.lines}
                    copyLabels={COPY_BUTTON}
                    className={clsx(
                      example.comment &&
                        'mt-[clamp(0.75rem,0.662rem+0.376vw,1rem)]',
                      'whitespace-normal',
                    )}
                  />
                ) : (
                  <code
                    className={clsx(
                      example.comment &&
                        'mt-[clamp(0.75rem,0.662rem+0.376vw,1rem)]',
                      'block max-w-[28rem] font-sans',
                    )}
                  >
                    {example.code.map((line, l) => (
                      <span key={l} className="block">
                        {line.map((run, r) => (
                          <span
                            key={r}
                            className={run.accent ? 'text-brand' : undefined}
                          >
                            {run.text}
                          </span>
                        ))}
                      </span>
                    ))}
                  </code>
                )}
              </pre>
              {!example.prompt && (
                <PillLink
                  href={(example.docs ?? docs).href}
                  focRef={(example.docs ?? docs).ref}
                  className="mt-auto self-end"
                >
                  {(example.docs ?? docs).label}
                </PillLink>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
