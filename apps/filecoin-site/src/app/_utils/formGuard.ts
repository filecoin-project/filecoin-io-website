import { checkBotId } from 'botid/server'

/**
 * Bot screening shared by the form routes (/api/contact, /api/partner, /api/provider), run before
 * a submission is validated and saved.
 *
 * - Vercel BotID: instrumentation-client.ts attaches an invisible browser challenge to POSTs to
 *   FORM_ENDPOINTS (src/app/_constants/formEndpoints.ts), and checkBotId() reads its verdict. It
 *   only runs on a Vercel deployment; `next dev` and `next start` (CI) skip it. If BotID itself
 *   fails, the submission goes through, so a misconfigured project loses no leads.
 * - Honeypot: the forms send their hidden "website" field. People never fill it in, so a value
 *   means a bot; it gets the usual success answer and nothing is saved.
 *
 * Rate limiting is not here: it is a Vercel Firewall rule on these paths (see the README).
 */

/** A response to send instead of saving the submission, or null when it may go on. */
export async function screenSubmission(
  body: unknown,
): Promise<Response | null> {
  if (await isBot()) {
    return Response.json(
      { ok: false, error: 'The submission could not be verified.' },
      { status: 403 },
    )
  }
  if (filledHoneypot(body)) {
    return Response.json({ ok: true, saved: false })
  }
  return null
}

async function isBot(): Promise<boolean> {
  if (!process.env.VERCEL) return false
  try {
    const verification = await checkBotId()
    return verification.isBot
  } catch (error) {
    console.error('BotID check failed; the submission was let through:', error)
    return false
  }
}

function filledHoneypot(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false
  const website = (body as Record<string, unknown>).website
  return typeof website === 'string' && website.trim() !== ''
}
