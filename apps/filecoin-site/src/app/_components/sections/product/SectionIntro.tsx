import clsx from 'clsx'

import Reveal from '@/components/ui/Reveal'

/**
 * A section's heading on the left with its intro on the right, the intro's last line level with
 * the heading's (Figma's two-column section header). Stacks below `lg`.
 */
export default function SectionIntro({
  id,
  title,
  body,
  align = 'left',
  tone = 'dark',
}: {
  id: string
  title: string
  /** Optional: without it the heading has the row to itself. */
  body?: string
  /** Right-aligns the intro text on wide screens. */
  align?: 'left' | 'right'
  /** Text colour: dark on light sections, light on dark ones. */
  tone?: 'dark' | 'light'
}) {
  return (
    <Reveal
      className={clsx(
        'grid grid-cols-1 gap-x-10 gap-y-[clamp(0.75rem,0.574rem+0.751vw,1.25rem)]',
        body &&
          'lg:grid-cols-[minmax(0,30rem)_minmax(0,35.25rem)] lg:items-end lg:justify-between',
      )}
    >
      <h2
        id={id}
        className={clsx(
          'font-heading text-h2 font-book leading-[1.15] tracking-[-0.02em] text-balance',
          tone === 'dark' ? 'text-ink' : 'text-white',
        )}
      >
        {title}
      </h2>
      {body && (
        <p
          className={clsx(
            'text-lead max-w-[35.25rem] leading-[1.15] tracking-[-0.02em] text-pretty lg:pb-[0.7em]',
            tone === 'dark' ? 'text-ink/64' : 'text-white/64',
            align === 'right' && 'lg:text-right',
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  )
}
