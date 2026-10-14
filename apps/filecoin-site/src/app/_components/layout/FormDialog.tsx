'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type SubmitEvent,
} from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { XIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'
import { useLenis } from 'lenis/react'
import { usePlausible } from 'next-plausible'

import { labelProps, readStoredTouch, sitePath } from '@/utils/focAttribution'

import Button from '@/components/ui/Button'
import {
  Field,
  Honeypot,
  Select,
  fieldClassName,
} from '@/components/ui/FormField'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export type FormDialogCopy = {
  title: string
  body: string
  submit: string
  sent: { title: string; body: string; close: string }
  error: string
}

export type FormDialogField = {
  name: string
  label: string
  placeholder: string
  kind: 'text' | 'email' | 'textarea' | 'select'
  required?: boolean
  autoComplete?: string
  maxLength?: number
  options?: readonly string[]
  /** Across both columns of the grid. */
  wide?: boolean
}

/**
 * A form in a modal, opened in place by any link whose hash is `hash` or by arriving with that
 * hash in the URL, so every call to action across the site stays a plain link. Submissions post
 * as JSON to `endpoint` (the fields by name, plus `page`), and a sent form sends the
 * `sales_form_submitted` event with `form` and, for the field named by `intentField`, its
 * English option (`intentOptions`), never anything the visitor typed.
 */
export default function FormDialog({
  locale = 'en',
  hash,
  endpoint,
  form,
  copy: text,
  fields,
  intentField,
  intentOptions,
}: {
  locale?: Locale
  hash: `#${string}`
  endpoint: `/api/${string}`
  form: string
  copy: FormDialogCopy
  fields: FormDialogField[]
  intentField?: string
  intentOptions?: { english: readonly string[]; local: readonly string[] }
}) {
  const { FORM } = copy(locale).ui
  const ref = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const lenis = useLenis()
  const plausible = usePlausible()
  const id = useId()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const show = useCallback(() => {
    const dialog = ref.current
    if (!dialog || dialog.open) return
    setStatus('idle')
    formRef.current?.reset()
    dialog.showModal()
    setOpen(true)
    firstFieldRef.current?.focus()
  }, [])

  const close = useCallback(() => {
    ref.current?.close()
  }, [])

  // Any link to the hash opens the form in place; so does arriving with that hash in the URL.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return
      const anchor = (e.target as Element | null)?.closest?.('a[href]')
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.hash !== hash ||
        anchor.origin !== location.origin
      )
        return
      e.preventDefault()
      show()
    }
    const onHash = () => {
      if (location.hash !== hash) return
      history.replaceState(null, '', location.pathname + location.search)
      show()
    }
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHash)
    }
  }, [show, hash])

  // Freeze the page behind the dialog while it is open (Escape and the backdrop close it natively).
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      root.style.overflow = previous
      lenis?.start()
    }
  }, [open, lenis])

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // The hidden "website" field is a honeypot: a real visitor never fills it in.
    if (data.get('website')) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      const body: Record<string, FormDataEntryValue | null> = {
        page: location.pathname,
      }
      for (const field of fields) body[field.name] = data.get(field.name)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('sent')
      // Funnel tracking: a sent form, with the chosen option as its English text.
      const chosen = intentField ? data.get(intentField) : null
      const intent =
        intentOptions && typeof chosen === 'string'
          ? intentOptions.english[intentOptions.local.indexOf(chosen)]
          : undefined
      plausible('sales_form_submitted', {
        props: {
          form,
          intent: intent ?? '(not set)',
          hop_source: sitePath(location.pathname),
          ...labelProps(readStoredTouch()),
        },
      })
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'
  const titleId = `${id}-title`
  const bodyId = `${id}-body`

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={clsx(
        'text-ink fixed inset-0 m-auto max-h-[calc(100dvh-2*var(--gutter))] w-[min(100%-2*var(--gutter),40rem)] overflow-visible rounded-3xl bg-transparent p-0',
        'backdrop:bg-[rgb(2_6_24/0.72)] backdrop:backdrop-blur-sm',
        // Fade and lift in; the backdrop fades with it. `@starting-style` gives the entry state.
        'ease-out-quint translate-y-3 scale-[0.98] opacity-0 transition-[opacity,translate,scale,display,overlay] transition-discrete duration-300',
        'backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300',
        'open:translate-y-0 open:scale-100 open:opacity-100 open:backdrop:opacity-100',
        'starting:open:translate-y-3 starting:open:scale-[0.98] starting:open:opacity-0 starting:open:backdrop:opacity-0',
        'motion-reduce:transition-none motion-reduce:backdrop:transition-none',
      )}
      onClose={() => setOpen(false)}
      // Clicks on the backdrop reach the <dialog> itself; clicks inside land on the panel.
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        data-lenis-prevent
        className="bg-paper max-h-[calc(100dvh-2*var(--gutter))] overflow-y-auto overscroll-contain rounded-3xl p-[clamp(1.5rem,1.148rem+1.502vw,2.5rem)] shadow-[0_32px_80px_-24px_rgb(0_0_0/0.6)] ring-1 ring-white/60 ring-inset"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2
              id={titleId}
              className="font-heading text-h3 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance"
            >
              {status === 'sent' ? text.sent.title : text.title}
            </h2>
            <p
              id={bodyId}
              className="text-body text-ink/64 mt-2 leading-[1.4] tracking-[-0.01em] text-pretty"
            >
              {status === 'sent' ? text.sent.body : text.body}
            </p>
          </div>
          <button
            type="button"
            aria-label={FORM.close}
            className="text-ink/64 hover:bg-ink/6 hover:text-ink -mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,color] duration-200 ease-out active:scale-[0.96]"
            onClick={close}
          >
            <XIcon aria-hidden="true" className="size-5" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="mt-8 flex justify-end">
            <Button variant="ink" onClick={close}>
              {text.sent.close}
            </Button>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate={false}
            className="mt-8"
            onSubmit={onSubmit}
          >
            <fieldset
              disabled={sending}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              {fields.map((field, i) => {
                const fieldId = `${id}-${field.name}`
                return (
                  <Field
                    key={field.name}
                    label={field.label}
                    htmlFor={fieldId}
                    className={field.wide ? 'sm:col-span-2' : undefined}
                  >
                    {field.kind === 'select' ? (
                      <Select
                        id={fieldId}
                        name={field.name}
                        placeholder={field.placeholder}
                        options={field.options ?? []}
                      />
                    ) : field.kind === 'textarea' ? (
                      <textarea
                        required={field.required}
                        id={fieldId}
                        name={field.name}
                        rows={4}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        className={clsx(fieldClassName, 'min-h-28 resize-y')}
                      />
                    ) : (
                      <input
                        ref={i === 0 ? firstFieldRef : undefined}
                        required={field.required}
                        id={fieldId}
                        name={field.name}
                        type={field.kind}
                        autoComplete={field.autoComplete}
                        inputMode={field.kind === 'email' ? 'email' : undefined}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        className={fieldClassName}
                      />
                    )}
                  </Field>
                )
              })}
              <Honeypot id={`${id}-website`} />
            </fieldset>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p
                role="status"
                aria-live="polite"
                className={clsx(
                  'text-small leading-[1.3] text-pretty',
                  status === 'error' ? 'text-[#b42318]' : 'text-ink/56',
                )}
              >
                {status === 'error' ? text.error : sending ? FORM.sending : ''}
              </p>
              <Button
                type="submit"
                variant="ink"
                disabled={sending}
                className="disabled:opacity-60"
              >
                {text.submit}
              </Button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
