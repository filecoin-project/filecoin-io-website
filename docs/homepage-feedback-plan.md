# Homepage feedback, round 1

Seven changes to the rebuilt homepage, from design review on 9 September 2026.
Written to be executed without prior context on this branch.

Branch: `claude/filecoin-homepage-redesign-rua21u`. Base commit: 82bdaba.
Live preview: <https://preview-kappa-flax.vercel.app/>

Everything on this page is a prototype. Copy, figures, quotes and most
destinations are placeholder, and that is expected. Do not try to make them
real.

---

## Before you start

```bash
CYPRESS_INSTALL_BINARY=0 npm ci
npx turbo run build --filter=@filecoin-foundation/ui-filecoin
cd apps/filecoin-site && npx next dev --webpack -p 3100
```

The dev server needs no environment variables. `npm run build` does, so do not
use it to check your work. See `docs/vercel-deployment.md`.

Read `CLAUDE.md` first. It carries the conventions this repo enforces. The three
that will bite hardest here:

1. **Copy never lives in components.** Add keys to both
   `apps/filecoin-site/src/i18n/translations/en.json` and `zh-cn.json`, under the
   route namespace. The homepage namespace is `"/"`. A missing `zh-cn` key throws
   at runtime on `/zh-cn`.
2. **Shell globs break on these paths.** `[locale]` and `(homepage)` need quoting,
   or use `find … -print0 | xargs -0`.
3. **Type scale is fixed.** Use the `Heading` variants from `ui-filecoin`
   (`page-heading`, `section-heading`, `card-heading`) and the site's existing
   text classes. Do not invent responsive type steps, and do not touch the root
   font size. This was already got wrong once and reverted; see
   `docs/homepage-redesign.md` under "Type scale".

### The one rule that will cost you an hour if you miss it

`UseCaseShowcase` and `AudienceSelector` are client components. Phosphor icons
and SVGR logos are functions, so **passing them from a server-side data function
into a client component throws** "Functions cannot be passed directly to Client
Components".

The pattern already used in `UseCaseShowcase` for the customer logos: data files
carry **string keys**, and the client component holds a `Record<key, icon>` map
that it imports directly and looks up itself. Items 4 and 6 both need this.
`ProductCatalog` is a server component and can keep receiving icons as props.

### Files you will be working in

```
apps/filecoin-site/src/app/[locale]/(homepage)/
  page.tsx
  components/  HeroSection  StatsRow  UseCaseShowcase  ProductSpotlight
               CodeSnippet  AudienceSelector  ProductCatalog
  data/        proofStats  useCases  productSpotlight  audiences  productCatalog
apps/filecoin-site/src/app/_components/Navigation/constants/navigation.ts
apps/filecoin-site/src/i18n/translations/{en,zh-cn}.json
packages/ui/src/CopyToClipboard.tsx          (item 5, small addition)
```

---

## Item 1 — Replace the hero badge with a link to the Solstice post

**File:** `components/HeroSection.tsx`, plus both translation files.

Remove the static `Badge` reading "FILECOIN CLOUD". In its place use
`Announcement` from `@filecoin-foundation/ui-filecoin/Announcement`, which is the
site's existing hero pill: label plus a circular arrow, correct borders and hover
states from theme variables. The previous version of this hero used it the same
way, so check `git show 8ebae06^:apps/filecoin-site/src/app/[locale]/(homepage)/components/HeroSection.tsx`
for the exact usage.

Do not pass `centered`. This hero is left-aligned.

**Destination.** Link internally, not to the absolute URL. The post is in this
repo at `content/blog/posts/en/Solstice-Towards-a-Filecoin-Service-Economy.md`,
so the href is:

```
`${PATHS.BLOG.path}/Solstice-Towards-a-Filecoin-Service-Economy`
```

Internal keeps the locale prefix and avoids the external-link arrow fighting the
pill's own arrow.

**Copy.** `Announcement` takes a single string, so use one key. Use exactly:

> New proposal: a Filecoin service economy

FIP-0118 is still a draft open for community feedback, which the post states in
its third paragraph. Do not write "Announcing" or "Introducing", which would
misstate its status.

---

## Item 2 — Remove the two-tone hero headline

**File:** `components/HeroSection.tsx`, plus both translation files.

