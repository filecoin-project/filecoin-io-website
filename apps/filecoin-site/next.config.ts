import { withBotId } from 'botid/next/config'
import createNextIntlPlugin from 'next-intl/plugin'

import { createNextConfig } from '@filecoin-foundation/next-config'

import { redirects as rawRedirects } from './redirects'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = createNextConfig({
  imageRemotePatterns: [],
  redirects: async () => rawRedirects,
  sentry: {
    project: 'filecoin-site',
    authTokenEnvVar: 'SENTRY_AUTH_TOKEN_FILECOIN_SITE',
  },
})

// withBotId serves Vercel BotID's challenge script from this domain (see src/app/_utils/formGuard.ts).
export default withBotId(withNextIntl(nextConfig))
