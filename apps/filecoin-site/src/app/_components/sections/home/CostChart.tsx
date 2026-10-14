'use client'

import type { CSSProperties } from 'react'

import clsx from 'clsx'

import type { CostBar } from '@/data/home'

import { useRevealed } from '@/components/ui/Reveal'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

/**
 * Vertical bar chart: axes draw in, gridlines sweep across, then the bars grow from the
 * baseline in order. Motion is CSS transforms only (see `.cost-chart` in globals.css).
 */
export default function CostChart({
  bars,
  max,
  step,
  axisLabel,
  unit = 'TB',
  valueHeading = 'TB per $100',
  providerLabel = 'Provider',
}: {
  bars: CostBar[]
  max: number
  step: number
  axisLabel: string
  /** Read after each value in the screen reader summary, e.g. "TB". */
  unit?: string
  /** Column heading for the values in the screen reader table. */
  valueHeading?: string
  /** Column heading for the bars' names in that table. */
  providerLabel?: string
}) {
  const [ref, inView] = useRevealed<HTMLElement>(0.45)
  const ticks = Array.from(
    { length: Math.floor(max / step) + 1 },
    (_, i) => i * step,
  )
  const pct = (v: number) => `${(v / max) * 100}%`
  const name = (b: CostBar) => (b.note ? `${b.label} ${b.note}` : b.label)
  const summary = bars.map((b) => `${name(b)} ${b.value} ${unit}`).join(', ')

  return (
    <figure
      ref={ref}
      data-inview={inView || undefined}
      className="cost-chart w-full [--ticks:clamp(2.25rem,2.074rem+0.751vw,2.75rem)]"
    >
      <figcaption className="sr-only">
        {axisLabel}: {summary}.
      </figcaption>

      <div aria-hidden="true" className="flex items-stretch">
        {/* Y axis title, reading bottom to top */}
        <div
          className="chart-fade flex w-5 shrink-0 items-center justify-center"
          style={delay(200)}
        >
          <span className="text-small rotate-180 leading-none tracking-[-0.02em] whitespace-nowrap text-black [writing-mode:vertical-rl]">
            {axisLabel}
          </span>
        </div>

        {/* Tick labels, centred on their gridlines */}
        <div className="relative w-(--ticks) shrink-0">
          {ticks.map((t, i) => (
            <span
              key={t}
              className="chart-fade text-body text-carbon absolute right-[clamp(0.5rem,0.456rem+0.188vw,0.625rem)] translate-y-1/2 leading-none tracking-[-0.02em] tabular-nums"
              style={{ bottom: pct(t), ...delay(120 + i * 50) }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Plot */}
        <div className="relative h-[clamp(16rem,14.592rem+6.009vw,20rem)] min-w-0 flex-1">
          {ticks.slice(1).map((t, i) => (
            <span
              key={t}
              className="chart-grid absolute inset-x-0 h-px bg-black/10"
              style={{ bottom: pct(t), ...delay(100 + i * 60) }}
            />
          ))}
          <span className="chart-axis-y bg-carbon/64 absolute inset-y-0 left-0 w-px" />
          <span className="chart-axis-x bg-carbon/64 absolute inset-x-0 bottom-0 h-px" />

          <div className="absolute inset-x-0 top-0 bottom-px flex items-end">
            {bars.map((bar, i) => (
              <div
                key={name(bar)}
                className="flex h-full flex-1 items-end justify-center"
              >
                <span
                  style={{ height: pct(bar.value), ...delay(320 + i * 110) }}
                  className={clsx(
                    'chart-bar block w-[43%] max-w-[4.25rem]',
                    bar.highlight ? 'bg-brand' : 'bg-graphite',
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category labels, aligned under the bars */}
      <div
        aria-hidden="true"
        className="mt-3 flex pl-[calc(1.25rem+var(--ticks))]"
      >
        {bars.map((bar, i) => (
          <span
            key={name(bar)}
            className="chart-fade text-small flex-1 text-center leading-[1.15] tracking-[-0.02em] text-black"
            style={delay(420 + i * 110)}
          >
            {bar.label}
            {bar.note && (
              <span className="mt-1 block text-[0.75rem] text-black/40">
                {bar.note}
              </span>
            )}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{axisLabel}</caption>
        <thead>
          <tr>
            <th scope="col">{providerLabel}</th>
            <th scope="col">{valueHeading}</th>
          </tr>
        </thead>
        <tbody>
          {bars.map((bar) => (
            <tr key={name(bar)}>
              <th scope="row">{name(bar)}</th>
              <td>{bar.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
