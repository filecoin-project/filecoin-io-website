# Homepage redesign preview

`index.html` is a **generated snapshot** of the rebuilt homepage, not source. It
is one self-contained file: styles, fonts and images are inlined, links point at
the live filecoin.io, and the two tab groups work as real controls.

It exists so the redesign can be shared as a plain URL without standing up the
whole Next.js app, which needs Tina Cloud credentials to build.

## Deploying it

Static. No build step, no environment variables, no framework.

### Fastest: one command, no dashboard

From the repository root, on a machine where you are signed into Vercel:

```bash
npx vercel deploy preview --prod --yes
```

That uploads the `preview` directory as its own Vercel project and prints the
live URL. `--yes` accepts the defaults, so there are no prompts. It ignores the
rest of the repository entirely, so the Next.js app and its Tina credentials
never enter the picture.

Re-run the same command to publish an updated snapshot.

If you are not signed in yet, run `npx vercel login` first.

### Alternative: from the dashboard, wired to git

Use this if you want every push to redeploy automatically.

1. Vercel, then Add New, then Project, then this repository.
2. Root Directory: `preview`
3. Framework Preset: Other. Leave Build Command empty.
4. Settings, then Git, then Production Branch: the branch carrying this file.

Step 2 is the one that matters. Left at the repository root, Vercel detects the
Next.js app instead and the build fails on missing Tina credentials. Step 4
matters because `main` does not carry this directory, so without it the
production URL serves nothing.

`vercel.json` sends `X-Robots-Tag: noindex` and `index.html` carries a matching
`robots` meta tag, so the preview will not be indexed. Both matter: filecoin.io's
search authority should not have to compete with a placeholder copy of its own
homepage.

Vercel deployments are public by default. Turn on Settings, then Deployment
Protection, if the link should require sign-in.

## Regenerating it

With a dev server running:

```bash
cd apps/filecoin-site && npx next dev --webpack -p 3100   # one terminal
node preview/generate.mjs                                  # another
```

`generate.mjs` inlines every asset, flattens both tab groups into the document
with a small script to switch them, repoints internal links at the live site and
writes a standalone head with `noindex`. It prints tab-group and image counts so
you can check it captured everything. Playwright is not a dependency of this
repo; install it with `npm i -g playwright && playwright install chromium`.

Regenerate after any homepage change, otherwise this file drifts from the code.

Verified at 1440px and 390px: no horizontal scroll, no console errors, both tab
groups switching.

## Content warning

Every headline, figure and quote is placeholder. The customer quotes are
invented text attributed to real organisations, marked `[Name], [Title]` where a
real attribution would go. Replace them before this page reaches anyone outside
the project.
