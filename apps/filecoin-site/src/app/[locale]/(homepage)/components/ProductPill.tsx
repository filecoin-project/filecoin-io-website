import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { clsx } from 'clsx'

import { BaseLink } from '@filecoin-foundation/ui-filecoin/BaseLink'
import { Icon } from '@filecoin-foundation/ui-filecoin/Icon'

export type ProductPillProps = {
  label: string
  href: string
  icon: PhosphorIcon
  variant?: 'default' | 'muted'
}

export function ProductPill({
  label,
  href,
  icon,
  variant = 'default',
}: ProductPillProps) {
  return (
    <BaseLink
      href={href}
      className={clsx(
        'focus:brand-outline inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors',
        variant === 'default' &&
          'hover:border-brand-700 hover:text-brand-800 border-(--color-border-base) bg-(--color-card-background) text-(--color-text-base)',
        variant === 'muted' &&
          'border-dashed border-(--color-border-base) text-(--color-paragraph-text) hover:text-(--color-text-base)',
      )}
    >
      <span className="text-brand-700">
        <Icon component={icon} size={18} />
      </span>
      {label}
    </BaseLink>
  )
}
