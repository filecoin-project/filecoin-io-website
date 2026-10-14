import type { CSSProperties } from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import clsx from 'clsx'

import type { AgentLogo } from '@/data/home'

import Reveal from '@/components/ui/Reveal'

type Tone = 'light' | 'dark'

function Logos({
  copy,
  tone,
  logos,
  label,
}: {
  copy?: boolean
  tone: Tone
  logos: AgentLogo[]
  label: string
}) {
  return (
    <ul
      aria-hidden={copy || undefined}
      aria-label={copy ? undefined : label}
      className={clsx(
        'flex shrink-0 items-center gap-[calc(4*var(--logo))] pr-[calc(4*var(--logo))]',
        copy
          ? 'motion-reduce:hidden'
          : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:gap-x-10 motion-reduce:gap-y-6 motion-reduce:pr-0 xl:motion-reduce:justify-between',
      )}
    >
      {logos.map((logo) => (
        <li key={logo.name} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={copy ? '' : logo.name}
            width={logo.width}
            height={logo.height}
            decoding="async"
            loading="lazy"
            style={
              {
                '--w': logo.width / 16,
                '--h': logo.height / 16,
              } as CSSProperties
            }
            className={clsx(
              'block h-[calc(var(--h)*var(--logo))] w-[calc(var(--w)*var(--logo))] max-w-none',
              // The logo files are near-black; on dark sections they are drawn white.
              tone === 'dark' && 'brightness-0 invert',
            )}
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * "Works with all your agents": the heading beside a logo strip that keeps flowing. Two copies of
 * the list (the second hidden from assistive tech) make the loop seamless, and the strip fades
 * out at both ends. Reduced motion gets a still, wrapping row instead. Used as its own section on
 * the homepage and inside the Skills section (dark) on the Agents page.
 */
export function AgentsStrip({
  headingId,
  as: Heading = 'h2',
  tone = 'light',
  locale = 'en',
}: {
  headingId: string
  as?: 'h2' | 'h3'
  tone?: Tone
  locale?: Locale
}) {
  const { AGENTS } = copy(locale).home
  const { LABELS } = copy(locale).ui
  return (
    // `--logo` is the strip's unit (logo sizes and gaps): 9px on a phone up to 16px at 1440.
    <div className="container-site grid grid-cols-1 items-center gap-x-8 gap-y-8 [--logo:clamp(0.5625rem,0.4085rem+0.657vw,1rem)] motion-reduce:[--logo:clamp(0.5625rem,0.4525rem+0.4695vw,0.875rem)] lg:grid-cols-[13.5rem_minmax(0,1fr)]">
      <Reveal>
        <Heading
          id={headingId}
          className={clsx(
            'font-heading text-h3 font-book max-w-[13.5rem] leading-[1.15] tracking-[-0.02em] text-balance',
            tone === 'dark' ? 'text-white' : 'text-ink',
          )}
        >
          {AGENTS.title}
        </Heading>
      </Reveal>
      <Reveal delay={100} className="-mx-(--gutter) lg:mx-0 lg:-mr-(--gutter)">
        <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:mask-none lg:mask-[linear-gradient(to_right,transparent,black_18%,black_80%,transparent)] lg:motion-reduce:mask-none">
          <div className="animate-marquee flex w-max py-1 [--marquee-duration:36s] motion-reduce:w-full motion-reduce:animate-none motion-reduce:px-(--gutter) lg:motion-reduce:pr-(--gutter) lg:motion-reduce:pl-0">
            <Logos tone={tone} logos={AGENTS.logos} label={LABELS.agents} />
            <Logos
              copy
              tone={tone}
              logos={AGENTS.logos}
              label={LABELS.agents}
            />
          </div>
        </div>
      </Reveal>
    </div>
  )
}

export default function WorksWithAgents({
  locale = 'en',
}: {
  locale?: Locale
}) {
  return (
    <section
      aria-labelledby="agents-title"
      className="bg-paper overflow-hidden py-[clamp(3.5rem,2.708rem+3.38vw,5.75rem)]"
    >
      <AgentsStrip headingId="agents-title" locale={locale} />
    </section>
  )
}
