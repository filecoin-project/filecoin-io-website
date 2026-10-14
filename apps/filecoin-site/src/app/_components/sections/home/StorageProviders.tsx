import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { PROVIDER_LOCATIONS } from '@/data/globe'

import Globe from '@/components/sections/home/globe/Globe'
import ButtonLink from '@/components/ui/ButtonLink'
import Reveal from '@/components/ui/Reveal'

/**
 * "The world's data, stored by the world": storage provider call to action over a turning globe.
 * Other pages pass their own copy (the Provide Storage page sends its button to the quickstart).
 */
export default function StorageProviders({
  title,
  body,
  cta,
  locale = 'en',
}: {
  title?: string
  body?: string
  cta?: { label: string; href: string }
  locale?: Locale
} = {}) {
  const { STORAGE_PROVIDERS } = copy(locale).home
  const { LABELS } = copy(locale).ui
  title ??= STORAGE_PROVIDERS.title
  body ??= STORAGE_PROVIDERS.body
  cta ??= STORAGE_PROVIDERS.cta
  return (
    <section
      aria-labelledby="storage-providers-title"
      className="bg-carbon pt-section relative overflow-hidden text-center"
    >
      <div className="container-site flex flex-col items-center">
        <Reveal>
          <h2
            id="storage-providers-title"
            className="font-heading text-h2 font-book leading-[1.15] tracking-[-0.02em] text-balance text-white"
          >
            {title}
          </h2>
          <p className="text-lead mt-2 leading-[1.15] tracking-[-0.02em] text-pretty text-white/64">
            {body}
          </p>
        </Reveal>
        <Reveal
          delay={100}
          className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)]"
        >
          <ButtonLink href={cta.href} variant="primary">
            {cta.label}
          </ButtonLink>
        </Reveal>
      </div>
      <Reveal delay={180} className="mt-10">
        <Globe markers={PROVIDER_LOCATIONS} label={LABELS.globe} />
      </Reveal>
    </section>
  )
}
