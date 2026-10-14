import ButtonLink from '@/components/ui/ButtonLink'
import Reveal from '@/components/ui/Reveal'

type Action = { label: string; href: string; ref?: string }

/**
 * A centred call to action on the dark carbon: a heading, an optional line of copy, and one or
 * two buttons. Used as a product page's sign-off and for asides like "Moving a big IPFS archive?".
 */
export default function ClosingCta({
  id,
  sectionId,
  title,
  body,
  primary,
  secondary,
}: {
  id: string
  /** An anchor for the section itself, so other links can jump to it. */
  sectionId?: string
  /** The designed lines: each starts on its own line and wraps on its own where it doesn't fit. */
  title: readonly string[]
  body?: string
  primary: Action
  secondary?: Action
}) {
  return (
    <section
      id={sectionId}
      aria-labelledby={id}
      className="bg-carbon py-[clamp(4.5rem,4.148rem+1.502vw,6rem)] text-center"
    >
      <div className="container-site flex flex-col items-center">
        <Reveal>
          <h2
            id={id}
            className="font-heading text-h2 font-book max-w-[49rem] leading-[1.15] tracking-[-0.02em] text-pretty text-white"
          >
            {title.map((line, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className="block text-balance">{line}</span>
              </span>
            ))}
          </h2>
          {body && (
            <p className="text-lead mx-auto mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[52rem] leading-[1.15] tracking-[-0.02em] text-pretty text-white/64">
              {body}
            </p>
          )}
        </Reveal>
        <Reveal
          delay={90}
          className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)] flex flex-wrap justify-center gap-[clamp(0.75rem,0.486rem+1.127vw,1.5rem)]"
        >
          <ButtonLink
            href={primary.href}
            data-foc-cta={primary.ref}
            variant="white"
          >
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink
              href={secondary.href}
              data-foc-cta={secondary.ref}
              variant="secondary"
            >
              {secondary.label}
            </ButtonLink>
          )}
        </Reveal>
      </div>
    </section>
  )
}