The second half of the headline currently sits in `--color-paragraph-text`, which
is zinc-400 on dark, and it falls across the bright part of the earth image. It
does not clear the 3:1 minimum for large text.

Make the headline one colour, then replace the hand-rolled `<h1>` with
`PageHeader` from `@filecoin-foundation/ui-filecoin/PageHeader`, used as
`variant="highContrast"` with no `centered` prop. That is what every other page
header on the site uses, and it locks the heading, description spacing and
measure to the site rather than to hand-written classes. The only reason the
hero was hand-rolled was the nested span, which is now gone.

Pass the two hero buttons through `PageHeader`'s `cta` prop rather than a
separate `ButtonRow`.

**Copy.** Collapse `hero.headlineStrong` and `hero.headlineMuted` into a single
`hero.headline` in both locales. The full sentence is:

> Storing the internet's most valuable information for the developers and
> enterprises building on top of it.

Delete the now-unused keys. Also delete `hero.eyebrow`, replaced by item 1.

---

## Item 3 — Reorder the customer tabs by brand recognition

**File:** `data/useCases.ts` only. No component change.

Reorder the array returned by `getUseCases` to:

1. `internet-archive`
2. `flickr-foundation`
3. `starling-lab`
4. `lighthouse`
5. `cidgravity`
6. `akave`

Keep the existing display names. "Flickr Foundation", "Starling Lab", and
"CIDgravity" as one word with a lowercase g, which is how the brand is written on
the Store Data page. Do not shorten them.

The first entry is the default open tab, so Internet Archive becomes what loads
at rest. That is intended.

---

## Item 4 — Give the "products used" pills icons and links

**Files:** a new `data/products.ts`, a new `components/ProductPill.tsx`,
`data/useCases.ts`, `data/productCatalog.ts`, `components/ProductCatalog.tsx`,
`components/UseCaseShowcase.tsx`.

The pills under "Products used" should match the pills in the "Building blocks"
section below: a Phosphor icon plus a label, and clickable. Reuse rather than
restyle.

**Step 1. One product registry.** Product identity is currently defined twice:
`useCases.ts` stores plain label strings, `productCatalog.ts` separately holds
label, href and icon. Create `data/products.ts` as the single source, keyed by
product key, holding the translation key, href and icon for each. All seven
products used by the use cases already exist among the catalog's ten, so there
are no gaps.

**Step 2. Extract `ProductPill`** from `ProductCatalog.tsx` into its own file so
both sections import it. Keep its current classes exactly.

**Step 3. Wire both sections.** `productCatalog.ts` groups product keys.
`useCases.ts` carries product **keys**, not labels. `UseCaseShowcase` imports the
registry and resolves icon, href and label itself, per the client-boundary rule
above. It already calls `useTranslations`, so it can read the label keys directly.

Keep the pills inside the existing `<ul>`/`<li>`, matching the catalog's markup.

**Confirmed with Gary:** the pills change from the current blue-outline badge to
the catalog's neutral border with a blue icon. That is intended.

Product hrefs currently point at filecoin.cloud and docs. Leave them. This is the
first place the missing `/products/*` pages become visible, and that is a known
gap in `docs/homepage-redesign.md`.

---

## Item 5 — Copy button on the snippet, plus a second prompt snippet

**Files:** `components/CodeSnippet.tsx`, `components/ProductSpotlight.tsx`,
`data/productSpotlight.ts`, `packages/ui/src/CopyToClipboard.tsx`, both
translation files.

### 5a. Copy button

Use `CopyToClipboard` from `@filecoin-foundation/ui/CopyToClipboard`. It already
handles the clipboard write, a success toast, Sentry on failure, and the shared
`icon-button` styling. It is already `'use client'`, so the server-rendered
snippet can pass it a plain string.

Two small additions to that shared component: it hardcodes a chain-link icon at
32px and a tooltip reading "Copy link to clipboard", which is the wrong
affordance for code. Add optional `icon` and `tooltipDescription` props with the
current values as defaults. There is exactly one other caller,
`packages/ui/src/ShareArticle.tsx`, and defaults leave it unchanged. Verify that
page still works.

Derive the text to copy by joining the snippet's existing token `text` values per
line, so the code stays defined in one place. Place the button in the snippet's
header row, right side, beside the language label.

### 5b. Fix the snippet's API, which the copy button makes urgent

