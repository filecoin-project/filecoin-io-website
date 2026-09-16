export type CodeWindow = {
  filename: string
  language: string
  code: string
  type?: 'code' | 'prompt'
}

export const filecoinCloudCodeWindows: Array<CodeWindow> = [
  {
    filename: 'store.ts',
    language: 'TS',
    type: 'code',
    code: `import { Synapse } from '@filoz/synapse-sdk'
import { calibration } from '@filoz/synapse-core/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { http } from 'viem'

// Get credentials from your developer dashboard
const account = privateKeyToAccount(process.env.FILECOIN_PRIVATE_KEY)
const synapse = await Synapse.create({
  account,
  chain: calibration,
  transport: http(),
})

// Store a file, get back its content identifier
const { pieceCid } = await synapse.storage.upload(bytes)

// Retrieve it from any provider with a valid proof
const bytes = await synapse.storage.download({ pieceCid })`,
  },
  {
    filename: 'prompt.txt',
    language: 'PROMPT',
    type: 'prompt',
    code: 'Build with the Synapse SDK: read https://filecoin.cloud/skills/synapse-sdk.md and follow it.',
  },
]
