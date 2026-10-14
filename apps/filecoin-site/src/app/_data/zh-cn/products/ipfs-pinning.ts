// IPFS 页文案（简体中文），与 ../../products/ipfs-pinning.ts 一一对应。

import { localePath } from '@/i18n/locales'

import type { CostBar, StartCard } from '@/data/home'
import { CONTACT } from '@/data/links'
import * as en from '@/data/products/ipfs-pinning'
import { offHome, START_CARDS } from '@/data/zh-cn/home'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

const zh = (path: string) => localePath('zh-cn', path)

export const PATH = zh('/products/ipfs')
export const TITLE = 'IPFS'

const MIGRATE_ID = 'migrate'
const MIGRATION_GUIDE = 'https://filecoin.cloud/ipfs2filecoin'

export const HERO = {
  title: ['IPFS 内容', '存储在 Filecoin 上'],
  body: 'Filecoin 存储提供者保存你的文件，你继续使用熟悉的 IPFS 工具。',
  primary: {
    label: '开始固定',
    href: 'https://docs.filecoin.io/build-on-filecoin/cookbook/filecoin-pin/getting-started',
  },
  secondary: { label: '从 IPFS 迁移', href: MIGRATION_GUIDE },
} as const

export const USES: { title: string; cards: FeatureCard[] } = {
  title: '在 Filecoin 上使用 IPFS 的三种方式',
  cards: [
    {
      art: 'pin-from-your-terminal',
      title: '从终端固定',
      body: '一条命令固定文件或文件夹。你会得到一个 CID，可从任何 IPFS 网关获取。',
      link: {
        label: '了解更多',
        href: 'https://docs.filecoin.io/build-on-filecoin/cookbook/filecoin-pin/getting-started',
      },
    },
    {
      art: 'pin-migrate-from-another-service',
      title: '从其他固定服务迁移',
      body: '一次性把整个归档迁移到 Filecoin。你的 CID 和链接照常可用。',
      link: { label: '了解更多', href: MIGRATION_GUIDE },
    },
    {
      art: 'pin-with-your-agents',
      title: '用你的 Agent 固定',
      body: '为 Agent 添加 Filecoin 技能，然后让它固定文件或文件夹。它会运行命令并把 CID 交还给你。',
      link: { label: '了解更多', href: zh('/products/agents') },
    },
  ],
}

export const PRICING: {
  title: string
  body: string
  axisLabel: string
  max: number
  step: number
  bars: CostBar[]
  unit: string
  valueHeading: string
} = {
  title: '比其他固定服务便宜 3 倍',
  body: '存储同样的固定数据，Filecoin 的成本不到固定服务商收费的三分之一。',
  axisLabel: '美元 / TB / 月',
  unit: '美元每 TB 每月',
  valueHeading: '美元每 TB 每月',
  max: en.PRICING.max,
  step: en.PRICING.step,
  bars: [
    { label: 'Filecoin', note: '（温存储）', value: 5, highlight: true },
    { label: 'Filebase', note: '（Pro 套餐）', value: 16 },
    { label: 'Pinata', note: '（Fiesta 套餐）', value: 35 },
    { label: 'Pinata', note: '（Picnic 套餐）', value: 70 },
  ],
}

export const MIGRATE = {
  sectionId: MIGRATE_ID,
  title: ['要迁移大型 IPFS 归档？'],
  body: '对于超过 500 GB 的归档，我们会帮你规划迁移，确保 CID 和链接不会失效。',
  primary: { label: '与我们聊聊', href: CONTACT },
} as const

export const START: StartCard[] = offHome(START_CARDS.cards)
