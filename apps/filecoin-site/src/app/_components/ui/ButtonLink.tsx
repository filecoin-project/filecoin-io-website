import type { ComponentProps } from 'react'

import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-paper text-carbon hover:bg-white',
  secondary: 'bg-graphite text-white hover:bg-[#383838]',
  /** Dark pill for light backgrounds. */
  ink: 'bg-carbon text-white hover:bg-graphite',
  /** White pill: on light grey backgrounds, or the lighter of two on dark ones. */
  white: 'bg-white text-carbon hover:bg-paper',
  /** Brand-blue outline on a dark background (the Provide Storage page's primary). */
  outline: 'border-2 border-brand bg-transparent text-white hover:bg-brand/15',
  /** Brand-blue outline on a light background. */
  'outline-light':
    'border-2 border-brand bg-transparent text-carbon hover:bg-brand/10',
} as const

export type ButtonVariant = keyof typeof VARIANTS

/** The pill's classes, shared by the link and the `<button>` (`Button.tsx`). */
export function buttonClassName(variant: ButtonVariant, className?: string) {
  return clsx(
    'group/button font-heading text-button font-book inline-flex items-center justify-center rounded-full px-[clamp(1.25rem,1.162rem+0.376vw,1.5rem)] py-[clamp(0.875rem,0.831rem+0.188vw,1rem)] leading-[1.15] tracking-[-0.02em] whitespace-nowrap',
    'transition-[background-color,scale] duration-200 ease-out active:scale-[0.97]',
    VARIANTS[variant],
    className,
  )
}

/** The label that rolls up on hover while a copy rolls in from below. */
export function ButtonLabel({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="ease-out-quint block transition-transform duration-400 group-hover/button:-translate-y-[115%] motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="ease-out-quint absolute inset-0 block translate-y-[115%] transition-transform duration-400 group-hover/button:translate-y-0 motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  )
}

/**
 * Pill call-to-action. On hover the label rolls up and a copy rolls in from below; press
 * scales it down slightly so it feels physical.
 */
export default function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<'a'> & { variant?: ButtonVariant; children: string }) {
  const external =
    typeof props.href === 'string' && props.href.startsWith('http')
  return (
    <a
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
      className={buttonClassName(variant, className)}
    >
      <ButtonLabel>{children}</ButtonLabel>
    </a>
  )
}
