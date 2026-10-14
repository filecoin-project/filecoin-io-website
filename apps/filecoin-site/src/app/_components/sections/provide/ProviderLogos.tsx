import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import clsx from 'clsx'

import type { ProviderLogo } from '@/data/provide-storage'

import Reveal from '@/components/ui/Reveal'

function Logos({ copy, logos }: { copy?: boolean; logos: ProviderLogo[] }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className={clsx(
        'flex shrink-0 items-center gap-16 pr-16',
        copy
          ? 'motion-reduce:hidden lg:hidden'
          : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-6 motion-reduce:pr-0 lg:w-full lg:justify-between lg:gap-0 lg:pr-0',
      )}
    >
      {logos.map((logo: ProviderLogo) => (
        <li key={logo.name} className="grid h-10 shrink-0 place-items-center">
          <a
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${logo.name} website`}
            tabIndex={copy ? -1 : undefined}
            className="block rounded-sm opacity-80 transition-[opacity,filter] duration-300 ease-out hover:opacity-100 hover:brightness-150"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              decoding="async"
              style={{ width: logo.width * 0.8, height: logo.height * 0.8 }}
              className="block max-w-none"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * "Join a global network of storage providers": the provider logos under the hero. A static row
 * on desktop; below that the row cannot fit, so it becomes a slow marquee with faded edges.
 */
export default function ProviderLogos({ locale = 'en' }: { locale?: Locale }) {
  const { PROVIDERS } = copy(locale).provideStorage
  return (
    <section
      aria-labelledby="providers-title"
      className="bg-carbon py-[clamp(3rem,2.472rem+2.254vw,4.5rem)]"
    >
      <div className="container-site flex flex-col items-center gap-[clamp(2rem,1.648rem+1.502vw,3rem)]">
        <Reveal>
          <h2
            id="providers-title"
            className="text-body text-center leading-[1.15] tracking-[-0.02em] text-white"
          >
            {PROVIDERS.title}
          </h2>
        </Reveal>
        <Reveal
          delay={80}
          className="w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] motion-reduce:mask-none lg:overflow-visible lg:mask-none"
        >
          <div className="animate-marquee flex w-max [--marquee-duration:34s] hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none lg:w-full lg:animate-none">
            <Logos logos={PROVIDERS.logos} />
            <Logos copy logos={PROVIDERS.logos} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
