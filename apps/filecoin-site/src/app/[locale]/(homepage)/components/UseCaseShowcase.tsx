'use client'

import type { ComponentType, SVGProps } from 'react'

import Image, { type StaticImageData } from 'next/image'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useTranslations } from 'next-intl'

import { CTALink } from '@filecoin-foundation/ui-filecoin/CTALink'
import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'

import FlickrFoundationLogo from '@/assets/logos/flickr-foundation-icon-logo.svg'
import InternetArchiveLogo from '@/assets/logos/internet-archive-icon-logo.svg'
import starlingLabLogo from '@/assets/logos/starling-lab-icon-logo.png'
import AkaveLogo from '@/assets/miniatures/akave-miniature.svg'
import CIDgravityLogo from '@/assets/miniatures/cid-gravity-miniature.svg'
import LighthouseLogo from '@/assets/miniatures/lighthouse-miniature.svg'

import { type ProductKey, PRODUCTS } from '../data/products'

import { ProductPill } from './ProductPill'

type SvgLogo = { type: 'svg'; src: ComponentType<SVGProps<SVGSVGElement>> }
type ImageLogo = { type: 'image'; src: StaticImageData }

export type UseCaseId = keyof typeof LOGOS

export type UseCase = {
  id: UseCaseId
  name: string
  headline: string
  products: Array<ProductKey>
  quote: string
  attribution: string
  href: string
  image: { data: StaticImageData; alt: string }
}

type UseCaseShowcaseProps = {
  useCases: Array<UseCase>
}

const LOGO_SIZE = 28

// Resolved here rather than in data/useCases.ts: SVGR components are functions
// and cannot be serialised across the server → client boundary.
const LOGOS = {
  akave: { type: 'svg', src: AkaveLogo },
  cidgravity: { type: 'svg', src: CIDgravityLogo },
  'starling-lab': { type: 'image', src: starlingLabLogo },
  'flickr-foundation': { type: 'svg', src: FlickrFoundationLogo },
  'internet-archive': { type: 'svg', src: InternetArchiveLogo },
  lighthouse: { type: 'svg', src: LighthouseLogo },
} satisfies Record<string, SvgLogo | ImageLogo>

export function UseCaseShowcase({ useCases }: UseCaseShowcaseProps) {
  const t = useTranslations('/.useCases')
  const tProducts = useTranslations('/.products')

  return (
    <TabGroup className="overflow-hidden rounded-2xl border border-(--color-border-muted) bg-(--color-card-background)">
      <TabList
        aria-label={t('tabListLabel')}
        className="logo-section-scroll-bar flex overflow-x-auto border-b border-(--color-border-muted)"
      >
        {useCases.map(({ id, name }) => (
          <Tab
            key={id}
            className="group data-selected:border-brand-700 flex shrink-0 cursor-pointer items-center gap-3 border-b-2 border-transparent px-6 py-5 text-base font-medium text-(--color-paragraph-text) transition-colors hover:text-(--color-text-base) focus:outline-none data-focus:bg-zinc-50 data-selected:text-(--color-text-base)"
          >
            <UseCaseLogo id={id} name={name} />
            <span>{name}</span>
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {useCases.map(
          ({
            id,
            name,
            headline,
            products,
            quote,
            attribution,
            href,
            image,
          }) => (
            <TabPanel
              key={id}
              className="grid grid-cols-1 gap-10 p-8 focus:outline-none md:p-12 lg:grid-cols-2 lg:gap-16"
            >
              <div className="flex flex-col justify-between gap-12">
                <div className="space-y-8">
                  <Heading tag="h3" variant="section-heading">
                    {headline}
                  </Heading>

                  <div>
                    <p className="mb-3 text-sm font-medium text-(--color-paragraph-text-subtle) uppercase">
                      {t('productsUsedLabel')}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {products.map((productKey) => (
                        <li key={productKey}>
                          <ProductPill
                            label={tProducts(productKey)}
                            href={PRODUCTS[productKey].href}
                            icon={PRODUCTS[productKey].icon}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <blockquote className="border-brand-600 space-y-4 border-l-2 pl-5">
                    <p className="text-xl/7 text-pretty text-(--color-text-base)">
                      {quote}
                    </p>
                    <footer className="text-sm text-(--color-paragraph-text)">
                      {attribution}
                    </footer>
                  </blockquote>

                  <CTALink href={href}>{t('readMore', { name })}</CTALink>
                </div>
              </div>

              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-(--color-border-muted) lg:aspect-auto lg:min-h-100">
                <Image
                  fill
                  src={image.data}
                  alt={image.alt}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </TabPanel>
          ),
        )}
      </TabPanels>
    </TabGroup>
  )
}

function UseCaseLogo({ id, name }: Pick<UseCase, 'id' | 'name'>) {
  const logo: SvgLogo | ImageLogo = LOGOS[id]

  if (logo.type === 'svg') {
    const Svg = logo.src
    return (
      <Svg
        aria-hidden="true"
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        className="shrink-0 text-(--color-text-base)"
      />
    )
  }

  return (
    <Image
      src={logo.src}
      alt=""
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      className="shrink-0 rounded-full object-contain"
      aria-label={`${name} logo`}
    />
  )
}
