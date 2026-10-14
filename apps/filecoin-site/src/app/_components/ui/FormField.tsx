import type { ReactNode } from 'react'

import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'

/** The site's forms (the contact dialog, the storage provider form) share these controls. */

export const fieldClassName =
  'w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-body leading-[1.3] tracking-[-0.01em] text-ink placeholder:text-ink/36 transition-[border-color,box-shadow] duration-200 ease-out hover:border-ink/24 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none disabled:opacity-60'

export const labelClassName =
  'block text-small leading-[1.3] font-medium tracking-[-0.01em] text-ink'

export function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  className?: string
}) {
  return (
    // Bottom-aligned, so a label that wraps lifts its own label, not its neighbour's field.
    <div className={clsx('flex flex-col justify-end gap-2', className)}>
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </label>
      {children}
    </div>
  )
}

/** A native select with a placeholder option and the site's caret. */
export function Select({
  id,
  name,
  placeholder,
  options,
}: {
  id: string
  name: string
  placeholder: string
  options: readonly string[]
}) {
  return (
    <span className="relative block">
      <select
        required
        id={id}
        name={name}
        defaultValue=""
        className={clsx(fieldClassName, 'appearance-none pr-11')}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDownIcon
        aria-hidden="true"
        className="text-ink/56 pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2"
      />
    </span>
  )
}

/** A field hidden from people and from the accessibility tree; only bots fill it in. */
export function Honeypot({ id }: { id: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
    >
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}
