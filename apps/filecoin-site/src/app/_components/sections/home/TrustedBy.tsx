import type { CSSProperties } from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import clsx from 'clsx'

import type { PartnerLogo } from '@/data/home'

function Logos({
  copy,
  logos,
  visit,
}: {
  copy?: boolean
  logos: PartnerLogo[]
  visit: (name: string) => string
}) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className={clsx(
        'flex shrink-0 items-center gap-14 pr-14',
        copy
          ? 'motion-reduce:hidden lg:hidden'
          : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-6 motion-reduce:pr-0 lg:w-full lg:justify-between lg:gap-0 lg:pr-0',
      )}
    >
      {logos.map((logo, i) => (
        <li
          key={logo.name}
          className="intro grid h-[2.0894rem] w-[6.9652rem] shrink-0 place-items-center"
          style={{ '--delay': `${820 + i * 60}ms` } as CSSProperties}
        >
          <a
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={visit(logo.name)}
            tabIndex={copy ? -1 : undefined}
            className="block rounded-sm opacity-90 transition-[opacity,filter] duration-300 ease-out hover:opacity-100 hover:brightness-150"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              decoding="async"
              style={{ width: logo.width, height: logo.height }}
              className="block max-w-none"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Partner logos under the hero. A static row on desktop as in the design; below that the row
 * cannot fit, so it becomes a slow marquee with faded edges.
 */
export default function TrustedBy({ locale = 'en' }: { locale?: Locale }) {
  const { TRUSTED_BY } = copy(locale).home
  const { LABELS } = copy(locale).ui
  return (
    <section
      aria-label={LABELS.trustedBy}
      className="relative bg-slate-950 pb-[clamp(4rem,3.296rem+3.005vw,6rem)]"
    >
      <div className="container-site flex flex-col items-center gap-[2.6851rem]">
        <div className="w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] motion-reduce:mask-none lg:max-w-[70.5rem] lg:overflow-visible lg:mask-none">
          <div className="animate-marquee flex w-max [--marquee-duration:34s] hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none lg:w-full lg:animate-none">
            <Logos logos={TRUSTED_BY.logos} visit={LABELS.visit} />
            <Logos copy logos={TRUSTED_BY.logos} visit={LABELS.visit} />
          </div>
        </div>
        <p
          className="intro-fade text-center text-[0.9141rem] leading-[1.4286] text-slate-400"
          style={{ '--delay': '1100ms' } as CSSProperties}
        >
          {TRUSTED_BY.caption}
        </p>
      </div>
    </section>
  )
}
