import type { CSSProperties } from 'react'

import Image from 'next/image'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import ButtonLink from '@/components/ui/ButtonLink'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

/**
 * The Provide Storage hero, as on filecoin.io: copy and two pills on the left over near-black,
 * the nebula filling the right half (and the whole background on phones, faded under the copy).
 * Plays the same word-by-word CSS intro as the other heroes.
 */
export default function ProviderHero({ locale = 'en' }: { locale?: Locale }) {
  const { title, body, primary, secondary, image } =
    copy(locale).provideStorage.HERO
  let word = 0
  return (
    <section
      aria-labelledby="product-hero-title"
      className="bg-carbon relative flex min-h-[min(100svh,clamp(34rem,24.6rem+40vw,56.25rem))] items-center overflow-hidden pt-(--header-h) pb-[clamp(3rem,2.472rem+2.254vw,4.5rem)] text-white"
    >
      {/* The nebula: the right half from `lg`, the whole backdrop below that. */}
      <div
        className="intro-fade absolute inset-y-0 right-0 w-full lg:w-[55%]"
        style={delay(200)}
        aria-hidden="true"
      >
        <Image
          fill
          priority
          src={image.src}
          alt=""
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-center opacity-50 lg:opacity-100"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_0%,rgb(20_20_20/0.6)_30%,transparent_60%)] lg:bg-[linear-gradient(to_right,#141414_0%,transparent_35%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(to_bottom,transparent,#141414)]" />
      </div>
      <div className="container-site relative pt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] lg:pt-0">
        <div className="max-w-[44rem]">
          <h1
            id="product-hero-title"
            className="font-heading font-book max-w-[38rem] text-[clamp(2.25rem,1.72rem+2.254vw,3.75rem)] leading-[1.15] tracking-[-0.02em] text-pretty text-white"
          >
            {title.map((line, l) => (
              <span key={l}>
                {l > 0 && ' '}
                <span className="block text-balance">
                  {line.split(' ').map((w, i) => (
                    <span key={i}>
                      {i > 0 && ' '}
                      <span
                        className="intro inline-block"
                        style={delay(140 + word++ * 55)}
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="intro text-lead mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[34rem] leading-[1.15] tracking-[-0.02em] text-pretty text-white/64"
            style={delay(480)}
          >
            {body}
          </p>
          <div className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)] flex flex-wrap gap-[clamp(0.75rem,0.486rem+1.127vw,1.5rem)]">
            <ButtonLink
              href={primary.href}
              variant="outline"
              className="intro"
              style={delay(600)}
            >
              {primary.label}
            </ButtonLink>
            <ButtonLink
              href={secondary.href}
              variant="secondary"
              className="intro"
              style={delay(660)}
            >
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
      </div>
      <span className="sr-only">{image.alt}</span>
    </section>
  )
}
