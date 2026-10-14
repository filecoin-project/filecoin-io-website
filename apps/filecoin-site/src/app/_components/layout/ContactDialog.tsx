'use client'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { CONTACT } from '@/data/links'

import FormDialog from '@/components/layout/FormDialog'

/**
 * The "Talk to sales" form in a modal. Mounted once in the site layout; opens when any link to
 * `CONTACT` (`#contact`) is clicked. Submissions post to /api/contact, which appends a row to
 * the sheet.
 */
export default function ContactDialog({ locale = 'en' }: { locale?: Locale }) {
  const { CONTACT_FORM, FIELDS, INTENT_OPTIONS, LIMITS, VOLUME_OPTIONS } =
    copy(locale).contact
  return (
    <FormDialog
      locale={locale}
      hash={CONTACT}
      endpoint="/api/contact"
      form="contact"
      copy={CONTACT_FORM}
      intentField="intent"
      intentOptions={{
        english: copy('en').contact.INTENT_OPTIONS,
        local: INTENT_OPTIONS,
      }}
      fields={[
        {
          name: 'fullName',
          kind: 'text',
          required: true,
          autoComplete: 'name',
          maxLength: LIMITS.fullName,
          ...FIELDS.fullName,
        },
        {
          name: 'email',
          kind: 'email',
          required: true,
          autoComplete: 'email',
          maxLength: LIMITS.email,
          ...FIELDS.email,
        },
        {
          name: 'company',
          kind: 'text',
          required: true,
          autoComplete: 'organization',
          maxLength: LIMITS.company,
          ...FIELDS.company,
        },
        {
          name: 'intent',
          kind: 'select',
          options: INTENT_OPTIONS,
          ...FIELDS.intent,
        },
        {
          name: 'project',
          kind: 'textarea',
          maxLength: LIMITS.project,
          wide: true,
          ...FIELDS.project,
        },
        {
          name: 'volume',
          kind: 'select',
          options: VOLUME_OPTIONS,
          wide: true,
          ...FIELDS.volume,
        },
      ]}
    />
  )
}
