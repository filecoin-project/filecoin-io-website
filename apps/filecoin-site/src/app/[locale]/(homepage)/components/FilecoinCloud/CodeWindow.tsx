'use client'

import { useState } from 'react'

import { CheckIcon, CopyIcon, SparkleIcon } from '@phosphor-icons/react/dist/ssr'
import { clsx } from 'clsx'

import { Icon } from '@filecoin-foundation/ui-filecoin/Icon'

import type { CodeWindow as CodeWindowData } from '../../data/filecoinCloudCode'

import { highlightCode } from './highlightCode'

export function CodeWindow({
  filename,
  language,
  code,
  type = 'code',
}: CodeWindowData) {
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')
  const isPrompt = type === 'prompt'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code snippet', error)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3">
        <div className="flex items-center gap-3">
          {isPrompt ? (
            <span className="text-brand-500">
              <Icon component={SparkleIcon} size={16} weight="fill" />
            </span>
          ) : (
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </div>
          )}
          <span className="font-mono text-sm text-slate-400">{filename}</span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'rounded-md px-2 py-0.5 font-mono text-xs',
              isPrompt ? 'bg-brand-500/10 text-brand-400' : 'bg-white/5 text-slate-400',
            )}
          >
            {language}
          </span>
          <button
            type="button"
            aria-label={`Copy ${filename} to clipboard`}
            className="focus:brand-outline grid size-7 cursor-pointer place-items-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-50"
            onClick={handleCopy}
          >
            <Icon
              component={copied ? CheckIcon : CopyIcon}
              size={16}
              color={copied ? 'success' : 'inherit'}
            />
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? `Copied ${filename} to clipboard` : ''}
          </span>
        </div>
      </div>

      <pre className="px-5 py-5 font-mono text-sm/6">
        <code>
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="mr-5 w-4 shrink-0 select-none text-right text-slate-600">
                {index + 1}
              </span>
              <span
                dangerouslySetInnerHTML={{ __html: highlightCode(line) }}
                className={clsx(
                  'min-w-0 flex-1 wrap-anywhere whitespace-pre-wrap',
                  line === '' && 'h-6',
                )}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
