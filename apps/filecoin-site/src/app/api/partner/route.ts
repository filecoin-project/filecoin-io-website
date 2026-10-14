import {
  LIMITS,
  PARTNERSHIP_OPTIONS,
  type PartnerSubmission,
} from '@/data/partner'
import * as zh from '@/data/zh-cn/partner'

import { appendToSheet, EMAIL, option, readJson, text } from '@/utils/sheet'

/**
 * Receives the partnership form (PartnerDialog) and appends a row to the "Partners" sheet. See
 * src/app/_utils/sheet.ts for how the sheet is reached and what happens without it. The Chinese
 * edition's dropdown options are stored as their English counterparts.
 */

/** The submission, cleaned up, or the name of the first field that is missing or malformed. */
function parse(body: unknown): PartnerSubmission | string {
  if (typeof body !== 'object' || body === null) return 'body'
  const raw = body as Record<string, unknown>
  const fullName = text(raw.fullName, LIMITS.fullName)
  if (!fullName) return 'fullName'
  const email = text(raw.email, LIMITS.email)
  if (!email || !EMAIL.test(email)) return 'email'
  const company = text(raw.company, LIMITS.company)
  if (!company) return 'company'
  const type = option(PARTNERSHIP_OPTIONS, zh.PARTNERSHIP_OPTIONS, raw.type)
  if (!type) return 'type'
  const details = text(raw.details, LIMITS.details)
  if (!details) return 'details'
  const page = text(raw.page ?? '', LIMITS.page) ?? ''
  return { fullName, email, company, type, details, page }
}

export async function POST(request: Request) {
  const body = await readJson(request)
  if (body === null)
    return Response.json(
      { ok: false, error: 'Expected a JSON body.' },
      { status: 400 },
    )
  const submission = parse(body)
  if (typeof submission === 'string') {
    return Response.json(
      { ok: false, error: `Missing or invalid field: ${submission}.` },
      { status: 400 },
    )
  }
  return appendToSheet('partner', submission)
}
