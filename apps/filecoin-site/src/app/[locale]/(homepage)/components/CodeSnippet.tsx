'use client'

import { CopyIcon } from '@phosphor-icons/react/dist/ssr'
import { clsx } from 'clsx'

import { CopyToClipboard } from '@filecoin-foundation/ui/CopyToClipboard'

export type CodeTokenTone =
  | 'plain'
  | 'keyword'
  | 'string'
  | 'comment'
  | 'identifier'
  | 'punctuation'

export type CodeToken = {
  text: string
  tone?: CodeTokenTone
}

export type CodeLine = Array<CodeToken>

type CodeSnippetProps = {
  filename: string
  language: string
  lines: Array<CodeLine>
}

const toneStyles: Record<CodeTokenTone, string> = {
  plain: 'text-zinc-200',
  keyword: 'text-brand-400',
  string: 'text-emerald-300',
  comment: 'text-zinc-500 italic',
  identifier: 'text-zinc-50',
  punctuation: 'text-zinc-400',
}

function getSnippetText(lines: Array<CodeLine>): string {
  return lines
    .map((line) => line.map((token) => token.text).join(''))
    .join('\n')
}

export function CodeSnippet({ filename, language, lines }: CodeSnippetProps) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-zinc-50/10 bg-zinc-900 shadow-2xl shadow-black/40">
      <figcaption className="flex items-center justify-between border-b border-zinc-50/10 px-5 py-3 text-sm text-zinc-400">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-zinc-700" />
            <span className="size-2.5 rounded-full bg-zinc-700" />
            <span className="size-2.5 rounded-full bg-zinc-700" />
          </span>
          <span className="ml-2 font-mono">{filename}</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="font-mono uppercase">{language}</span>
          <CopyToClipboard
            text={getSnippetText(lines)}
            notificationTitle="Copied to clipboard!"
            ariaLabel={`Copy ${filename} to clipboard`}
            icon={CopyIcon}
            tooltipDescription="Copy code"
          />
        </span>
      </figcaption>

      <pre className="overflow-x-auto p-5 font-mono text-sm/6.5 md:text-base/7">
        <code>
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="flex gap-5">
              <span
                aria-hidden="true"
                className="w-5 shrink-0 text-right text-zinc-600 select-none"
              >
                {lineIndex + 1}
              </span>
              <span className="whitespace-pre">
                {line.length === 0
                  ? '\n'
                  : line.map((token, tokenIndex) => (
                      <span
                        key={tokenIndex}
                        className={clsx(toneStyles[token.tone ?? 'plain'])}
                      >
                        {token.text}
                      </span>
                    ))}
                {line.length > 0 && '\n'}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}
