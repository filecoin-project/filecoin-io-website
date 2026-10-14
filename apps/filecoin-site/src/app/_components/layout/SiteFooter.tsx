import type { ComponentType, SVGProps } from 'react'

import { copy } from '@/i18n/copy'
import { localePath, type Locale } from '@/i18n/locales'

import type { FooterLink, SocialNetwork } from '@/data/footer'

import { InertForm } from '@/components/InertForm'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BlueskyIcon,
  DiscordIcon,
  FilecoinWordmark,
  FoundationLogo,
  SlackIcon,
  TelegramIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/layout/FooterIcons'

const SOCIAL_ICONS: Record<
  SocialNetwork,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  slack: SlackIcon,
  discord: DiscordIcon,
  x: XIcon,
  bluesky: BlueskyIcon,
  telegram: TelegramIcon,
  youtube: YouTubeIcon,
}

function FooterAnchor({
  link,
  className,
}: {
  link: FooterLink
  className?: string
}) {
  return (
    <a
      href={link.href}
      data-foc-cta={link.ref}
      data-foc-nav={link.ref ? 'footer' : undefined}
      {...(link.external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={`group/link inline-flex items-center gap-1 rounded-sm text-sm leading-5 text-(--ftr-muted) transition-colors duration-200 ease-out hover:text-slate-50 ${className ?? ''}`}
    >
      {link.label}
      {link.external && (
        <ArrowUpRightIcon className="ease-out-quint size-4 shrink-0 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      )}
    </a>
  )
}

/**
 * Site footer: the current filecoin.io footer (wordmark, newsletter signup, social links, four
 * link columns, then the Foundation credit and legal links), rebuilt on the new build's tokens.
 * The newsletter form is not wired up yet, so it never submits.
 */
export default function SiteFooter({ locale = 'en' }: { locale?: Locale }) {
  const { FOOTER_FOUNDATION, FOOTER_GROUPS, FOOTER_LEGAL, FOOTER_SOCIAL } =
    copy(locale).footer
  const { FOOTER, HEADER } = copy(locale).ui
  return (
    <footer className="site-footer border-t border-(--ftr-edge) bg-(--ftr-bg) text-slate-50">
      <div className="container-site grid gap-[clamp(3.5rem,3.148rem+1.502vw,4.5rem)] py-[clamp(3.75rem,3.31rem+1.878vw,5rem)] xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:gap-x-24">
        <div className="flex flex-col gap-[clamp(2.5rem,2.06rem+1.878vw,3.75rem)]">
          <a
            href={localePath(locale, '/')}
            aria-label={HEADER.home}
            className="self-start rounded-sm"
          >
            <FilecoinWordmark className="h-8 w-auto" />
          </a>

          <InertForm className="max-w-[25rem]">
            <label
              htmlFor="footer-newsletter-email"
              className="block text-sm leading-5 font-medium"
            >
              {FOOTER.newsletter}
            </label>
            <div className="group/field relative mt-2">
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                placeholder={FOOTER.emailPlaceholder}
                autoComplete="email"
                className="focus-visible:border-brand w-full border-b border-slate-50/20 bg-transparent py-3 pr-12 text-base text-slate-50 transition-colors duration-200 ease-out outline-none placeholder:text-(--ftr-muted) hover:border-slate-50/40"
              />
              <button
                type="submit"
                aria-label={FOOTER.subscribe}
                className="group/submit text-brand absolute inset-y-0 right-0 grid w-12 place-items-center rounded-sm"
              >
                <ArrowRightIcon className="ease-out-quint size-5 transition-transform duration-300 group-focus-within/field:translate-x-0.5 group-hover/submit:translate-x-1" />
              </button>
            </div>
          </InertForm>

          <ul
            className="flex flex-wrap gap-[clamp(0.75rem,0.486rem+1.127vw,1.5rem)]"
            aria-label={FOOTER.social}
          >
            {FOOTER_SOCIAL.map(({ network, label, href }) => {
              const Icon = SOCIAL_ICONS[network]
              return (
                <li key={network}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={FOOTER.on(label)}
                    title={label}
                    className="grid size-10 place-items-center rounded-full border border-(--ftr-ring) text-slate-50 transition-[border-color,background-color,scale] duration-200 ease-out hover:border-(--ftr-ring-hover) hover:bg-white/6 active:scale-[0.94]"
                  >
                    <Icon className="size-5.5" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <nav
          aria-label={FOOTER.navigation}
          className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4"
        >
          {FOOTER_GROUPS.map((group) => {
            const id = `footer-${group.title.toLowerCase().replace(/\s+/g, '-')}`
            return (
              <div key={group.title}>
                <span id={id} className="block text-sm leading-5 font-medium">
                  {group.title}
                </span>
                <ul aria-labelledby={id} className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-slate-50/20">
        <div className="container-site flex flex-col-reverse items-center justify-between gap-8 py-[clamp(2.5rem,2.06rem+1.878vw,3.75rem)] sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-xs leading-4 text-white">
              {FOOTER.managedBy}
            </span>
            <a
              href={FOOTER_FOUNDATION.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={` `}
              className="rounded-sm text-white transition-opacity duration-200 ease-out hover:opacity-80"
            >
              <FoundationLogo className="h-6 w-auto" />
            </a>
          </div>
          <ul className="flex items-center gap-[clamp(2rem,1.296rem+3.005vw,4rem)]">
            {FOOTER_LEGAL.map((link) => (
              <li key={link.label}>
                <FooterAnchor link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
