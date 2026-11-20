import SectionIntro from '@/components/sections/product/SectionIntro'
import Reveal from '@/components/ui/Reveal'

export type HowStep = { title: string; body: string }

type HowStepsProps = {
  id: string
  sectionId?: string
  title: string
  body?: string
  steps: HowStep[]
}

/**
 * A numbered "How it works" row on white: the section intro, then one card per step. Four across
 * from `lg`, two from `sm`, stacked on phones. `sectionId` lets the hero's button jump here.
 */
export default function HowSteps({
  id,
  sectionId,
  title,
  body,
  steps,
}: HowStepsProps) {
  return (
    <section
      id={sectionId}
      aria-labelledby={id}
      className="py-section bg-white"
    >
      <div className="container-site">
        <SectionIntro id={id} title={title} body={body} />
        <ol className="mt-[clamp(2rem,1.648rem+1.502vw,3rem)] grid grid-cols-1 gap-[clamp(1rem,0.736rem+1.127vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 80} amount={0.3}>
              <article className="bg-paper flex h-full flex-col rounded-3xl p-[clamp(1.25rem,1.074rem+0.751vw,1.75rem)]">
                <span
                  aria-hidden="true"
                  className="bg-brand font-heading text-body font-book grid size-10 place-items-center rounded-full text-white"
                >
                  {i + 1}
                </span>
                <h3 className="font-heading text-h4 font-book text-ink mt-[clamp(1.5rem,1.148rem+1.502vw,2.5rem)] leading-[1.15] tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="text-body text-ink/64 mt-2 leading-[1.15] tracking-[-0.02em] text-pretty">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
