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

import { CONTACT } from '@/data/links'

import { labelProps, readStoredTouch, sitePath } from '@/utils/focAttribution'

import Button from '@/components/ui/Button'
import {
  Field,
  Honeypot,
  Select,
  fieldClassName,
} from '@/components/ui/FormField'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * The "Talk to sales" form in a modal. Mounted once in the site layout; opens when any link to
 * `CONTACT` (`#contact`) is clicked, or when the page loads with that hash, so every CTA across
 * the site stays a plain link. Submissions post to /api/contact, which appends a row to the sheet.
 */
export default function ContactDialog({ locale = 'en' }: { locale?: Locale }) {
  const { CONTACT_FORM, FIELDS, INTENT_OPTIONS, LIMITS, VOLUME_OPTIONS } =
    copy(locale).contact
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

  // Any link to `#contact` opens the form in place; so does arriving with that hash in the URL.
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
        anchor.hash !== CONTACT ||
        anchor.origin !== location.origin
      )
        return
      e.preventDefault()
      show()
    }
    const onHash = () => {
      if (location.hash !== CONTACT) return
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
  }, [show])

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
    const form = e.currentTarget
    const data = new FormData(form)
    // The hidden "website" field is a honeypot: a real visitor never fills it in.
    if (data.get('website')) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.get('fullName'),
          email: data.get('email'),
          company: data.get('company'),
          intent: data.get('intent'),
          project: data.get('project'),
          volume: data.get('volume'),
          page: location.pathname,
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('sent')
      // Funnel tracking: a sent form, with the intent as its English option (no personal data).
      const intent = data.get('intent')
      plausible('sales_form_submitted', {
        props: {
          form: 'contact',
          intent:
            copy('en').contact.INTENT_OPTIONS[
              INTENT_OPTIONS.indexOf(intent as (typeof INTENT_OPTIONS)[number])
            ] ?? '(not set)',
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
              {status === 'sent' ? CONTACT_FORM.sent.title : CONTACT_FORM.title}
            </h2>
            <p
              id={bodyId}
              className="text-body text-ink/64 mt-2 leading-[1.4] tracking-[-0.01em] text-pretty"
            >
              {status === 'sent' ? CONTACT_FORM.sent.body : CONTACT_FORM.body}
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
              {CONTACT_FORM.sent.close}
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
              <Field label={FIELDS.fullName.label} htmlFor={`${id}-fullName`}>
                <input
                  ref={firstFieldRef}
                  required
                  id={`${id}-fullName`}
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={LIMITS.fullName}
                  placeholder={FIELDS.fullName.placeholder}
                  className={fieldClassName}
                />
              </Field>
              <Field label={FIELDS.email.label} htmlFor={`${id}-email`}>
                <input
                  required
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={LIMITS.email}
                  placeholder={FIELDS.email.placeholder}
                  className={fieldClassName}
                />
              </Field>
              <Field label={FIELDS.company.label} htmlFor={`${id}-company`}>
                <input
                  required
                  id={`${id}-company`}
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={LIMITS.company}
                  placeholder={FIELDS.company.placeholder}
                  className={fieldClassName}
                />
              </Field>
              <Field label={FIELDS.intent.label} htmlFor={`${id}-intent`}>
                <Select
                  id={`${id}-intent`}
                  name="intent"
                  placeholder={FIELDS.intent.placeholder}
                  options={INTENT_OPTIONS}
                />
              </Field>
              <Field
                label={FIELDS.project.label}
                htmlFor={`${id}-project`}
                className="sm:col-span-2"
              >
                <textarea
                  id={`${id}-project`}
                  name="project"
                  rows={4}
                  maxLength={LIMITS.project}
                  placeholder={FIELDS.project.placeholder}
                  className={clsx(fieldClassName, 'min-h-28 resize-y')}
                />
              </Field>
              <Field
                label={FIELDS.volume.label}
                htmlFor={`${id}-volume`}
                className="sm:col-span-2"
              >
                <Select
                  id={`${id}-volume`}
                  name="volume"
                  placeholder={FIELDS.volume.placeholder}
                  options={VOLUME_OPTIONS}
                />
              </Field>
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
                {status === 'error'
                  ? CONTACT_FORM.error
                  : sending
                    ? FORM.sending
                    : ''}
              </p>
              <Button
                type="submit"
                variant="ink"
                disabled={sending}
                className="disabled:opacity-60"
              >
                {CONTACT_FORM.submit}
              </Button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
