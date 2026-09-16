import { clsx } from 'clsx'

type IDProps = {
  number: number
}

export function ID({ number }: IDProps) {
  const isValidId = number >= 0

  return (
    <span
      className={clsx(
        'rounded-lg border px-2 py-1 text-sm',
        isValidId
          ? 'border-slate-200 text-slate-950'
          : 'border-red-200 text-red-500',
      )}
    >
      {isValidId ? `#${number}` : 'Invalid ID'}
    </span>
  )
}
