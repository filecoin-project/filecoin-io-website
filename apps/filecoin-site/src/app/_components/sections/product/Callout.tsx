import ButtonLink from '@/components/ui/ButtonLink'
import Reveal from '@/components/ui/Reveal'

/** A short left-aligned aside with one call to action, on white (e.g. "Training models on massive data?"). */
export default function Callout({
  id,
  title,
  body,
  cta,
}: {
  id: string
  title: string
  body: string
  cta: { label: string; href: string }
}) {
  return (
    <section
      aria-labelledby={id}
      className="bg-white py-[clamp(4.5rem,4.148rem+1.502vw,6rem)]"
    >
      <div className="container-site">
        <Reveal>
          <h2
            id={id}
            className="font-heading text-h2 font-book text-carbon leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {title}
          </h2>
          <p className="text-lead text-carbon/64 mt-4 max-w-[44rem] leading-[1.15] tracking-[-0.02em] text-pretty">
            {body}
          </p>
        </Reveal>
        <Reveal delay={90} className="mt-6">
          <ButtonLink href={cta.href} variant="ink">
            {cta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
