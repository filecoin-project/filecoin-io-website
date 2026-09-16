type LinkDescriptionProps = {
  children: string
}

export function LinkDescription({ children }: LinkDescriptionProps) {
  return <p className="text-sm text-(--color-paragraph-text)">{children}</p>
}
