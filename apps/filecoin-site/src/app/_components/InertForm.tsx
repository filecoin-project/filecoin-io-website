'use client'

import type { ComponentProps } from 'react'

/** A form that never submits. The snapshot's newsletter signup is not wired to anything. */
export function InertForm({ onSubmit, ...props }: ComponentProps<'form'>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
      {...props}
    />
  )
}
