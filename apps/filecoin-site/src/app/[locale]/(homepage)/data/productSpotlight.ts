import type { TranslationFunction } from '@/i18n/types'

import type { CodeLine } from '../components/CodeSnippet'

// PLACEHOLDER — illustrative snippet, not a verified working example.
// Signals "developer-friendly" per the wireframe; swap for the real quickstart
// once the unified developer journey (workstream 3) lands.
// Verified against Synapse SDK 2.0.0's published API (design review, round 1,
// item 5b): `Synapse.create` takes a viem account + transport, not a raw
// private key and RPC URL; `download` takes an options object.
export function getSpotlightSnippet(t: TranslationFunction): Array<CodeLine> {
  return [
    [
      { text: 'import', tone: 'keyword' },
      { text: ' { Synapse } ', tone: 'plain' },
      { text: 'from', tone: 'keyword' },
      { text: " '@filoz/synapse-sdk'", tone: 'string' },
    ],
    [
      { text: 'import', tone: 'keyword' },
      { text: ' { calibration } ', tone: 'plain' },
      { text: 'from', tone: 'keyword' },
      { text: " '@filoz/synapse-core/chains'", tone: 'string' },
    ],
    [
      { text: 'import', tone: 'keyword' },
      { text: ' { privateKeyToAccount } ', tone: 'plain' },
      { text: 'from', tone: 'keyword' },
      { text: " 'viem/accounts'", tone: 'string' },
    ],
    [
      { text: 'import', tone: 'keyword' },
      { text: ' { http } ', tone: 'plain' },
      { text: 'from', tone: 'keyword' },
      { text: " 'viem'", tone: 'string' },
    ],
    [],
    [
      {
        text: `// ${t('spotlight.snippet.credentialsComment')}`,
        tone: 'comment',
      },
    ],
    [
      { text: 'const', tone: 'keyword' },
      { text: ' account = ', tone: 'plain' },
      { text: 'privateKeyToAccount', tone: 'identifier' },
      { text: '(process.env.FILECOIN_PRIVATE_KEY)', tone: 'punctuation' },
    ],
    [
      { text: 'const', tone: 'keyword' },
      { text: ' synapse = ', tone: 'plain' },
      { text: 'await', tone: 'keyword' },
      { text: ' Synapse.', tone: 'plain' },
      { text: 'create', tone: 'identifier' },
      { text: '({', tone: 'punctuation' },
    ],
    [{ text: '  account,', tone: 'plain' }],
    [
      { text: '  chain: ', tone: 'plain' },
      { text: 'calibration', tone: 'identifier' },
      { text: ',', tone: 'punctuation' },
    ],
    [
      { text: '  transport: ', tone: 'plain' },
      { text: 'http', tone: 'identifier' },
      { text: '(),', tone: 'punctuation' },
    ],
    [{ text: '})', tone: 'punctuation' }],
    [],
    [{ text: `// ${t('spotlight.snippet.uploadComment')}`, tone: 'comment' }],
    [
      { text: 'const', tone: 'keyword' },
      { text: ' { pieceCid } = ', tone: 'plain' },
      { text: 'await', tone: 'keyword' },
      { text: ' synapse.storage.', tone: 'plain' },
      { text: 'upload', tone: 'identifier' },
      { text: '(bytes)', tone: 'punctuation' },
    ],
    [],
    [{ text: `// ${t('spotlight.snippet.retrieveComment')}`, tone: 'comment' }],
    [
      { text: 'const', tone: 'keyword' },
      { text: ' bytes = ', tone: 'plain' },
      { text: 'await', tone: 'keyword' },
      { text: ' synapse.storage.', tone: 'plain' },
      { text: 'download', tone: 'identifier' },
      { text: '({ pieceCid })', tone: 'punctuation' },
    ],
  ]
}

// PLACEHOLDER — illustrative prompt, not tied to a specific agent product.
// Plain text, one token per line: no syntax colouring for a natural-language
// prompt (design review, round 1, item 5c).
export function getSpotlightAgentPrompt(
  t: TranslationFunction,
): Array<CodeLine> {
  return t
    .raw('spotlight.snippet.agentPrompt')
    .split('\n')
    .map((line: string) => [{ text: line }])
}

export type SpotlightFeature = {
  title: string
  description: string
}

export function getSpotlightFeatures(
  t: TranslationFunction,
): Array<SpotlightFeature> {
  return [
    {
      title: t('spotlight.features.warmStorage.title'),
      description: t('spotlight.features.warmStorage.description'),
    },
    {
      title: t('spotlight.features.retrieval.title'),
      description: t('spotlight.features.retrieval.description'),
    },
    {
      title: t('spotlight.features.payments.title'),
      description: t('spotlight.features.payments.description'),
    },
  ]
}
