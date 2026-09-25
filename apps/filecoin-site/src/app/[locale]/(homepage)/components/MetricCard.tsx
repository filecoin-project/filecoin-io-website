export type MetricCardProps = {
  title: string
  subTitle: string
  description: string
  as?: React.ElementType
}

export function MetricCard({
  title,
  subTitle,
  description,
  as: Tag = 'li',
}: MetricCardProps) {
  return (
    <Tag className="flex h-full flex-col gap-8 px-4 py-10 text-center first:pl-0 last:pr-0 md:py-15">
      <div className="space-y-2">
        <h3 className="font-heading text-5xl font-medium tracking-tight text-slate-700 tabular-nums">
          {title}
        </h3>
        <p className="text-xl text-(--color-subheading-text)">{subTitle}</p>
      </div>
      <p className="mx-auto max-w-56 flex-1 text-pretty text-sm text-(--color-paragraph-text-subtle)">
        {description}
      </p>
    </Tag>
  )
}
