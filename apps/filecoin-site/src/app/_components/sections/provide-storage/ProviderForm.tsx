'use client'

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type SubmitEvent,
} from 'react'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { CheckIcon } from '@phosphor-icons/react/dist/ssr'
import clsx from 'clsx'

import Button from '@/components/ui/Button'
import ButtonLink from '@/components/ui/ButtonLink'
import {
  Field,
  Honeypot,
  Select,
  fieldClassName,
  labelClassName,
} from '@/components/ui/FormField'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * The storage provider intake form: six required fields, the last a set of checkboxes (choose
 * all that apply). Submissions post to /api/provider, which appends a row to the sheet. Sits
 * in the white card on /provide-storage/onboarding; the card shows the thank-you once sent.
 */
export default function ProviderForm({ locale = 'en' }: { locale?: Locale }) {
  const {
    CAPACITY_OPTIONS,
    FIELDS,
    GOAL_OPTIONS,
    LIMITS,
    OPERATION_OPTIONS,
    PROVIDER_FORM,
  } = copy(locale).providerForm
  const { FORM } = copy(locale).ui
  const id = useId()
  const goalsRef = useRef<HTMLFieldSetElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [goalsMissing, setGoalsMissing] = useState(false)

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // Checkboxes cannot be `required` as a group, so the one check that is ours happens here.
    if (data.getAll('goals').length === 0) {
      setGoalsMissing(true)
      goalsRef.current?.querySelector('input')?.focus()
      return
    }
    // The hidden "website" field is a honeypot: a real visitor never fills it in.
    if (data.get('website')) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch('/api/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.get('fullName'),
          email: data.get('email'),
          company: data.get('company'),
          operation: data.get('operation'),
          capacity: data.get('capacity'),
          goals: data.getAll('goals'),
          page: location.pathname,
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'
  const goalsHintId = `${id}-goals-hint`

  return (
    <div
      className="intro-fade ring-ink/6 rounded-3xl bg-white p-[clamp(1.5rem,1.148rem+1.502vw,2.5rem)] shadow-[0_2px_6px_rgb(0_0_0/0.06)] ring-1"
      style={{ '--delay': '300ms' } as CSSProperties}
    >
      {status === 'sent' ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-start gap-6 py-[clamp(1rem,0.648rem+1.502vw,2rem)]"
        >
          <span
            aria-hidden="true"
            className="bg-brand/12 text-brand grid size-12 place-items-center rounded-full"
          >
            <CheckIcon weight="bold" className="size-6" />
          </span>
          <div>
            <h2 className="font-heading text-h3 font-book text-ink leading-[1.15] tracking-[-0.02em] text-balance">
              {PROVIDER_FORM.sent.title}
            </h2>
            <p className="text-body text-ink/64 mt-3 max-w-[32rem] leading-[1.4] tracking-[-0.01em] text-pretty">
              {PROVIDER_FORM.sent.body}
            </p>
          </div>
          <ButtonLink href={PROVIDER_FORM.sent.cta.href} variant="ink">
            {PROVIDER_FORM.sent.cta.label}
          </ButtonLink>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <fieldset
            disabled={sending}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <Field label={FIELDS.fullName.label} htmlFor={`${id}-fullName`}>
              <input
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
            <Field
              label={FIELDS.company.label}
              htmlFor={`${id}-company`}
              className="sm:col-span-2"
            >
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
            <Field
              label={FIELDS.operation.label}
              htmlFor={`${id}-operation`}
              className="sm:col-span-2"
            >
              <Select
                id={`${id}-operation`}
                name="operation"
                placeholder={FIELDS.operation.placeholder}
                options={OPERATION_OPTIONS}
              />
            </Field>
            <Field
              label={FIELDS.capacity.label}
              htmlFor={`${id}-capacity`}
              className="sm:col-span-2"
            >
              <Select
                id={`${id}-capacity`}
                name="capacity"
                placeholder={FIELDS.capacity.placeholder}
                options={CAPACITY_OPTIONS}
              />
            </Field>

            <fieldset
              ref={goalsRef}
              aria-describedby={goalsHintId}
              aria-invalid={goalsMissing || undefined}
              className="flex flex-col gap-2 sm:col-span-2"
              onChange={() => setGoalsMissing(false)}
            >
              <legend className={labelClassName}>{FIELDS.goals.label}</legend>
              <ul className="mt-2 flex flex-col gap-2">
                {GOAL_OPTIONS.map((goal, i) => {
                  const goalId = `${id}-goal-${i}`
                  return (
                    <li key={goal}>
                      <label
                        htmlFor={goalId}
                        className="group/goal border-ink/12 hover:border-ink/24 has-checked:border-brand has-checked:bg-brand/4 has-focus-visible:ring-brand/30 flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3 transition-[border-color,background-color] duration-200 ease-out has-focus-visible:ring-2"
                      >
                        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
                          <input
                            id={goalId}
                            name="goals"
                            type="checkbox"
                            value={goal}
                            className="peer border-ink/24 checked:border-brand checked:bg-brand size-5 appearance-none rounded-md border bg-white transition-[border-color,background-color] duration-200 ease-out focus:outline-none"
                          />
                          <CheckIcon
                            weight="bold"
                            aria-hidden="true"
                            className="pointer-events-none absolute size-3.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                          />
                        </span>
                        <span className="text-body text-ink leading-[1.3] tracking-[-0.01em]">
                          {goal}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
              <p
                id={goalsHintId}
                className={clsx(
                  'text-small leading-[1.3]',
                  goalsMissing ? 'text-[#b42318]' : 'text-ink/56',
                )}
              >
                {goalsMissing ? PROVIDER_FORM.goalsMissing : FIELDS.goals.hint}
              </p>
            </fieldset>

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
                ? PROVIDER_FORM.error
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
              {PROVIDER_FORM.submit}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
