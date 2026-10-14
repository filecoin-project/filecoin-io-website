import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import clsx from 'clsx'

import type { CostBar } from '@/data/home'

import CostChart from '@/components/sections/home/CostChart'
import Reveal from '@/components/ui/Reveal'

type Comparison = {
  title: string
  body: string
  axisLabel: string
  max: number
  step: number
  bars: CostBar[]
  /** For screen readers: the unit after each value and the values' column heading. */
  unit?: string
  valueHeading?: string
}

/**
 * Split section: the claim on a dark panel that bleeds to the left edge of the viewport, the
 * chart on the light side (white on the homepage, light grey on product pages). Below `lg` the
 * two stack. Defaults to the homepage's storage comparison.
 */
export default function CostComparison({
  id = 'cost-comparison-title',
  data,
  tone = 'white',
  locale = 'en',
}: {
  id?: string
  data?: Comparison
  tone?: 'white' | 'paper'
  locale?: Locale
}) {
  const comparison: Comparison = data ?? copy(locale).home.COST_COMPARISON
  const { title, body, axisLabel, max, step, bars, unit, valueHeading } =
    comparison
  const providerLabel = copy(locale).ui.LABELS.chartProvider
  return (
    <section
      aria-labelledby={id}
      className={clsx(
        'relative overflow-hidden',
        tone === 'white' ? 'bg-white' : 'bg-paper',
      )}
    >
      {/* Dark panel: from the viewport's left edge to the end of the text column. */}
      <div
        aria-hidden="true"
        className="bg-carbon absolute inset-y-0 left-0 hidden w-[calc(max(var(--gutter),(100%-75rem)/2)+var(--panel))] lg:block"
      />
      <div className="container-site relative grid lg:grid-cols-[var(--panel)_minmax(0,1fr)]">
        <div className="bg-carbon py-section -mx-(--gutter) px-(--gutter) lg:mx-0 lg:bg-transparent lg:px-0 lg:pr-12">
          <Reveal>
            <h2
              id={id}
              className="font-heading text-h2 font-book max-w-[28.75rem] leading-[1.15] tracking-[-0.02em] text-balance text-white"
            >
              {title}
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="text-lead mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[28.25rem] leading-[1.15] tracking-[-0.02em] text-pretty text-white/64">
              {body}
            </p>
          </Reveal>
        </div>

        <div className="py-[clamp(3rem,2.296rem+3.005vw,5rem)] lg:pl-12">
          <CostChart
            providerLabel={providerLabel}
            bars={bars}
            max={max}
            step={step}
            axisLabel={axisLabel}
            unit={unit}
            valueHeading={valueHeading}
          />
        </div>
      </div>
    </section>
  )
}
