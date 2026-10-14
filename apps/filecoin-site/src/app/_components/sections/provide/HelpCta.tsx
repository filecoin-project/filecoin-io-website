import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import ButtonLink from '@/components/ui/ButtonLink'
import Reveal from '@/components/ui/Reveal'

/** "Need help choosing the right architecture?": left-aligned on near-black, one outlined pill. */
export default function HelpCta({ locale = 'en' }: { locale?: Locale }) {
  const { title, body, cta } = copy(locale).provideStorage.HELP
  return (
    <section
      aria-labelledby="help-title"
      className="bg-carbon py-[clamp(4.5rem,4.148rem+1.502vw,6rem)] text-white"
    >
      <div className="container-site">
        <Reveal>
          <h2
            id="help-title"
            className="font-heading text-h2 font-book leading-[1.15] tracking-[-0.02em] text-pretty"
          >
            {title.map((line, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className="block text-balance">{line}</span>
              </span>
            ))}
          </h2>
          <p className="text-lead mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[36rem] leading-[1.15] tracking-[-0.02em] text-pretty text-white/80">
            {body}
          </p>
        </Reveal>
        <Reveal delay={90} className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)]">
          <ButtonLink href={cta.href} variant="outline">
            {cta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
