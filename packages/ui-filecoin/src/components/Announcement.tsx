import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { clsx } from 'clsx'

import { BaseLink, type BaseLinkProps } from './BaseLink'
import { Icon } from './Icon'

export type AnnouncementProps = {
  href: BaseLinkProps['href']
  centered?: boolean
  badge?: string
  children: string
}

export function Announcement({
  centered,
  href,
  badge,
  children,
}: AnnouncementProps) {
  return (
    <div className={clsx('group flex', centered && 'justify-center')}>
      <BaseLink href={href} className="group focus:brand-outline rounded-full">
        <div className="gap relative flex items-center rounded-full border border-(--color-announcement-border) bg-(--color-announcement-background) p-1 group-hover:bg-(--color-announcement-background-hover) group-focus:bg-(--color-announcement-background-hover)">
          {badge && (
            <span className="grid h-8 shrink-0 place-items-center rounded-full bg-(--color-announcement-badge-background) px-3 text-xs font-semibold uppercase tracking-wide text-(--color-announcement-badge-text)">
              {badge}
            </span>
          )}
          <span
            className={clsx(
              'text-sm font-medium sm:text-base',
              badge ? 'ml-3' : 'ml-4',
            )}
          >
            {children}
          </span>
          <span className="text-[--color-announcement-icon ml-4 grid size-8 shrink-0 place-items-center rounded-full bg-(--color-announcement-icon-background) group-hover:bg-(--color-announcement-icon-background-hover) group-focus:bg-(--color-announcement-icon-background-hover)">
            <Icon component={ArrowRightIcon} size={16} />
          </span>
        </div>
      </BaseLink>
    </div>
  )
}
