# Homepage redesign — decision log

Part of the Filecoin Brand & Web Realignment (workstream 2, Website Consolidation).
Goal: reprioritise the filecoin.io homepage from educating a broad audience to
selling products to developers, enterprises, and data-service providers.

Reference layout: column.com. Visual language: existing filecoin.io / `ui-filecoin`.
Wireframe: FigJam "Home page wireframe" (post-it IA, sections 1–7 below).

## Status

| Area | State |
| --- | --- |
| Layout and components | Built — `apps/filecoin-site/src/app/[locale]/(homepage)` |
| Copy | **Placeholder.** Every string under the `/` namespace in `en.json` / `zh-cn.json` is a draft for design review. |
| Figures | **Placeholder.** See inventory below. |
| Quotes | **Placeholder.** No real attributions; every `[Name], [Title]` must be replaced or the quote removed. |
| Links | Interim. Core-product links go to filecoin.cloud / docs until `/products/*` pages exist (deliverable 1). |
| Nav / IA | Unchanged. Deliverable 1 (Product / Solutions / Network / Resources) is separate. |

## Wireframe → implementation map

| # | Wireframe section | Column.com analogue | Implementation | Reused | New |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero: intro, sign-up/docs CTA, logos | "Trusted at scale" eyebrow, two-tone headline, stat row | `HeroSection` + `LogoSection` | `PageSection`, `Badge`, `Button`, `ButtonRow`, `LogoSection`, `GradientOverlay`, existing hero image | Two-tone `h1` (page-heading styles inline; `Heading` only accepts a plain string) |
| 2 | Proof / evidence: numbers | Four-up stat row under hero | `StatsRow` | `SectionContent` | `StatsRow` (dl-based, 2→4 cols) |
| 3 | Real use cases: user, products, testimonial | Logo tabs (Brex / Mercury / Ramp…) + quote + product UI | `UseCaseShowcase` (client, Headless UI `TabGroup`) | `Badge`, `CTALink`, `Heading` | `UseCaseShowcase` |
| 4 | Products: description + code snippet | Dark "Payments products" section with curl snippet | `ProductSpotlight` + `CodeSnippet` | `Heading`, `Button`, `Icon` | `CodeSnippet` (token-array based, no highlighter dep) |
| 5 | Use cases: ICPs | Vertical ICP list, active item highlighted | `AudienceSelector` (client, Headless UI `TabGroup`, vertical on lg+) | `Button`, `Heading`, `Icon` | `AudienceSelector` |
| 6 | Products: full list | "Building blocks…" grouped chips | `ProductCatalog` | `BaseLink`, `Heading`, `Icon` | `ProductCatalog` + `ProductPill` |
| 7 | Get started CTA | Final CTA band | `SectionContent` centred + two `Button`s | all | none |

Dropped from the old homepage (not in the wireframe): Filecoin-vs-cloud comparison
table, "reshaping data" essay, IPFS section, "build for the future", latest news,
community grid. Files removed: `ComparisonTable/`, `MetricCard`, and their data.
Blog and community remain reachable from the nav and footer.

## Section rhythm

dark hero → dark logos → gray stats → light use cases → dark spotlight → light
audiences → gray catalog → dark CTA. Alternation follows the existing site.

## Placeholder inventory (must be resolved before launch)

