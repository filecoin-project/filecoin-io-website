export type PeerIDProps = {
  id: string
}

export function PeerID({ id }: PeerIDProps) {
  return (
    <span
      className="rounded-sm bg-slate-50 px-1 py-0.5 font-mono text-sm font-medium text-slate-800"
      title={id}
    >
      {id}
    </span>
  )
}
