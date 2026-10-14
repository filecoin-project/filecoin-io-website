import type { CSSProperties } from 'react'

import { CheckIcon } from '@phosphor-icons/react/dist/ssr'

import type { StoragePlan } from '@/data/products/data-storage'

import SectionIntro from '@/components/sections/product/SectionIntro'
import PillLink from '@/components/ui/PillLink'
import Reveal from '@/components/ui/Reveal'

/**
 * Three option cards: a title, ticked points and a "Learn More" pill pinned to the bottom so the
 * pills line up across cards. Ticks pop in one after another as each card arrives.
 */
export default function StoragePlans({
  id,
  title,
  body,
  plans,
}: {
  id: string
  title: string
  body: string
  plans: StoragePlan[]
}) {
  return (
    <section aria-labelledby={id} className="py-section bg-white">
      <div className="container-site">
        <SectionIntro id={id} title={title} body={body} />
        <ul className="mt-[clamp(2rem,1.648rem+1.502vw,3rem)] grid grid-cols-1 gap-[clamp(1rem,0.472rem+2.254vw,2.5rem)] lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.title} as="li" delay={i * 90} amount={0.3}>
              <article className="bg-paper/40 flex h-full flex-col rounded-3xl p-[clamp(1.5rem,1.148rem+1.502vw,2.5rem)] shadow-[0_2px_8px_rgb(0_0_0/0.12)]">
                <h3 className="font-heading text-h4 font-book text-ink leading-[1.15] tracking-[-0.02em]">
                  {plan.title}
                </h3>
                <ul className="mt-[clamp(1.5rem,1.148rem+1.502vw,2.5rem)] mb-[clamp(2rem,1.824rem+0.751vw,2.5rem)] flex flex-col gap-[clamp(1rem,0.824rem+0.751vw,1.5rem)]">
                  {plan.points.map((point, p) => (
                    <li
                      key={point}
                      className="text-body text-ink/64 flex gap-1 leading-[1.15] tracking-[-0.02em] text-pretty"
                    >
                      <CheckIcon
                        aria-hidden="true"
                        className="plan-tick size-6 shrink-0 -translate-y-px"
                        style={
                          {
                            '--d': `${i * 90 + 250 + p * 110}ms`,
                          } as CSSProperties
                        }
                      />
                      <span className="pt-0.5">{point}</span>
                    </li>
                  ))}
                </ul>
                <PillLink
                  href={plan.link.href}
                  context={`about ${plan.title}`}
                  className="mt-auto self-start"
                >
                  {plan.link.label}
                </PillLink>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
