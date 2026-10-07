# filecoin-io-website

This repository contains the code and content for **only** [filecoin.io](https://filecoin.io). It was extracted from the [filecoin-foundation monorepo](https://github.com/FilecoinFoundationWeb/filecoin-foundation) — which continues to host the other sites (fil.org, ffdweb.org, uxit.fil.org) — and keeps the same layout and tooling: a Turborepo with npm [workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

## Overview

### Application

- [filecoin-site](apps/filecoin-site): The Filecoin website, live at [filecoin.io](https://filecoin.io). Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, TinaCMS, next-intl (`en`, `zh-cn`).

### Packages

The `packages` directory contains components, hooks, utility functions and configuration consumed by the application. These were vendored from the monorepo at extraction time and are owned by this repository — they do not sync back.

> [!NOTE]
> They are [just-in-time](https://turborepo.com/docs/core-concepts/internal-packages#just-in-time-packages) packages, meaning they are built by the application that uses them. The exception is `packages/ui-filecoin`, which has a build step (tsdown) and is vendored here temporarily until `@filecoin-foundation/ui-filecoin@0.9.1` is published to npm, at which point it should be consumed from npm instead.

## Getting Started

### Installation

```bash
git clone https://github.com/FilecoinFoundationWeb/filecoin-site.git
cd filecoin-site
npm install
```

> [!NOTE]
> We use `npx turbo <commands>` instead of relying on npm scripts or globally installed Turbo. This ensures the correct version defined in the project is used.

### Development

```bash
npx turbo filecoin-site#dev
```

### Building for production

```bash
npx turbo filecoin-site#build
```

The build runs `tinacms build` (requires `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`), generates the RSS feeds, then `next build`. Start the production server with `npx turbo filecoin-site#start`.

### Adding npm dependencies

Run install commands from the root of the repository with a workspace flag:

```bash
npm install <dependency> --workspace 'apps/filecoin-site'
```

We use [syncpack](https://www.npmjs.com/package/syncpack) to check and fix version mismatches across workspaces:

```bash
npm run check:versions
npm run fix:versions
```

`npm run check:versions` runs automatically as a pre-push hook via [husky](https://typicode.github.io/husky/).

## Development Guidelines

Content editors and reviewers: follow the [editorial review and merge guide](docs/editorial-review.md).

To maintain the quality and consistency of the codebase, contributors are encouraged to follow these practices.

### Component Organization

Reusable React components should be stored in the general `_components` directory. Page-specific components should live closer to the page they are used on.

### Component Exports

Use named exports for React components to maintain consistency and support efficient tree shaking.

### Naming Props

When defining props for components, explicitly name the props type rather than using a generic `Props` type. For example,

```typescript
type BadgeProps = {
  featured: boolean
  children?: string
}
```

### Paths and URLs

- **Centralized Paths**: Utilize the `PATHS` object for defining and accessing paths throughout the application. See `_constants/paths.ts`
- **Site Metadata and URLs**: Reference site metadata and URLs using centralized constants. See `_constants/siteMetadata.ts`

### Adding New Pages

When adding a new page to the project, please ensure the following:

1. **Update PATHS Configuration**: Ensure the `PATHS` object includes configurations for new content types, specifying paths, labels, and content directory paths. See `_constants/paths.ts`

2. **Metadata and SEO**: Each new page should have associated metadata and SEO tags defined via `createMetadata`:

   ```javascript
   export const metadata = createMetadata(seo, PATHS.ABOUT.path)
   ```

3. **Structured Data**: Include structured data for the new page using `generateWebPageStructuredData`, customized to the page's content.

4. **Testing**: Add Cypress tests verifying metadata and structured data on the new page.

5. **Updating the Sitemap**: When adding new dynamic content that isn't automatically included in the sitemap through static routing, update the sitemap with the new page's details.
