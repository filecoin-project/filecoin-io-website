import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import ButtonLink from '@/components/ui/ButtonLink'
import CopyButton from '@/components/ui/CopyButton'
import PromptCard from '@/components/ui/PromptCard'
import Reveal from '@/components/ui/Reveal'
import SiteLink from '@/components/ui/SiteLink'

const STEP_TITLE =
  'font-heading text-h3 leading-[1.15] font-book tracking-[-0.02em] text-ink'
const CARD = 'mt-item overflow-hidden rounded-3xl bg-white'
/** Sits close under its step title (8 → 12px), like a card's subtext elsewhere; the card keeps the wider gap. */
const CAPTION =
  'mt-[clamp(0.5rem,0.412rem+0.376vw,0.75rem)] text-body leading-[1.15] tracking-[-0.02em] text-pretty text-ink/40'

/**
 * "Get started in two steps": the console on the left, a prompt to hand your agent on the right.
 * Side by side from `lg`, stacked below. Each card's contents rise in just after the card.
 */
export default function GetStarted({ locale = 'en' }: { locale?: Locale }) {
  const { title, account, prompt } = copy(locale).home.GET_STARTED
  const { LABELS, COPY_BUTTON } = copy(locale).ui
  return (
    <section
      id="get-started"
      aria-labelledby="get-started-title"
      className="bg-paper py-section"
    >
      <div className="container-site">
        <Reveal>
          <h2
            id="get-started-title"
            className="font-heading text-h2 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {title}
          </h2>
        </Reveal>

        <ol className="mt-[clamp(2rem,1.736rem+1.127vw,2.75rem)] grid grid-cols-1 gap-x-10 gap-y-[clamp(3rem,2.648rem+1.502vw,4rem)] lg:grid-cols-2">
          <Reveal as="li">
            <h3 className={STEP_TITLE}>{account.title}</h3>
            <p className={CAPTION}>{account.caption}</p>
            {/* The whole card opens the console; the title is the link's name, the picture stays described. */}
            <SiteLink
              href={account.href}
              aria-label={LABELS.inConsole(account.title)}
              className={`${CARD} group/card block aspect-[31/22] transition-[box-shadow,scale] duration-300 ease-out hover:shadow-[0_2px_12px_rgb(0_0_0/0.12)] active:scale-[0.99]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.image.src}
                alt={account.image.alt}
                width={account.image.width}
                height={account.image.height}
                loading="lazy"
                decoding="async"
                className="get-started-rise block h-auto w-full"
              />
            </SiteLink>
            <ButtonLink
              href={account.href}
              variant="ink"
              className="mt-item w-40"
            >
              {LABELS.createAccount}
            </ButtonLink>
          </Reveal>

          <Reveal as="li" delay={90}>
            <h3 className={STEP_TITLE}>{prompt.title}</h3>
            <p className={CAPTION}>{prompt.caption}</p>
            {/*
              Matches the console card's shape side by side. Stacked, it only needs room for the
              prompt, with the same margin on every side.
            */}
            <div
              className={`${CARD} flex items-center justify-center p-[clamp(1.5rem,0.972rem+2.254vw,3rem)] lg:aspect-[31/22] lg:p-[6.8%]`}
            >
              <PromptCard
                label={prompt.label}
                lines={prompt.lines}
                showCopyButton={false}
                className="get-started-rise"
              />
            </div>
            <CopyButton
              text={prompt.lines.join('\n')}
              label={COPY_BUTTON.prompt}
              idleLabel={COPY_BUTTON.prompt}
              labels={COPY_BUTTON}
              size="cta"
              className="mt-item w-40"
            />
          </Reveal>
        </ol>
      </div>
    </section>
  )
}
