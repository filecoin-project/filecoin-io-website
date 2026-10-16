import clsx from 'clsx'

import {
  opensInNewTab,
  type NavGroup,
  type NavLink,
  type NavSection,
} from '@/data/site-nav'

import { ArrowUpRightIcon } from '@/components/layout/FooterIcons'
import NavAnchor, { NavBadge } from '@/components/layout/NavAnchor'

function LinkContent({
  link,
  products = false,
}: {
  link: NavLink
  products?: boolean
}) {
  return (
    <>
      <span className="block">
        {link.label}
        {link.href && opensInNewTab(link.href) && (
          // Marks a link that opens another site in a new tab, as in the footer.
          <ArrowUpRightIcon className="ease-out-quint ml-1 inline-block size-3.5 shrink-0 align-[-0.125em] text-slate-400 transition-[color,translate] duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-white" />
        )}
        {link.badge && <NavBadge blue={products}>{link.badge}</NavBadge>}
      </span>
      {link.note && (
        <span
          className={clsx(
            products ? 'mt-1.5' : 'mt-0.5',
            'block text-[0.8125rem] leading-snug text-slate-400',
          )}
        >
          {link.note}
        </span>
      )}
    </>
  )
}

const LINK =
  'group/link -mx-2.5 block rounded-lg px-2.5 py-1.5 text-[0.9375rem] leading-snug text-slate-100 ' +
  'transition-colors duration-150 ease-out hover:bg-white/6 hover:text-white ' +
  'aria-disabled:cursor-default aria-disabled:text-slate-400 aria-disabled:hover:bg-transparent'

function Group({
  group,
  products = false,
  onNavigate,
  navGroup,
}: {
  group: NavGroup
  products?: boolean
  onNavigate?: () => void
  navGroup: string
}) {
  return (
    <div>
      {group.headingLink ? (
        <p className="mb-2">
          <NavAnchor
            link={group.headingLink}
            className={clsx(LINK, 'font-semibold')}
            navGroup={navGroup}
            onNavigate={onNavigate}
          >
            <LinkContent link={group.headingLink} />
          </NavAnchor>
        </p>
      ) : group.heading && products ? (
        <h3 className="mb-5 text-base font-bold text-slate-50">
          {group.heading}
        </h3>
      ) : group.heading ? (
        <p className="mb-2.5 text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">
          {group.heading}
        </p>
      ) : null}
      {group.links.length > 0 && (
        <ul className={products ? 'space-y-3' : 'space-y-0.5'}>
          {group.links.map((link) => (
            <li key={link.label}>
              <NavAnchor
                link={link}
                className={LINK}
                navGroup={navGroup}
                onNavigate={onNavigate}
              >
                <LinkContent link={link} products={products} />
              </NavAnchor>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** A menu's columns of link groups, shared by the desktop dropdown and the mobile sheet. */
export default function MenuColumns({
  section,
  layout,
  onNavigate,
}: {
  section: NavSection
  layout: 'row' | 'stack'
  onNavigate?: () => void
}) {
  const products = section.label === 'Products'
  return (
    <div
      className={clsx(
        products
          ? layout === 'row'
            ? 'flex gap-12 p-2'
            : 'grid gap-8 sm:grid-cols-2'
          : layout === 'row'
            ? 'flex gap-10'
            : 'grid gap-6 sm:grid-cols-2',
      )}
    >
      {section.columns.map((column, c) => (
        <div
          key={c}
          className={clsx(
            'space-y-6',
            layout === 'row' && (products ? 'w-64' : 'min-w-36'),
          )}
        >
          {column.map((group, g) => (
            <Group
              key={g}
              group={group}
              products={products}
              navGroup={section.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
      {section.aside && (
        <div
          className={clsx(layout === 'row' && 'border-l border-white/8 pl-10')}
        >
          <Group
            navGroup={section.id}
            group={{
              heading: section.aside.heading,
              links: [section.aside.link],
            }}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </div>
  )
}
