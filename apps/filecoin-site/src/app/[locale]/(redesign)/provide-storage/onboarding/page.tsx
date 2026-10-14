import type { CSSProperties } from 'react'

import { copy } from '@/i18n/copy'
import { toLocale } from '@/i18n/locales'
import { pageMetadata } from '@/i18n/metadata'
import type { UnsanitizedLocaleParams } from '@/i18n/types'

import type { Metadata, Viewport } from 'next'

import { StructuredDataScript } from '@filecoin-foundation/ui/StructuredDataScript'

import { PATHS } from '@/constants/paths'

import { pageSeo } from '@/data/seo'

import { generateRedesignStructuredData } from '@/utils/generateRedesignStructuredData'

import ProviderForm from '@/components/sections/provide-storage/ProviderForm'
import ArrowLink from '@/components/ui/ArrowLink'

type ProviderOnboardingPageProps = {
  params: Promise<UnsanitizedLocaleParams>
}

export const viewport: Viewport = {
  themeColor: '#f2f2f2',
  colorScheme: 'light',
}

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

/**
 * The storage provider intake form: the heading and intro on the left with links to the
 * self-service docs, the form in a card on the right. Stacks below `lg`, where the copy leads
 * and the form follows.
 */
export default async function ProviderOnboardingPage({
  params,
}: ProviderOnboardingPageProps) {
  const locale = toLocale((await params).locale)
  const { PROVIDER_FORM, SELF_SERVICE } = copy(locale).providerForm

  return (
    <>
      <StructuredDataScript
        structuredData={generateRedesignStructuredData(
          locale,
          'PROVIDE_STORAGE_ONBOARDING',
        )}
      />
      {/* Opens on light grey, so the header takes its light tone (see globals.css). */}
      <main data-header-tone="light">
        <section
          aria-labelledby="provider-form-title"
          className="bg-paper pb-section-lg pt-[calc(var(--header-h)+clamp(2.5rem,2.148rem+1.502vw,3.5rem))]"
        >
          <div className="container-site grid grid-cols-1 gap-x-[clamp(3rem,0.887rem+9.014vw,9rem)] gap-y-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:items-start">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h1
                id="provider-form-title"
                className="font-heading text-h1 font-book text-ink leading-[1.15] tracking-[-0.02em] text-pretty"
              >
                {PROVIDER_FORM.title.map((line, i) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    <span
                      className="intro block text-balance"
                      style={delay(140 + i * 110)}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
              <p
                className="intro text-lead text-ink/64 mt-[clamp(1rem,0.824rem+0.751vw,1.5rem)] max-w-[34rem] leading-[1.15] tracking-[-0.02em] text-pretty"
                style={delay(480)}
              >
                {PROVIDER_FORM.body}
              </p>

              <div
                className="intro border-ink/12 mt-[clamp(2.5rem,2.148rem+1.502vw,3.5rem)] border-t pt-[clamp(1.5rem,1.324rem+0.751vw,2rem)]"
                style={delay(600)}
              >
                <h2 className="font-heading text-h4 font-book text-ink leading-[1.15] tracking-[-0.02em]">
                  {SELF_SERVICE.title}
                </h2>
                <ul className="mt-5 flex flex-col gap-5">
                  {SELF_SERVICE.links.map((link) => (
                    <li key={link.href} className="max-w-[30rem]">
                      <ArrowLink href={link.href} label={link.label} />
                      <p className="text-body text-ink/56 mt-1 leading-[1.3] tracking-[-0.01em] text-pretty">
                        {link.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ProviderForm locale={locale} />
          </div>
        </section>
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: ProviderOnboardingPageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(
    locale,
    PATHS.PROVIDE_STORAGE_ONBOARDING.path,
    pageSeo(locale).PROVIDE_STORAGE_ONBOARDING,
  )
}
