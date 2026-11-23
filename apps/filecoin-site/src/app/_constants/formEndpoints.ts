/**
 * The form routes that Vercel BotID guards: instrumentation-client.ts attaches its browser check
 * to POSTs to these paths, and src/app/_utils/formGuard.ts reads the verdict in each route.
 */
export const FORM_ENDPOINTS = [
  '/api/contact',
  '/api/partner',
  '/api/provider',
] as const
