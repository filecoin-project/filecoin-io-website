import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import matter from 'gray-matter'

const root = resolve(import.meta.dirname, '..')
const changed = readFileSync(0, 'utf8')
  .split('\0')
  .filter(
    (path) =>
      path.startsWith('apps/filecoin-site/content/') && path.endsWith('.md'),
  )

if (changed.length === 0) {
  console.log('No changed content Markdown files')
  process.exit(0)
}

const errors = []
const warnings = []
const allowedCategories = new Set(['updates', 'interviews', 'awards', 'events'])

function error(file, message) {
  errors.push(`${file}: ${message}`)
  console.error(`::error file=${file}::${message}`)
}

function warning(file, message) {
  warnings.push(`${file}: ${message}`)
  console.warn(`::warning file=${file}::${message}`)
}

for (const file of changed) {
  const text = readFileSync(resolve(root, file), 'utf8')
  if (
    !text.startsWith('---\n') ||
    !/^---\r?\n[\s\S]*?\r?\n---\r?\n/.test(text)
  ) {
    error(file, 'Add valid YAML frontmatter between two --- lines')
    continue
  }

  let document
  try {
    document = matter(text)
  } catch (cause) {
    error(file, `Invalid YAML frontmatter: ${cause.message}`)
    continue
  }

  const data = document.data
  if (!String(data.title ?? '').trim()) error(file, 'Add a title')

  if (file.includes('/blog/posts/')) {
    if (!String(data.excerpt ?? '').trim())
      error(file, 'Add an excerpt for the article card and metadata')
    if (!data.date || Number.isNaN(Date.parse(String(data.date))))
      error(file, 'Add a valid publication date')
    if (!document.content.trim()) error(file, 'Add article body text')
    if (
      data.categories !== undefined &&
      (!Array.isArray(data.categories) ||
        data.categories.some((item) => !allowedCategories.has(item)))
    ) {
      error(
        file,
        'Use only TinaCMS categories: updates, interviews, awards, events',
      )
    }
    if (String(data.excerpt ?? '').length > 180)
      warning(
        file,
        'Excerpt exceeds 180 characters; review its appearance in previews',
      )
    if (data.image?.url && !String(data.image.alt ?? '').trim())
      warning(
        file,
        'Add useful alt text for the header image, or confirm it is decorative',
      )
  }

  for (const [field, value] of [
    ['share_image', data.share_image],
    ['image.url', data.image?.url],
  ]) {
    if (typeof value === 'string' && value.startsWith('/')) {
      const publicRoot = resolve(root, 'apps/filecoin-site/public')
      const asset = resolve(publicRoot, value.slice(1))
      if (!asset.startsWith(`${publicRoot}/`) || !existsSync(asset)) {
        error(file, `${field} points to a missing or invalid local asset: ${value}`)
      }
    }
  }

  if (
    /\]\(\s*<?(?:javascript|data):/i.test(document.content) ||
    /<\s*script\b/i.test(document.content) ||
    /\bon\w+\s*=/i.test(document.content)
  ) {
    error(file, 'Remove executable links, script tags, or HTML event handlers')
  }
}

console.log(
  `Checked ${changed.length} changed content files: ${errors.length} errors, ${warnings.length} warnings`,
)
if (errors.length) process.exit(1)
