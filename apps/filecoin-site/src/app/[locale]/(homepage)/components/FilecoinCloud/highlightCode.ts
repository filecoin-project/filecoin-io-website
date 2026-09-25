const KEYWORDS = new Set([
  'import',
  'from',
  'const',
  'await',
  'async',
  'new',
  'function',
  'return',
  'export',
])

const TOKEN_PATTERN =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|([A-Za-z_$][\w$]*)/gm

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/**
 * Minimal, dependency-free highlighter for the short TS snippets shown in
 * the Filecoin Cloud code windows. Not a general-purpose tokenizer, and
 * intentionally only recognizes the handful of keywords used there.
 */
export function highlightCode(line: string): string {
  return line.replace(
    TOKEN_PATTERN,
    (match, comment: string, string: string, word: string) => {
      if (comment) return `<span class="text-slate-500">${escapeHtml(comment)}</span>`
      if (string) return `<span class="text-brand-300">${escapeHtml(string)}</span>`
      if (word && KEYWORDS.has(word))
        return `<span class="text-brand-500">${word}</span>`
      return escapeHtml(match)
    },
  )
}
