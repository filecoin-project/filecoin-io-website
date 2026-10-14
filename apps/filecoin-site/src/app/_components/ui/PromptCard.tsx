import CopyButton, { type CopyLabels } from '@/components/ui/CopyButton'

/**
 * A prompt to hand to an agent, as a small terminal-like figure: a header with a "Prompt" label
 * and a Copy pill, then the prompt's lines in monospace with a caret blinking after the last.
 * The homepage's Get Started section and the Warm Storage page's Agents example share it.
 */
export default function PromptCard({
  label,
  lines,
  className,
  showCopyButton = true,
  copyLabels,
}: {
  label: string
  lines: readonly string[]
  className?: string
  showCopyButton?: boolean
  /** The Copy pill's labels, for another language. */
  copyLabels?: CopyLabels
}) {
  const last = lines.length - 1
  return (
    <figure
      className={`bg-paper w-full rounded-xl border border-[#e6e6e6] ${className ?? ''}`}
    >
      <figcaption className="flex h-[clamp(2.75rem,2.662rem+0.376vw,3rem)] items-center justify-between gap-4 border-b border-[#e6e6e6] pr-[clamp(0.625rem,0.537rem+0.376vw,0.875rem)] pl-[clamp(1rem,0.912rem+0.376vw,1.25rem)]">
        <span className="flex items-center gap-1.5 font-mono text-[clamp(0.8125rem,0.791rem+0.094vw,0.875rem)] leading-none text-[#7a7a7a] uppercase">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/icons/start/terminal.svg"
            alt=""
            width={14}
            height={13}
            className="h-auto w-3.5"
          />
          {label}
        </span>
        {showCopyButton && (
          <CopyButton
            text={lines.join('\n')}
            label={copyLabels?.prompt ?? 'Copy prompt'}
            labels={copyLabels}
          />
        )}
      </figcaption>
      <div className="text-ink px-[clamp(1rem,0.912rem+0.376vw,1.25rem)] pt-[clamp(1.125rem,0.993rem+0.563vw,1.5rem)] pb-[clamp(1.25rem,1.118rem+0.563vw,1.625rem)] font-mono text-[clamp(0.8125rem,0.791rem+0.094vw,0.875rem)] leading-[1.15] tracking-[-0.02em]">
        {lines.map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2 text-pretty' : 'text-pretty'}>
            {line}
            {i === last && <span aria-hidden="true" className="prompt-caret" />}
          </p>
        ))}
      </div>
    </figure>
  )
}
