import { routing } from '@/i18n/routing'

import createMiddleware from 'next-intl/middleware'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … Vercel BotID's proxied paths (the fixed prefix that withBotId in next.config.ts rewrites)
  matcher:
    '/((?!api|trpc|_next|_vercel|admin|149e9513-01fa-4fb0-aad4-566afd725d1b|.*\\..*).*)',
}
