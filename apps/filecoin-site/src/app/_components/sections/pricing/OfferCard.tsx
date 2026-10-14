import type { CSSProperties } from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { CheckIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'

import type { Offer } from '@/data/pricing'

import ButtonLink from '@/components/ui/ButtonLink'
import Reveal from '@/components/ui/Reveal'

// Sized like the site's other cards: the name at the card-title size (h4), these labels a step
// below it, and body text at the shared 1.15 line height.
const LABEL =
  'font-heading text-lead leading-[1.15] font-book tracking-[-0.02em] text-ink'
const TEXT = 'text-body leading-[1.15] tracking-[-0.02em] text-ink/64'

/**
 * One storage offering as a card: name and a line on who it is for, the price, "Best for",
 * what is included, and the call to action. On its own (`as="div"`, the default) it is capped
 * at 40rem. In a grid pass `as="li"` and a `delay`: from `lg` the card then shares the grid's
 * rows (subgrid), so every card's price, audience and features sit at the same height.
 */
export default function OfferCard({
  offer,
  as = 'div',
  delay = 0,
  className,
  locale = 'en',
}: {
  offer: Offer
  as?: 'div' | 'li'
  delay?: number
  className?: string
  locale?: Locale
}) {
  const { LABELS } = copy(locale).ui
  const headingId = `offer-${offer.name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-')}`
  const inRow = as === 'li'
  // The card's six rows (name, price, audience, features, a spacer, the button); in a row of cards
  // each shares the grid's rows, so it lines up with its neighbours'.
  const subgrid =
    inRow &&
    'lg:grid lg:grid-rows-subgrid lg:row-span-6 lg:gap-y-[clamp(1.5rem,1.148rem+1.502vw,2rem)]'
  return (
    <Reveal
      as={as}
      delay={delay}
      amount={0.2}
      className={clsx(inRow ? subgrid : 'max-w-[40rem]', className)}
    >
      <article
        aria-labelledby={headingId}
        className={clsx(
          'bg-paper/40 flex h-full flex-col gap-y-[clamp(1.5rem,1.148rem+1.502vw,2rem)] rounded-3xl p-[clamp(1.5rem,1.148rem+1.502vw,2.5rem)] shadow-[0_2px_8px_rgb(0_0_0/0.12)]',
          subgrid,
        )}
      >
        <header>
          <h3
            id={headingId}
            className="font-heading text-h4 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {offer.name}
          </h3>
          <p className={`mt-2 text-pretty ${TEXT}`}>{offer.body}</p>
        </header>

        <div className="border-ink/10 border-t pt-[clamp(1.25rem,1.074rem+0.751vw,1.75rem)]">
          <p className="text-small text-ink/64 leading-[1.15] tracking-[-0.01em]">
            {offer.price.from}
          </p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="font-heading font-book text-ink text-[clamp(2rem,1.648rem+1.502vw,2.75rem)] leading-none tracking-[-0.02em]">
              {offer.price.amount}
            </span>
            <span className={TEXT}>{offer.price.unit}</span>
          </p>
          {offer.price.note && (
            <p className={`mt-2 text-pretty ${TEXT}`}>{offer.price.note}</p>
          )}
        </div>

        <div>
          <h4 className={LABEL}>{LABELS.bestFor}</h4>
          <p className={`mt-2 text-pretty ${TEXT}`}>{offer.bestFor}</p>
        </div>

        <div>
          <h4 className={LABEL}>{LABELS.included}</h4>
          <ul className="mt-3 flex flex-col gap-[clamp(0.75rem,0.662rem+0.376vw,1rem)]">
            {offer.features.map((feature, i) => (
              <li key={feature} className={`flex gap-1 text-pretty ${TEXT}`}>
                <CheckIcon
                  aria-hidden="true"
                  className="plan-tick text-ink size-6 shrink-0 -translate-y-px"
                  style={
                    { '--d': `${delay + 250 + i * 110}ms` } as CSSProperties
                  }
                />
                <span className="pt-0.5">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* An empty row keeps the button on the last shared row even when a card has less text. */}
        <div aria-hidden="true" className="hidden lg:block" />

        <div className="mt-auto">
          <ButtonLink
            href={offer.cta.href}
            data-foc-cta={offer.cta.ref}
            variant="ink"
          >
            {offer.cta.label}
          </ButtonLink>
        </div>
      </article>
    </Reveal>
  )
}