The current snippet does not compile against Synapse SDK 2.0.0. A copy button
makes wrong code far more likely to be pasted into a real project, so correct it
in this change. Verified against the published package:

- `Synapse.create` takes `{ account, chain, transport, source, withCDN }`. It
  takes a **viem account**, not a `privateKey` string, and there is no `rpcURL`.
  Build the account with `privateKeyToAccount` from `viem/accounts`, and the
  transport with `http()`.
- Chains come from `@filoz/synapse-core/chains` as `mainnet` and `calibration`.
- `storage.upload(bytes, options)` returns `{ pieceCid, size, copies, complete }`.
- `storage.download` takes an **options object**: `download({ pieceCid })`.
- `viem` is a peer dependency and must be installed alongside the SDK.

Keep the snippet short. It is a credibility signal, not a tutorial.

### 5c. Second snippet: an AI-agent prompt

Add a second `CodeSnippet` holding a plain-text prompt someone would paste into
an AI coding agent to build on Filecoin. No syntax colouring, so a single token
per line. Name the file something like `prompt.txt`.

**Confirmed with Gary:** stack both snippets in the right-hand column rather
than adding a toggle. The page already has two tab groups and a third would be
noise.

Give it a copy button too.

---

## Item 6 — Icons on the ICP tabs, AI agents first

**Files:** `data/audiences.ts`, `components/AudienceSelector.tsx`.

Reorder to put `agents` first, leaving the rest in their current order: agents,
developers, enterprises, startups, data-centers.

Add an icon to each tab. These names are all verified present in the installed
`@phosphor-icons/react`, and none of them collide with the twelve icons already
used in the catalog section:

| Audience id | Icon |
| --- | --- |
| `agents` | `RobotIcon` |
| `developers` | `CodeIcon` |
| `enterprises` | `BuildingsIcon` |
| `startups` | `RocketLaunchIcon` |
| `data-centers` | `CpuIcon` |

`CodeIcon` rather than `BracketsCurlyIcon` and `CpuIcon` rather than
`HardDrivesIcon`, because those two are already used by Synapse SDK and archival
storage.

Icons resolve inside the client component from a map keyed by audience id, per
the client-boundary rule. Use plain `Icon` at 20 to 24px, sitting left of the
label. Do not use `IconBadge`, which is too heavy for a compact list. Check the
mobile layout, where these tabs are horizontal pills.

---

## Item 7 — Four-way navigation IA

**Files:** `apps/filecoin-site/src/app/_components/Navigation/constants/navigation.ts`,
both translation files.

Replace the current top-level nav with **Products, Solutions, Network,
Resources**, each a dropdown in the existing style. Mobile and footer mirror the
same four-way structure.

### The shape

```ts
type NavigationMenuItem = {
  label: string
  items: Array<{ title: string; links: Array<{ label: string; href: string; description: string }> }>
}
```

Each `items` entry renders as one column in the dropdown, with a divider between
columns. **Every link needs a description.** Within a column, links go into a
two-row grid sized by `floor(count / 2)` columns, so even counts lay out cleanly
and odd counts leave a ragged column. Choose column groupings with that in mind.

### Products

Use the catalog's own five groups as the five columns, built from the
`data/products.ts` registry created in item 4, so the nav and the homepage
section can never drift:

| Column | Links |
| --- | --- |
| Storage | Warm Storage, Archival storage, Filecoin Pin |
| Retrieval and delivery | Filecoin Beam, IPFS retrieval |
| Payments | Filecoin Pay, USDFC |
| Developer tools | Synapse SDK, Smart contracts (FVM), Documentation |
| Managed services | Fil One, Akave Cloud, Lighthouse, CIDgravity, Storacha |

Reuse the hrefs already in the registry. Products needs no placeholder links.

### Solutions

Six links, one column, or two columns of three:

Web3, Financial companies, Agents, Storage, Verification, IP Industry.

**These are the only entries with no destination.** Give each a unique inert
href, `#solutions-web3` and so on. Do **not** give them all the same `#`: the
renderers key list items off the href (`key={link.href}` in
`NavigationMenuPanel`, `key={href}` in `MobileNavigation`, `key={item.href}` in
`DesktopNavigation`), so identical hrefs produce duplicate React keys in three
places.

