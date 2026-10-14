import type { ComponentProps } from 'react'

import {
  ButtonLabel,
  buttonClassName,
  type ButtonVariant,
} from '@/components/ui/ButtonLink'

/** The same pill as `ButtonLink`, as a real `<button>` (form submits, dialog actions). */
export default function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant; children: string }) {
  return (
    <button
      type={type}
      {...props}
      className={buttonClassName(variant, className)}
    >
      <ButtonLabel>{children}</ButtonLabel>
    </button>
  )
}
