# Deploying filecoin-site to Vercel

Verified on 2026-09-09 by running the real production build in a clean container.
Findings below are from actual build runs, not from reading config.

## Project settings

The dashboard defaults Vercel auto-detects are correct. Leave every **Override**
toggle off.

| Setting | Value | Notes |
| --- | --- | --- |
| Framework Preset | Next.js | auto-detected |
| Root Directory | `apps/filecoin-site` | required — the app is not at the repo root |
| Include files outside the root directory | **Enabled** | required — the app consumes `packages/*` |
| Build Command | `turbo run build` (detected) | builds `packages/ui-filecoin` first, then the app |
| Install Command | `npm install --prefix=../..` (detected) | installs the whole npm workspace |
| Output Directory | Next.js default | |
| Node.js Version | **22.x** | root `engines` requires `>=22.0.0` |

`packages/ui-filecoin` has a real build step (tsdown) and is vendored until
`@filecoin-foundation/ui-filecoin@0.9.1` is on npm. Turbo's `dependsOn: ["^build"]`
handles the ordering, so no extra configuration is needed. Confirmed building
first, in about 40 seconds.

## Environment variables

The build **fails without these**. Both failures were reproduced.

| Variable | Needs a real value? | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | **Yes** | `tinacms build` is the first step of the build script |
| `TINA_TOKEN` | **Yes** | same; secret, see below |
| `HUBSPOT_PORTAL_ID` | No — any non-empty string | route module throws at build time if unset |
| `HUBSPOT_STORE_DATA_FORM_ID` | No — any non-empty string | same |
| `HUBSPOT_PROVIDE_STORAGE_FORM_ID` | No — any non-empty string | same |

The two failure modes, verbatim:

```
Error: Client not configured properly. Missing clientId, token.
    at Codegen._createApiUrl (@tinacms/cli)

Error: HUBSPOT_PORTAL_ID is not set
    Failed to collect page data for /api/hubspot/store-data
```

`tina/__generated__` is gitignored, so Tina codegen genuinely has to run on a
fresh clone — committed output cannot stand in for credentials.

The three HubSpot variables only gate the build. CI sets them to a literal
placeholder string (see `.github/workflows/cypress-percy-test.yml`). Do the same
on a preview project unless you need the forms to actually submit; use
`YOUR_VALUE_HERE`-style placeholders rather than production form IDs.

Optional, not required to build:

| Variable | Effect if unset |
| --- | --- |
| `MAILCHIMP_U`, `MAILCHIMP_LIST_ID` | newsletter signup fails at runtime only |
| `NEXT_PUBLIC_SENTRY_DSN` | no error reporting |
| `SENTRY_AUTH_TOKEN_FILECOIN_SITE` | no sourcemap upload |
| `VERCEL_GIT_COMMIT_REF` | set by Vercel automatically; `tina/config.ts` reads it for branch detection |

Recommended additionally:

| Variable | Value | Why |
| --- | --- | --- |
| `CYPRESS_INSTALL_BINARY` | `0` | skips a ~200 MB download of a browser binary the build never uses. Its postinstall is also a known flake — it failed with `ECONNRESET` in this container |

### Handling `TINA_TOKEN`

It is a secret that grants access to the content repository. Store it only as a
Vercel environment variable, never in `vercel.json`, a committed file, or a
build log. Scope it to the narrowest permission Tina Cloud offers, and prefer a
separate token for a preview project so it can be revoked without touching
production.

## Before sharing a preview URL

Two things worth settling first, both specific to this branch.

**The content is placeholder.** Every headline, figure, and customer quote on
the rebuilt homepage is a draft, and the quotes are invented text attributed to
real organisations (Internet Archive, Akave, Flickr Foundation and others),
marked `[Name], [Title]` in place of a real attribution. A public URL removes
the context that they are placeholders. Enable **Deployment Protection**
(Settings → Deployment Protection → Standard Protection) so the preview requires
authentication, or replace the quotes before the link goes anywhere.

**Indexing.** `src/app/robots.ts` emits `User-agent: * / Allow: /`
unconditionally, and `BASE_URL` is hardcoded to `https://filecoin.io`, so a
preview serves a crawl-permitting robots.txt. Page canonicals do point back at
filecoin.io, which limits duplicate-content exposure, but given that filecoin.io's
search authority is one of the assets this project is built around, do not rely
on that alone. Deployment Protection also solves this. If you ever deploy this
project on a public domain, make `robots.ts` conditional on the deployment
environment first.

## Reproducing a build failure locally

```bash
CYPRESS_INSTALL_BINARY=0 npm ci
npx turbo run build --filter=filecoin-site
```

Without Tina credentials this fails at the first step, which is expected. To
check everything downstream of Tina, run the remaining steps directly with
placeholder values:

```bash
cd apps/filecoin-site
HUBSPOT_PORTAL_ID=placeholder \
HUBSPOT_STORE_DATA_FORM_ID=placeholder \
HUBSPOT_PROVIDE_STORAGE_FORM_ID=placeholder \
npx next build --webpack
```

That path completes and prerenders every route.
