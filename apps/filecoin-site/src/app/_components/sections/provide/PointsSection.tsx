import type { ReactNode } from 'react'

import clsx from 'clsx'

import type { Point } from '@/data/provide-storage'

import PointIcon from '@/components/sections/provide/icons'
import Reveal from '@/components/ui/Reveal'

/**
 * A heading and intro on the left, then a row of points (ringed icon, title, line of copy) and
 * a centred row of pills, as the PDP and scaling sections on filecoin.io/provide-storage.
 * `tone` picks near-black with white text or white with dark text.
 */
export default function PointsSection({
  id,
  tone,
  title,
  body,
  points,
  note,
  actions,
}: {
  id: string
  tone: 'dark' | 'light'
  title: string
  body: string
  points: Point[]
  /** A line above the pills. */
  note?: string
  actions: ReactNode
}) {
  const dark = tone === 'dark'
  const cols = points.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <section
      aria-labelledby={id}
      className={clsx(
        'py-section',
        dark ? 'bg-carbon text-white' : 'text-ink bg-white',
      )}
    >
      <div className="container-site">
        <Reveal>
          <h2
            id={id}
            className="font-heading text-h2 font-book leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {title}
          </h2>
          <p
            className={clsx(
              'text-lead mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[36rem] leading-[1.15] tracking-[-0.02em] text-pretty',
              dark ? 'text-white/80' : 'text-ink/72',
            )}
          >
            {body}
          </p>
        </Reveal>
        <ul
          className={clsx(
            'mt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] grid grid-cols-1 gap-x-10 gap-y-[clamp(2rem,1.648rem+1.502vw,3rem)] sm:grid-cols-2',
            cols,
          )}
        >
          {points.map((point, i) => (
            <Reveal key={point.title} as="li" delay={i * 80} amount={0.3}>
              <PointIcon name={point.icon} />
              <h3 className="font-heading font-book mt-[clamp(1.25rem,1.074rem+0.751vw,1.75rem)] max-w-[16rem] text-[clamp(1.0625rem,1.018rem+0.188vw,1.1875rem)] leading-[1.25] tracking-[-0.01em] text-balance">
                {point.title}
              </h3>
              <p
                className={clsx(
                  'mt-2 max-w-[18rem] text-[clamp(0.9375rem,0.894rem+0.188vw,1.0625rem)] leading-[1.4] tracking-[-0.01em] text-pretty',
                  dark ? 'text-white/64' : 'text-ink/64',
                )}
              >
                {point.body}
              </p>
            </Reveal>
          ))}
        </ul>
        <Reveal
          delay={120}
          className="mt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] flex flex-col items-center gap-5 text-center"
        >
          {note && (
            <p
              className={clsx(
                'text-body max-w-[36rem] leading-[1.15] tracking-[-0.02em] text-pretty',
                dark ? 'text-white/64' : 'text-ink/64',
              )}
            >
              {note}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-[clamp(0.75rem,0.486rem+1.127vw,1.5rem)]">
            {actions}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
