import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import Odometer from '@/components/ui/Odometer'
import Reveal from '@/components/ui/Reveal'

/** One headline figure, rolled in odometer style when it scrolls into view. */
export default function NetworkCapacity({
  locale = 'en',
}: {
  locale?: Locale
}) {
  const { title, value, decimals, unit, caption } =
    copy(locale).home.NETWORK_CAPACITY
  return (
    <section
      aria-labelledby="network-capacity-title"
      className="bg-paper py-[clamp(5rem,4.648rem+1.502vw,6rem)] text-center"
    >
      <div className="container-site flex flex-col items-center">
        <Reveal>
          <h2
            id="network-capacity-title"
            className="font-heading text-h3 font-book leading-[1.15] tracking-[-0.02em] text-balance text-slate-950"
          >
            {title}
          </h2>
        </Reveal>
        <Reveal delay={80} className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)]">
          {/*
            The figure stays the widest line in the section: 38px on phones up to 56px at 1440, but
            never wider than the column (the set figure is about 9.1em wide, so the column / 9.2).
          */}
          <p className="font-heading text-ink text-[min(clamp(2.375rem,1.979rem_+_1.69vw,3.5rem),(100vw_-_2_*_var(--gutter))_/_9.2)] font-[580] tracking-[-0.02em] whitespace-nowrap">
            <Odometer value={value} decimals={decimals} suffix={unit} />
          </p>
          <p className="text-lead text-ink/64 mt-[clamp(0.75rem,0.662rem+0.376vw,1rem)] leading-[1.15] tracking-[-0.02em]">
            {caption}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
