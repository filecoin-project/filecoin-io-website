import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import type { Feature } from '@/data/home'

import Reveal from '@/components/ui/Reveal'

/**
 * "You can do a whole lot more": three columns of products on desktop, two on tablets, one on
 * phones. Other pages pass their own title and items (the Provide Storage page's PDP grid).
 */
export default function MoreFeatures({
  id = 'more-features-title',
  title,
  items,
  locale = 'en',
}: {
  id?: string
  title?: string
  items?: Feature[]
  locale?: Locale
} = {}) {
  const { MORE_FEATURES } = copy(locale).home
  title ??= MORE_FEATURES.title
  items ??= MORE_FEATURES.items
  return (
    <section aria-labelledby={id} className="bg-paper pt-section pb-section-lg">
      <div className="container-site">
        <Reveal>
          <h2
            id={id}
            className="font-heading text-h2 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {title}
          </h2>
        </Reveal>
        <ul className="mt-head grid grid-cols-1 gap-x-10 gap-y-[clamp(2.25rem,2.074rem+0.751vw,2.75rem)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            // Stagger across the row, then a little more per row.
            <Reveal
              key={item.title}
              as="li"
              delay={(i % 3) * 70 + Math.floor(i / 3) * 90}
            >
              <h3 className="font-heading text-lead font-book text-ink flex items-center gap-2 leading-[1.15] tracking-[-0.02em]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0"
                />
                {item.title}
              </h3>
              <p className="text-body text-ink/64 mt-[clamp(0.75rem,0.662rem+0.376vw,1rem)] max-w-[25rem] leading-[1.15] tracking-[-0.02em] text-pretty">
                {item.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
