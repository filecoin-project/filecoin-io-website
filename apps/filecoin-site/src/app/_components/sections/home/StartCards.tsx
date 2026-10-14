import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import type { StartCard } from '@/data/home'

import Reveal from '@/components/ui/Reveal'
import SiteLink from '@/components/ui/SiteLink'

/**
 * Three ways in (docs, get started, talk to sales) as frosted cards. A card lifts on hover and
 * an arrow appears in its corner; the whole card is the link. Other pages pass their own `cards`
 * where a destination differs (e.g. "Get started" pointing back to the homepage's section).
 */
export default function StartCards({
  cards,
  locale = 'en',
}: { cards?: StartCard[]; locale?: Locale } = {}) {
  const { START_CARDS } = copy(locale).home
  const { title, body } = START_CARDS
  cards ??= START_CARDS.cards
  return (
    <section
      aria-labelledby="start-cards-title"
      className="bg-paper py-section"
    >
      <div className="container-site">
        <Reveal>
          <h2
            id="start-cards-title"
            className="font-heading text-h2 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {title}
          </h2>
          <p className="text-lead text-ink/64 mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[40rem] leading-[1.15] tracking-[-0.02em] text-pretty">
            {body}
          </p>
        </Reveal>

        <ul className="mt-[clamp(2.5rem,2.236rem+1.127vw,3.25rem)] grid grid-cols-1 gap-[clamp(1rem,0.472rem+2.254vw,2.5rem)] md:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.title} as="li" delay={i * 80} amount={0.3}>
              <SiteLink
                href={card.href}
                className="group/card ease-out-quint relative flex min-h-[clamp(10rem,8.239rem+7.512vw,15rem)] flex-col justify-between gap-10 rounded-3xl bg-linear-to-br from-white/70 to-white/35 p-6 shadow-[0_2px_6px_rgb(0_0_0/0.16)] ring-1 ring-white/70 transition-[translate,box-shadow,background-color] duration-300 ring-inset hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_36px_-12px_rgb(0_0_0/0.22)] active:translate-y-0 active:duration-150 motion-reduce:hover:translate-y-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="size-[clamp(2.5rem,1.972rem+2.254vw,4rem)]"
                />
                <span>
                  <span className="font-heading text-h4 font-book text-ink block leading-[1.15] tracking-[-0.02em]">
                    {card.title}
                  </span>
                  <span className="text-body text-ink/40 mt-2 block leading-[1.15] tracking-[-0.02em] text-pretty">
                    {card.body}
                  </span>
                </span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="text-ink/48 ease-out-quint absolute top-6 right-6 size-5 -translate-x-1 translate-y-1 opacity-0 transition-[opacity,translate] duration-300 group-hover/card:translate-0 group-hover/card:opacity-100"
                >
                  <path
                    d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SiteLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