| Item | Where | Current value | Needs |
| --- | --- | --- | --- |
| Storage capacity | `data/proofStats.ts` | 1.95 EiB (carried over, early 2026) | Re-pull |
| Orgs storing 1 TiB+ | `data/proofStats.ts` | 482 (carried over) | Re-pull |
| Proof success rate | `data/proofStats.ts` | 99.9% | **Unsourced.** Verify or replace with a different simple metric |
| Starting price | `data/proofStats.ts`, `audiences.startups` | $2.50 / TB / mo (from store-data FOC card) | Confirm still current |
| Customer quotes ×6 | `useCases.*.quote/attribution` | Invented, bracketed attribution | Approved quotes or remove the quote block |
| Product names | `products.*` | Warm Storage, Filecoin Pin, Filecoin Beam, Filecoin Pay, Synapse SDK, USDFC | Confirm against final product architecture |
| Brand name | `hero.eyebrow`, `spotlight.*` | "Filecoin Cloud" (per brief: drop "Onchain") | Confirm — the live site and copy skill still say "Filecoin Onchain Cloud" |
| Code snippet | `data/productSpotlight.ts` | Illustrative Synapse SDK call | Swap for the real quickstart snippet |
| Product links | `data/productCatalog.ts` | filecoin.cloud / docs roots | Point at `/products/*` once built |
| Case-study links | `data/useCases.ts` | Akave, CIDgravity, Lighthouse → external; others → `/case-studies/*` | Akave / CIDgravity / Lighthouse have no case study yet |
| Images | `data/useCases.ts`, `data/audiences.ts` | Existing stock graphics | Product UI screenshots (Column shows product UI, not stock) |
| zh-cn copy | `zh-cn.json` | AI-drafted | Human review (site already banners zh-cn as AI-translated) |

## Open questions

1. **Brand name.** Brief says fold Filecoin Onchain Cloud into "Filecoin Cloud" and drop "Onchain". Is that decided, or pending the Propaganda approval (Sep 14–18)? Copy currently uses "Filecoin Cloud".
2. **Primary CTA target.** "Start building" points at docs.filecoin.cloud until docs migrate. Should it instead go to a developer dashboard / sign-up (Propaganda's "Pricing (Developer Dashboard)")? Does one exist yet?
3. **Fil One in the hero.** Fil One is "discovery → qualified handoff". It is currently only in the catalog and the Enterprise ICP. Should it get hero or spotlight presence?
4. **Vocabulary.** Propaganda recommends retiring crypto vocabulary (decentralized → distributed, onchain → auditable, permissionless → open). Copy follows the current house style (onchain, decentralized). Adopt the new vocabulary now or after approval?
5. **Blog / news on the homepage.** Wireframe omits it. Confirm we drop "Latest news" and "Join the community" from the homepage entirely.
6. **Use-case roster.** Wireframe lists Akave, CIDgravity, Starling, Flickr, Internet Archive, Lighthouse. Three are ecosystem products (Akave, CIDgravity, Lighthouse) and three are end customers. Column shows end customers only. Keep the mix?
7. **Proof metrics.** Which four numbers? Current picks: capacity, 1 TiB+ orgs, proof success, starting price. "Uptime" was suggested but the network has no single uptime figure.
8. **Metadata.** New `<title>`/description are placeholder; SEO owner to sign off (this page carries the site's search authority).

## Type scale

The homepage uses the site's existing type scale unchanged: `Heading` variants
from `ui-filecoin` (`page-heading`, `section-heading`, `card-heading`) and the
same body sizes as other sections. Verified identical to `/store-data` at 390,
768, 1024, 1440, 1920 and 2560px: same root size, same h1, h2 and section
description sizes at every breakpoint.

An earlier revision of this branch ramped the root font-size on viewports above
1536px so type grew on large monitors. It was reverted: it made the homepage
inconsistent with the rest of filecoin.io, and tuning it blind produced type
that read too small at one width and too large at another. If wide-viewport
scale is revisited, it should change the shared scale in `ui-filecoin` for the
whole site rather than one stylesheet.

## Process notes

- Every placeholder is grep-able: `rg -n "PLACEHOLDER" apps/filecoin-site/src/app/\[locale\]/\(homepage\)`.
- Copy lives only in `en.json` / `zh-cn.json` under `/`; components never hard-code strings.
- Data (figures, links, images) lives in `(homepage)/data/*.ts`; each file has a header comment stating what is placeholder.
- Cypress `home.cy.ts` reads metadata from the translation files, so it keeps passing as copy changes. Percy will flag the visual diff on the first PR; that is expected.
