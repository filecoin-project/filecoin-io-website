# Development notes (for contributors and agents)

Turborepo, npm workspaces. The only app is `apps/filecoin-site` (Next.js 16 App
Router, React 19, Tailwind 4, next-intl `en` + `zh-cn`, TinaCMS for blog content).

## Commands (run from repo root unless noted)

```bash
CYPRESS_INSTALL_BINARY=0 npm ci                    # cypress binary download often fails in sandboxes
npx turbo run build --filter=@filecoin-foundation/ui-filecoin   # required once before typecheck/dev
cd apps/filecoin-site && npx next typegen && npx tsc --noEmit    # typecheck (typed routes need typegen)
cd apps/filecoin-site && npx eslint src --fix                    # lint (import order is enforced)
cd apps/filecoin-site && npx prettier --write <files>            # tailwind class sorting
cd apps/filecoin-site && npx next dev --webpack                  # no env vars needed for pages
```

`npm run build` runs `tinacms build`, which needs `NEXT_PUBLIC_TINA_CLIENT_ID` and
`TINA_TOKEN`. Without them, verify with `next dev` + a browser screenshot instead.

Paths with `[locale]` and `(homepage)` break shell globs; quote them or use
`find … -print0 | xargs -0`.

## Conventions that matter

- **Components:** reuse `@filecoin-foundation/ui-filecoin/*` first, then
  `src/app/_components` (`@/components/*`), then page-local `components/`.
  Page-local data goes in the route's `data/*.ts` as `getX(t)` functions.
- **Copy:** never hard-code strings. Add keys to *both*
  `src/i18n/translations/en.json` and `zh-cn.json` under the route path
  namespace (`"/"`, `"/store-data"`, …). `metadata.title/description` per route
  are read by Cypress.
- **Links:** internal routes via `PATHS` (`_constants/paths.ts`); external via
  `_constants/siteMetadata.ts`. `PATHS` is typed against real routes, so a path
  cannot be added before its page exists.
- **Sections:** `PageSection backgroundVariant` = dark | gray | light |
  transparentDark. Colours inside sections come from CSS variables
  (`--color-text-base`, `--color-paragraph-text`, `--color-border-muted`, …),
  never hard-coded zinc values, so components work on any background.
- **Client components** only for interactivity (Headless UI tabs, listboxes).
  Keep them leaf-level; pass translated data in as props.
- **Placeholder content** must be marked `PLACEHOLDER` in a header comment so it
  is grep-able, and listed in the relevant `docs/*.md` decision log.

## Current project

`docs/homepage-redesign.md` — homepage rebuild for the brand/web realignment.
`docs/vercel-deployment.md` — Vercel settings and the env vars the build requires.
`docs/homepage-feedback-plan.md` — round 1 design feedback, written as a handoff.
Read it before touching the homepage or the navigation IA.
