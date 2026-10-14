import {
  CAPACITY_OPTIONS,
  GOAL_OPTIONS,
  LIMITS,
  OPERATION_OPTIONS,
  type ProviderSubmission,
} from '@/data/provider-form'
import * as zh from '@/data/zh-cn/provider-form'

import { appendToSheet, EMAIL, option, readJson, text } from '@/utils/sheet'

/**
 * Receives the storage provider intake form (ProviderForm, on /provide-storage/onboarding) and
 * appends a row to the "Storage providers" sheet. See src/app/_utils/sheet.ts. The Chinese
 * edition's options are stored as their English counterparts.
 */

/** The submission, cleaned up, or the name of the first field that is missing or malformed. */
function parse(body: unknown): ProviderSubmission | string {
  if (typeof body !== 'object' || body === null) return 'body'
  const raw = body as Record<string, unknown>
  const fullName = text(raw.fullName, LIMITS.fullName)
  if (!fullName) return 'fullName'
  const email = text(raw.email, LIMITS.email)
  if (!email || !EMAIL.test(email)) return 'email'
  const company = text(raw.company, LIMITS.company)
  if (!company) return 'company'
  const operation = option(
    OPERATION_OPTIONS,
    zh.OPERATION_OPTIONS,
    raw.operation,
  )
  if (!operation) return 'operation'
  const capacity = option(CAPACITY_OPTIONS, zh.CAPACITY_OPTIONS, raw.capacity)
  if (!capacity) return 'capacity'
  // At least one goal, each one of the options, in the options' order and without repeats.
  if (!Array.isArray(raw.goals)) return 'goals'
  const chosen = new Set(
    raw.goals.map((goal) => option(GOAL_OPTIONS, zh.GOAL_OPTIONS, goal)),
  )
  if (chosen.has(undefined) || chosen.size !== raw.goals.length) return 'goals'
  const goals = GOAL_OPTIONS.filter((goal) => chosen.has(goal))
  if (goals.length === 0) return 'goals'
  const page = text(raw.page ?? '', LIMITS.page) ?? ''
  return { fullName, email, company, operation, capacity, goals, page }
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
  // The sheet gets the goals as one cell.
  return appendToSheet('provider', {
    ...submission,
    goals: submission.goals.join('; '),
  })
}
