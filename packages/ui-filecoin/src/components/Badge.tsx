import { clsx } from 'clsx'

import { capitalize } from '../utils'

import { Icon, type IconProps } from './Icon'

export type BadgeProps = {
  icon?: IconProps['component']
  textTransform?: 'capitalize' | 'uppercase' | 'none'
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  children: string
}

const variantClasses = {
  primary: {
    wrapper:
      'border-brand-600 in-[.light-section]:text-brand-950 in-[.dark-section]:text-slate-50',
    icon: 'in-[.light-section]:text-brand-950 in-[.dark-section]:text-slate-50',
  },
  secondary: {
    wrapper:
      'border-amber-600 in-[.light-section]:text-amber-950 in-[.dark-section]:text-amber-300',
    icon: 'text-amber-600',
  },
  tertiary: {
    wrapper:
      'border-red-600 in-[.light-section]:text-red-950 in-[.dark-section]:text-red-300',
    icon: 'text-red-600',
  },
  solid: {
    wrapper: 'text-white bg-brand-800 border-brand-800',
    icon: 'text-white',
  },
  neutral: {
    wrapper:
      'border-(--color-border-base) in-[.light-section]:text-slate-950 in-[.dark-section]:text-slate-50',
    icon: 'text-brand-500',
  },
} as const

const sizeClasses = {
  default: 'px-4 py-1 text-sm/5',
  large: 'px-4 py-2 text-sm/6',
} as const

export function Badge({
  icon,
  variant = 'primary',
  size = 'default',
  textTransform = 'capitalize',
  children,
}: BadgeProps) {
  const styles = variantClasses[variant]
  const transformedText = getTransformedText(children, textTransform)

  return (
    <span
      className={clsx(
        'flex items-center gap-1.5 rounded-full border font-medium',
        sizeClasses[size],
        styles.wrapper,
      )}
    >
      {icon && (
        <span className={styles.icon}>
          <Icon component={icon} size={size === 'large' ? 18 : 16} />
        </span>
      )}
      {transformedText}
    </span>
  )
}

function getTransformedText(
  text: string,
  transform: BadgeProps['textTransform'] = 'capitalize',
) {
  if (transform === 'uppercase') return text.toUpperCase()
  if (transform === 'none') return text
  return capitalize(text)
}