### Network

| Column | Links |
| --- | --- |
| Explore | Learn, Store Data, Provide Storage |
| Tools | the four block explorers, plus Network Status and Network Health |

Keep Store Data. Tools is where block explorer and network monitoring links
belong. All of these already exist as helper functions in `navigation.ts`
(`getBlockExplorerItems`, `getNetworkMonitoringItems`), so reuse them rather than
retyping the URLs.

### Resources

| Column | Links |
| --- | --- |
| Developers | reuse `getDeveloperResourcesItems` and `getContributeItems` |
| Community | reuse `getCommunityItems` |
| Blog | Blog |

### Copy volume

Roughly 28 links, each needing a label and a one-line description, in both
locales. Around 110 new strings. Keep descriptions to one short line. Mechanical,
but budget for it.

### Do not resolve this one alone

`/case-studies` is a real page and it is not covered by the four new menus. It
would become unreachable from the nav, though the homepage still links to it from
the use-case section. **Leave it out and flag it** in your summary rather than
inventing a home for it. Resources is the obvious candidate, but that is Gary's
call.

---

## Verifying your work

Run all four. None of them need credentials.

```bash
cd apps/filecoin-site
npx next typegen && npx tsc --noEmit          # typed routes need typegen first
npx eslint src --fix                           # import order is enforced
find "src/app/[locale]/(homepage)" -name '*.ts*' -print0 | xargs -0 npx prettier --write
```

Then look at the page in a browser at 390px, 1440px and 1920px. Check:

- No horizontal scroll at any width
- No console errors, other than a pre-existing `embla-carousel` warning about
  `settled`, which also occurs on untouched pages and is not yours
- Both tab groups still switch panels
- `/zh-cn` renders, which is where a missing translation key will surface

If you changed type sizes anywhere, prove they still match the rest of the site
by comparing computed sizes on `/` against `/store-data` at several widths. They
should be identical: root 16px throughout, h1 60/72 and h2 48/60 from 768px up.

---

## Regenerating and deploying the preview

The published preview is a generated snapshot, not source. It drifts unless you
regenerate it.

With the dev server running:

```bash
node preview/generate.mjs
```

That rewrites `preview/index.html` as one self-contained file: styles and images
inlined, both tab groups flattened with a small script to switch them, internal
links repointed at the live site, and a standalone head with `noindex`. It prints
the tab-group and image counts so you can sanity check it captured everything.

Then deploy, from the repository root:

```bash
npx vercel login                                  # first time only
npx vercel deploy preview --prod --yes
```

That prints the live URL. Every command needs the `npx` prefix unless Vercel CLI
is installed globally. Do not point Vercel at the repository root: it will detect
the Next.js app and fail on missing Tina Cloud credentials.

---

## Commit and push

Small commits, one per item or per closely related pair. Items 1 and 2 both touch
the hero and belong together. Items 4 and 7 share the product registry, so do 4
first.

```bash
git add -A
git commit    # see below
git push origin claude/filecoin-homepage-redesign-rua21u
```

The pre-commit hook fails on four pre-existing markdownlint errors in blog posts
that have nothing to do with this work, so `--no-verify` is expected. Say so in
your summary rather than fixing those posts.

Commit messages should say what changed and why, not just what. Note anything you
verified. End each with:

```
Co-Authored-By: Claude Sonnet <noreply@anthropic.com>
```

Pushing updates [PR #1](https://github.com/gmoranxyz/filecoin-io-website/pull/1).
Percy will report a large visual diff on the homepage snapshots. That is the
redesign, not a regression.

---

## Do not

- Change the root font size, or add responsive type steps beyond the site's
  existing scale. This was tried and reverted.
- Add copy to only `en.json`.
- Create pages, or make placeholder content real. Prototype only.
- Give several nav links the same `#` href.
- Restyle `ProductPill`, `Announcement`, `PageHeader` or `Heading`. Reuse them.
- Run `npm run build` to check your work. It needs Tina credentials. Use
  `next dev`.
- Resolve where `/case-studies` belongs in the new nav. Flag it.

## Report back with

1. What you changed, per item.
2. The verification output: typecheck, lint, and what you saw at each width.
3. Whether you regenerated the preview and redeployed, with the URL.
4. `/case-studies`, and anything else you had to leave for Gary.
