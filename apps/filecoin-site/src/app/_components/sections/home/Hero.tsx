'use client'

import { useRef, type CSSProperties } from 'react'

import Image from 'next/image'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import ButtonLink from '@/components/ui/ButtonLink'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

function Announcement({
  announcement,
}: {
  announcement: {
    badge: string
    label: string
    shortLabel: string
    href: string
  }
}) {
  const { badge, label, shortLabel, href } = announcement
  return (
    <a
      href={href}
      className="intro group/pill inline-flex max-w-full items-center rounded-full border border-slate-800 bg-slate-900 p-1 transition-[background-color,border-color,scale] duration-200 ease-out hover:border-slate-700 hover:bg-[#162036] active:scale-[0.98]"
      style={delay(80)}
    >
      {/*
        Every part scales with the viewport (phone to 1440), so the pill keeps its proportions. It
        stays one line: phones show the title's first sentence (cut short only on the narrowest
        screens), and the full title takes over from `sm`, where it fits.
      */}
      <span className="grid h-[clamp(1.625rem,1.4615rem+0.6977vw,2.0894rem)] shrink-0 place-items-center rounded-full bg-slate-300 px-[clamp(0.5625rem,0.4965rem+0.2817vw,0.75rem)] text-[clamp(0.6875rem,0.6537rem+0.1442vw,0.7835rem)] leading-none font-semibold tracking-[0.025em] text-slate-900 uppercase">
        {badge}
      </span>
      <span className="min-w-0 truncate px-[clamp(0.5rem,0.412rem+0.3756vw,0.75rem)] text-left text-[clamp(0.875rem,0.815rem+0.255vw,1.0447rem)] leading-[1.4] font-medium text-slate-50 sm:overflow-visible sm:text-balance sm:whitespace-normal">
        <span aria-hidden="true" className="sm:hidden">
          {shortLabel}
        </span>
        <span className="max-sm:sr-only">{label}</span>
      </span>
      <span className="grid size-[clamp(1.75rem,1.63rem+0.51vw,2.0894rem)] shrink-0 place-items-center rounded-full bg-slate-800 transition-colors duration-200 ease-out group-hover/pill:bg-slate-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/icons/arrow-right.svg"
          alt=""
          width={12.5368}
          height={10.4476}
          className="ease-out-quint h-auto w-[clamp(0.625rem,0.5692rem+0.2383vw,0.7836rem)] transition-transform duration-300 group-hover/pill:translate-x-0.5"
        />
      </span>
    </a>
  )
}

export default function Hero({ locale = 'en' }: { locale?: Locale }) {
  const { HERO } = copy(locale).home
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // The earth drifts slower than the page and the copy lifts away as the hero scrolls out.
  const earthY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', reduceMotion ? '0%' : '22%'],
  )
  const earthScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduceMotion ? 1 : 1.06],
  )
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -72],
  )
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    [1, reduceMotion ? 1 : 0],
  )

  // Words animate in one after another across both lines.
  let wordIndex = 0

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex flex-1 flex-col justify-center overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ y: earthY, scale: earthScale }}
      >
        <div className="intro-earth absolute inset-0">
          <Image
            fill
            preload
            src="/assets/images/hero-earth.jpg"
            alt=""
            fetchPriority="high"
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />
        </div>
      </motion.div>
      {/* Figma: 40% navy wash, then the lower half fades into the page colour. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(2_6_24/0)_0%,rgb(2_6_24/0)_50%,rgb(2_6_24/0.95)_92%,rgb(2_6_24)_100%),linear-gradient(rgb(2_6_24/0.4),rgb(2_6_24/0.4))]"
      />

      <motion.div
        className="container-site flex flex-col items-center pt-[calc(var(--header-h)+clamp(4.5rem,3.268rem+5.258vw,8rem))] pb-[clamp(5rem,3.944rem+4.507vw,8rem)] text-center"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <Announcement announcement={HERO.announcement} />

        <h1
          id="hero-title"
          className="font-heading text-h1 font-book mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)] max-w-[50rem] leading-[1.03] tracking-[-0.03em] text-balance text-slate-50"
        >
          {HERO.title.map((line, l) => (
            <span key={l}>
              {l > 0 && <br className="max-sm:hidden" />}
              {line.split(' ').map((word, i) => (
                <span key={i}>
                  {(l > 0 || i > 0) && ' '}
                  <span
                    className="intro inline-block"
                    style={delay(180 + wordIndex++ * 55)}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          className="intro text-lead mt-4 max-w-[50rem] leading-[1.46] text-balance text-slate-200"
          style={delay(520)}
        >
          {HERO.body}
        </p>

        <div className="mt-[clamp(2rem,1.824rem+0.751vw,2.5rem)] flex flex-wrap justify-center gap-[clamp(0.75rem,0.486rem+1.127vw,1.5rem)]">
          <ButtonLink
            href={HERO.primary.href}
            data-foc-cta={HERO.primary.ref}
            variant="primary"
            className="intro"
            style={delay(640)}
          >
            {HERO.primary.label}
          </ButtonLink>
          <ButtonLink
            href={HERO.secondary.href}
            data-foc-cta={HERO.secondary.ref}
            variant="secondary"
            className="intro"
            style={delay(700)}
          >
            {HERO.secondary.label}
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  )
}
