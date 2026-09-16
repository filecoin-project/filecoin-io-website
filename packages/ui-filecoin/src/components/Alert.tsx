import { InfoIcon } from '@phosphor-icons/react/dist/ssr'

type AlertProps = {
  title: string
  description: string
}

export function Alert({ title, description }: AlertProps) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-5"
      role="alert"
    >
      <span
        aria-hidden="true"
        className="flex items-center justify-center rounded-full border border-slate-200 p-1 text-slate-600"
      >
        <InfoIcon size={20} />
      </span>

      <div className="flex flex-1 flex-col gap-2">
        <span className="font-medium text-slate-950">{title}</span>
        {description && <span className="text-slate-600">{description}</span>}
      </div>
    </div>
  )
}
