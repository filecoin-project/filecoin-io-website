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

/** A trimmed string of at most `max` characters, or null when the value is not one. */
export function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
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
