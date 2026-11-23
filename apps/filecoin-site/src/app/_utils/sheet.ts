/**
 * Appends a form submission to a Google Sheet, through the Apps Script web app bound to it
 * (scripts/contact-sheet/Code.gs). Each form has its own sheet and so its own deployment URL:
 * CONTACT_SHEET_WEBHOOK_URL for the contact form, PROVIDER_SHEET_WEBHOOK_URL for the storage
 * provider form. The URLs stay on the server, so browsers only ever talk to our route handlers
 * (/api/contact, /api/provider).
 *
 * Without the variable, development logs the submission and reports success so a form can be
 * tried; production answers 503.
 */

const WEBHOOKS = {
  contact: 'CONTACT_SHEET_WEBHOOK_URL',
  provider: 'PROVIDER_SHEET_WEBHOOK_URL',
  partner: 'PARTNER_SHEET_WEBHOOK_URL',
} as const

export async function appendToSheet(
  form: keyof typeof WEBHOOKS,
  submission: Record<string, unknown>,
): Promise<Response> {
  const row = { form, ...submission, submittedAt: new Date().toISOString() }
  const variable = WEBHOOKS[form]
  const webhook = process.env[variable]
  if (!webhook) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[${form}] ${variable} is not set; the submission was not saved:`,
        row,
      )
      return Response.json({ ok: true, saved: false })
    }
    console.error(`[${form}] ${variable} is not set; a submission was lost.`)
    return Response.json(
      { ok: false, error: 'The form is not connected yet.' },
      { status: 503 },
    )
  }

  try {
    // Apps Script answers with a redirect to the script's output; fetch follows it.
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(15_000),
    })
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean
      error?: string
    } | null
    if (!response.ok || !result?.ok) {
      console.error(
        `[${form}] the sheet rejected a submission:`,
        response.status,
        result,
      )
      return Response.json(
        { ok: false, error: 'The sheet rejected the submission.' },
        { status: 502 },
      )
    }
  } catch (error) {
    console.error(`[${form}] could not reach the sheet:`, error)
    return Response.json(
      { ok: false, error: 'Could not reach the sheet.' },
      { status: 502 },
    )
  }
  return Response.json({ ok: true, saved: true })
}

// Characters no one types into a form field: ASCII and Latin-1 control characters (line breaks
// and tabs among them), and the invisible marks that override or isolate text direction, such as
// the right-to-left override. Line breaks in a name are how header injection (`\nBcc: …`) works,
// and direction marks make a cell read differently from what it holds.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/g
// eslint-disable-next-line no-control-regex
const CONTROL_BUT_NEWLINE = /[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g
const DIRECTION_MARKS = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g

/**
 * A trimmed string of at most `max` characters, or null when the value is not one. Direction
 * marks are removed and control characters become spaces; `multiline` keeps line breaks (as \n)
 * for free-text fields.
 */
export function text(
  value: unknown,
  max: number,
  { multiline = false }: { multiline?: boolean } = {},
): string | null {
  if (typeof value !== 'string') return null
  const withoutMarks = value.replace(DIRECTION_MARKS, '')
  const cleaned = multiline
    ? withoutMarks.replace(/\r\n?/g, '\n').replace(CONTROL_BUT_NEWLINE, ' ')
    : withoutMarks.replace(CONTROL, ' ').replace(/ {2,}/g, ' ')
  const trimmed = cleaned.trim()
  return trimmed.length <= max ? trimmed : null
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The request's JSON body, or null when there is none. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/**
 * A dropdown value as one of the English options: the value itself, or the English option at
 * the same position when it is one of a translation's options (the lists share their order).
 */
export function option<T extends readonly string[]>(
  options: T,
  translated: readonly string[],
  value: unknown,
): T[number] | undefined {
  if (typeof value !== 'string') return undefined
  const direct = options.find((o) => o === value)
  if (direct !== undefined) return direct
  const index = translated.indexOf(value)
  return index >= 0 ? options[index] : undefined
}
