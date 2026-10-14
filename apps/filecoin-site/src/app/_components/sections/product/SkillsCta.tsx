import type { Locale } from '@/i18n/locales'

import { AgentsStrip } from '@/components/sections/home/WorksWithAgents'
import ButtonLink from '@/components/ui/ButtonLink'
import Reveal from '@/components/ui/Reveal'

/** Four entry points on carbon dark, followed by the existing agent logo strip. */
export default function SkillsCta({
  id,
  title,
  body,
  options,
  locale = 'en',
}: {
  id: string
  locale?: Locale
  title: string
  body: string
  options: readonly {
    title: string
    body: string
    code?: string
    badge?: string
    link?: { label: string; href: string; ref?: string }
  }[]
}) {
  return (
    <section
      aria-labelledby={id}
      className="bg-carbon pt-section overflow-hidden pb-[clamp(4rem,2.944rem+4.507vw,7rem)] selection:bg-white/20 selection:text-white"
    >
      <div className="container-site">
        <Reveal className="text-center">
          <h2
            id={id}
            className="font-heading text-h2 font-book leading-[1.15] tracking-[-0.02em] text-balance text-white"
          >
            {title}
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-[32rem] leading-[1.15] tracking-[-0.02em] text-white/64">
            {body}
          </p>
        </Reveal>
        <Reveal delay={90} className="mt-[clamp(2rem,1.648rem+1.502vw,3rem)]">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <li
                key={option.title}
                className="flex min-w-0 flex-col border-t border-white/20 px-6 py-8 sm:last:border-r-0 sm:odd:border-r lg:border-r lg:last:border-r-0"
              >
                <h3 className="font-heading text-h4 font-book leading-[1.15] tracking-[-0.02em] text-white">
                  {option.title}
                </h3>
                <p className="text-body mt-4 leading-[1.4] tracking-[-0.02em] text-pretty text-white/64">
                  {option.body}
                </p>
                <div className="mt-auto pt-6">
                  {option.code && (
                    <code className="mb-6 block font-mono text-sm leading-relaxed [overflow-wrap:anywhere] text-white/80">
                      {option.code}
                    </code>
                  )}
                  {option.badge && (
                    <span className="inline-block rounded-full border border-white/20 px-3 py-2 font-mono text-xs tracking-[0.06em] text-white/64">
                      {option.badge}
                    </span>
                  )}
                  {option.link && (
                    <ButtonLink
                      href={option.link.href}
                      data-foc-cta={option.link.ref}
                      variant="white"
                    >
                      {option.link.label}
                    </ButtonLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <div className="mt-[clamp(4rem,2.944rem+4.507vw,7rem)]">
        <AgentsStrip
          locale={locale}
          headingId={`${id}-agents`}
          as="h3"
          tone="dark"
        />
      </div>
    </section>
  )
}
