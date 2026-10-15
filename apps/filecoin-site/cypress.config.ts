import { defineConfig } from 'cypress'

import {
  getEntryFrontmatter,
  getRandomSlug,
} from '@filecoin-foundation/cypress/tasks'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // Link checks request third-party sites, which are sometimes slow enough to time out once.
    retries: { runMode: 2, openMode: 0 },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    setupNodeEvents(on) {
      on('task', {
        getRandomSlug,
        getEntryFrontmatter,
      })
    },
  },
})
