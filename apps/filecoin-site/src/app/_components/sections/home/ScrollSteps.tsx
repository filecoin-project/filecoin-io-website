'use client'

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { useLenis } from 'lenis/react'
import {
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react'

import ArrowLink from '@/components/ui/ArrowLink'
import Reveal from '@/components/ui/Reveal'

/** Matches the `pin` variant in globals.css: wide and tall enough to pin the section. */
const PIN_QUERY = '(min-width: 64rem) and (min-height: 40rem)'

function subscribePinned(onChange: () => void) {
  const query = window.matchMedia(PIN_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const usePinned = () =>
  useSyncExternalStore(
    subscribePinned,
    () => window.matchMedia(PIN_QUERY).matches,
    () => false,
  )

export type ScrollStep = {
  id: string
  title: string
  body: string
  art: ReactNode
  /** A link under the body, e.g. "Learn More" to the step's own page (`href: null` until it exists). */
  link?: { label: string; href: string | null }
}

/**
 * An illustration slot. Pinned, the current step's slot shows and plays while the section is on
 * screen; stacked, each slot plays when it scrolls into view.
 */
function ArtSlot({
  art,
  current,
  pinned,
  onScreen,
}: {
  art: ReactNode
  current: boolean
  pinned: boolean
  onScreen: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const playing = pinned ? current && onScreen : inView
  return (
    <div
      ref={ref}
      className="art-slot"
      aria-hidden={(pinned && !current) || undefined}
      data-current={current || undefined}
      data-active={playing || undefined}
    >
      {art}
    </div>
  )
}

/**
 * A section that pins while the reader scrolls through its steps (desktop), one step per stretch
 * of scrolling. The step list on the left follows along and each step's illustration plays on the
 * right; clicking a step title scrolls to it. Below the `pin` size the steps simply stack, each
 * with its illustration.
 */
export default function ScrollSteps({
  id,
  title,
  intro,
  steps,
}: {
  id: string
  title: readonly string[]
  intro: string
  steps: ScrollStep[]
}) {
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pinned = usePinned()
  const onScreen = useInView(stageRef, { amount: 0.35 })
  const lenis = useLenis()
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // One scroll value picks the open step and fills its line (0 to 1 through the step). The fill
  // is set on that step alone, so scrolling restyles only its line, not the whole section.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const index = Math.min(
      steps.length - 1,
      Math.max(0, Math.floor(progress * steps.length)),
    )
    const fraction = Math.min(1, Math.max(0, progress * steps.length - index))
    stepRefs.current[index]?.style.setProperty(
      '--step-progress',
      fraction.toFixed(4),
    )
    setActive(index)
  })

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current
      if (!track) return
      const top = track.getBoundingClientRect().top + window.scrollY
      const range = track.offsetHeight - window.innerHeight
      const target = top + range * ((index + 0.5) / steps.length)
      if (lenis)
        lenis.scrollTo(target, { duration: 1.1, immediate: !!reducedMotion })
      else
        window.scrollTo({
          top: target,
          behavior: reducedMotion ? 'instant' : 'smooth',
        })
    },
    [lenis, reducedMotion, steps.length],
  )

  const titleId = `${id}-title`

  return (
    <section
      ref={trackRef}
      id={id}
      aria-labelledby={titleId}
      className="scroll-steps relative bg-white"
      style={{ '--steps': steps.length } as CSSProperties}
    >
      <div ref={stageRef} className="scroll-steps-stage">
        <div
          className="scroll-steps-grid"
          style={
            {
              '--rows': steps.length + 1,
              '--areas': [
                '". art"',
                '"head art"',
                ...steps.map((_, i) => `"s${i} art"`),
                '". art"',
              ].join(' '),
            } as CSSProperties
          }
        >
          <Reveal className="scroll-steps-head">
            <h2
              id={titleId}
              className="font-heading text-h2 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance"
            >
              {title.map((line, i) => (
                <span key={i}>
                  {i > 0 && (
                    <>
                      <br className="max-sm:hidden" />
                      <span className="sm:hidden"> </span>
                    </>
                  )}
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-lead text-ink/64 mt-2 max-w-[28rem] leading-[1.15] tracking-[-0.02em] text-pretty">
              {intro}
            </p>
          </Reveal>

          {steps.map((step, i) => (
            <div key={step.id} className="contents">
              <div
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                className="scroll-step"
                data-active={i === active || undefined}
                data-link={step.link ? '' : undefined}
                style={{ gridArea: `s${i}` }}
              >
                <h3 className="font-heading text-h3 font-book text-ink leading-[1.15] tracking-[-0.02em]">
                  {pinned ? (
                    <button
                      type="button"
                      className="scroll-step-title text-left"
                      aria-current={i === active ? 'step' : undefined}
                      onClick={() => goTo(i)}
                    >
                      {step.title}
                    </button>
                  ) : (
                    <span className="scroll-step-title">{step.title}</span>
                  )}
                </h3>
                <div
                  className="scroll-step-body"
                  aria-hidden={(pinned && i !== active) || undefined}
                >
                  <div>
                    <p className="text-body text-ink/64 max-w-[27rem] pt-2 leading-[1.15] tracking-[-0.02em] text-pretty">
                      {step.body}
                    </p>
                    {step.link && (
                      <ArrowLink
                        href={step.link.href}
                        label={step.link.label}
                        context={`about ${step.title}`}
                        // A closed step's link is hidden while pinned, so keep it out of the tab order.
                        tabIndex={pinned && i !== active ? -1 : undefined}
                        className="mt-5"
                      />
                    )}
                  </div>
                </div>
              </div>
              <ArtSlot
                art={step.art}
                current={i === active}
                pinned={pinned}
                onScreen={onScreen}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
