'use client'

import { copy } from '@/i18n/copy'
import type { Locale } from '@/i18n/locales'

import { PARTNER } from '@/data/links'

import FormDialog from '@/components/layout/FormDialog'

/**
 * The "Partner With Us" form in a modal. Mounted once in the site layout; opens when any link to
 * `PARTNER` (`#partner`) is clicked. Submissions post to /api/partner, which appends a row to
 * the partnerships sheet.
 */
export default function PartnerDialog({ locale = 'en' }: { locale?: Locale }) {
  const { FIELDS, LIMITS, PARTNER_FORM, PARTNERSHIP_OPTIONS } =
    copy(locale).partner
  return (
    <FormDialog
      locale={locale}
      hash={PARTNER}
      endpoint="/api/partner"
      form="partner"
      copy={PARTNER_FORM}
      intentField="type"
      intentOptions={{
        english: copy('en').partner.PARTNERSHIP_OPTIONS,
        local: PARTNERSHIP_OPTIONS,
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
          name: 'type',
          kind: 'select',
          options: PARTNERSHIP_OPTIONS,
          ...FIELDS.type,
        },
        {
          name: 'details',
          kind: 'textarea',
          required: true,
          maxLength: LIMITS.details,
          wide: true,
          ...FIELDS.details,
        },
      ]}
    />
  )
}
