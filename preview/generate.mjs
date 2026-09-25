#!/usr/bin/env node
/**
 * Regenerate preview/index.html from a running dev server.
 *
 *   cd apps/filecoin-site && npx next dev --webpack -p 3100    # in one terminal
 *   node preview/generate.mjs                                  # in another
 *
 * Produces one self-contained HTML file: stylesheets and images inlined, both
 * tab groups flattened into the document with a small vanilla script to switch
 * them, internal links repointed at the live site, and a standalone <head> with
 * charset, viewport and noindex.
 *
 * Playwright is not a dependency of this repo. Install it where convenient:
 *   npm i -g playwright && playwright install chromium
 *
 * Options:
 *   --url   dev server origin        (default http://localhost:3100)
 *   --out   output file              (default preview/index.html)
 *   --live  origin for internal hrefs (default https://filecoin.io)
 */

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  const v = argv[i + 1]
  return v === undefined || v.startsWith('--') ? fallback : v
}

const BASE = flag('url', 'http://localhost:3100').replace(/\/$/, '')
const OUT = resolve(HERE, '..', flag('out', 'preview/index.html'))
const LIVE = flag('live', 'https://filecoin.io').replace(/\/$/, '')

async function loadChromium() {
  // A global install resolves to a CommonJS entry, where the named exports sit
  // under `default`, so check both shapes.
  const pick = (mod) => mod?.chromium ?? mod?.default?.chromium

  try {
    const found = pick(await import('playwright'))
    if (found) return found
  } catch {
    /* not a dependency of this repo; try a global install */
  }

  // `npm root -g` covers Windows and macOS installs the fixed paths miss.
  let npmRoot = []
  try {
    npmRoot = [execSync('npm root -g', { encoding: 'utf8' }).trim()]
  } catch {
    /* npm not on PATH; fall back to the fixed paths */
  }

  for (const base of [
    ...npmRoot,
    '/opt/node22/lib/node_modules',
    '/usr/lib/node_modules',
    '/usr/local/lib/node_modules',
  ]) {
    try {
      const req = createRequire(`${base}/`)
      const entry = pathToFileURL(req.resolve('playwright')).href
      const found = pick(await import(entry))
      if (found) return found
    } catch {
      /* try the next one */
    }
  }

  throw new Error(
    'Could not load Playwright. Install it with:\n  npm i -g playwright && playwright install chromium',
  )
}

const chromium = await loadChromium()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

console.log(`Capturing ${BASE}/ …`)
await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 180000 })

// Scroll the whole page so every lazy image and carousel has loaded.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 100))
  }
  window.scrollTo(0, 0)
})
await page.waitForLoadState('networkidle')

// Headless UI mounts only the selected tab panel, so click through each tab and
// keep its markup. Only div panels are real; the spans are placeholders.
const tablists = page.locator('[role="tablist"]')
const groupCount = await tablists.count()
const groupPanels = []
for (let g = 0; g < groupCount; g++) {
  const tabs = tablists.nth(g).locator('[role="tab"]')
  const count = await tabs.count()
  const panels = []
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click()
    await page.waitForTimeout(300)
    panels.push(
      await tablists
        .nth(g)
        .evaluate((tl) => tl.parentElement.querySelector('div[role="tabpanel"]').outerHTML),
    )
  }
  await tabs.nth(0).click()
  await page.waitForTimeout(300)
  // Drop focus so the re-serialized first panel matches its resting state.
  await page.mouse.click(5, 5)
  await page.waitForTimeout(200)
  panels[0] = await tablists
    .nth(g)
    .evaluate((tl) => tl.parentElement.querySelector('div[role="tabpanel"]').outerHTML)
  await tablists.nth(g).evaluate((tl) => tl.setAttribute('data-snapshot-tabs', ''))
  groupPanels.push(panels)
}

await page.evaluate(() => {
  document
    .querySelectorAll('script, noscript, nextjs-portal, next-route-announcer, template')
    .forEach((n) => n.remove())
})

