import * as Sentry from '@sentry/nextjs'
import { initBotId } from 'botid/client/core'

import { ignoredClientErrors } from '@filecoin-foundation/sentry-config'

import { FORM_ENDPOINTS } from '@/constants/formEndpoints'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.05,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.01,
  environment: process.env.NODE_ENV,
  ignoreErrors: ignoredClientErrors,
})

// Vercel BotID's invisible check on the form submissions; the routes read its verdict.
initBotId({
  protect: FORM_ENDPOINTS.map((path) => ({ path, method: 'POST' })),
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
export const onRequestError = Sentry.captureRequestError