const cssHrefs = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
)
let css = await page.evaluate(() =>
  [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n'),
)
for (const href of cssHrefs) css += '\n' + (await (await page.request.get(BASE + href)).text())

const htmlClass = await page.evaluate(() => document.documentElement.className)
const bodyClass = await page.evaluate(() => document.body.className)
let body = await page.evaluate(() => document.body.innerHTML)

// Splice the captured panels in as strings, so React never sees the mutation.
for (const panels of groupPanels) {
  const first = panels[0]
  if (!body.includes(first)) throw new Error('First tab panel not found in the serialized body')
  body = body.replace(first, first + panels.slice(1).map((p) => p.replace(/^<div/, '<div hidden=""')).join(''))
}
body = body.replace(/<span[^>]*role="tabpanel"[^>]*><\/span>/g, '')

const cache = new Map()
async function dataUri(url) {
  if (cache.has(url)) return cache.get(url)
  const res = await page.request.get(url.startsWith('http') ? url : BASE + url)
  const type = res.headers()['content-type']?.split(';')[0] || 'application/octet-stream'
  const value = `data:${type};base64,${(await res.body()).toString('base64')}`
  cache.set(url, value)
  return value
}

for (const m of [...new Set([...css.matchAll(/url\((["']?)(\/_next\/[^)"']+)\1\)/g)].map((x) => x[2]))]) {
  css = css.split(m).join(await dataUri(m))
}

let inlined = 0
for (const tag of new Set([...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]))) {
  const src = tag.match(/\ssrc="([^"]+)"/)?.[1]
  if (!src || src.startsWith('data:')) continue
  let url = src.replace(/&amp;/g, '&')
  if (url.includes('/_next/image')) {
    const u = new URL(url, BASE)
    u.searchParams.set('w', tag.includes('object-top') ? '1920' : '1200')
    url = u.pathname + u.search
  }
  const fixed = tag
    .replace(/\ssrc="[^"]+"/, ` src="${await dataUri(url)}"`)
    .replace(/\ssrcset="[^"]*"/, '')
    .replace(/\ssizes="[^"]*"/, '')
    .replace(/\sloading="lazy"/, '')
  body = body.split(tag).join(fixed)
  inlined++
}

body = body
  .replace(/href="\/(?!\/)/g, `href="${LIVE}/`)
  .replace(/<form\b/g, '<form onsubmit="return false"')

await browser.close()

const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="description" content="Design review snapshot of the filecoin.io homepage redesign. All copy, figures and quotes are placeholder.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#128451;</text></svg>">
<title>Filecoin Homepage Redesign</title>
<style>
body { margin: 0; background: #09090b; }
.snapshot-banner { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: 4px 24px; justify-content: space-between; padding: 8px 24px; font: 500 13px/1.4 system-ui, sans-serif; background: #0e385d; color: #d6f5ff; border-bottom: 1px solid #0090ff; }
.snapshot-banner a { color: #83eaff; }
${css}
</style>
</head>
<body>
<div class="snapshot-banner" role="note">
  <span><strong>Design review snapshot</strong> · filecoin.io homepage redesign · all copy, figures and quotes are placeholder</span>
  <span>Links open the live site · tabs are interactive</span>
</div>
<div class="${htmlClass} ${bodyClass}" style="font-size:16px">${body}</div>
<script>
document.querySelectorAll('[data-snapshot-tabs]').forEach(function (list) {
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'))
  var panels = Array.prototype.slice.call(list.parentElement.querySelectorAll('div[role="tabpanel"]'))
  function select(idx) {
    tabs.forEach(function (t, i) {
      var on = i === idx
      t.setAttribute('aria-selected', on ? 'true' : 'false')
      t.setAttribute('tabindex', on ? '0' : '-1')
      if (on) { t.setAttribute('data-selected', ''); t.setAttribute('data-headlessui-state', 'selected') }
      else { t.removeAttribute('data-selected'); t.setAttribute('data-headlessui-state', '') }
      if (panels[i]) panels[i].hidden = !on
    })
  }
  tabs.forEach(function (t, i) {
    t.setAttribute('type', 'button')
    t.addEventListener('click', function () { select(i) })
    t.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1
        : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0
      if (!d) return
      e.preventDefault()
      var n = (i + d + tabs.length) % tabs.length
      select(n)
      tabs[n].focus()
    })
  })
})
</script>
</body>
</html>
`

writeFileSync(OUT, doc)
console.log(
  `Wrote ${OUT}\n  ${(doc.length / 1048576).toFixed(2)} MB · ${groupCount} tab groups (${groupPanels
    .map((p) => p.length)
    .join(', ')} panels) · ${inlined} images inlined`,
)
