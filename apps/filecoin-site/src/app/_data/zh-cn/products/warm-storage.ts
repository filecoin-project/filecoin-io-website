// “温存储”页文案（简体中文），与 ../../products/warm-storage.ts 一一对应。

import { localePath } from '@/i18n/locales'

import type { CostBar } from '@/data/home'
import { CONTACT, DOCS, START_BUILDING } from '@/data/links'
import type { CodeExample } from '@/data/products/data-storage'
import * as en from '@/data/products/warm-storage'
import { GET_STARTED as HOME_GET_STARTED } from '@/data/zh-cn/home'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

export const PATH = localePath('zh-cn', '/products/warm-storage')
export const TITLE = '温存储'

const AGENT_PROMPT = HOME_GET_STARTED.prompt

export const HERO = {
  title: ['日常存储，', '为常读数据而建'],
  body: '让文件、数据集和媒体保持在线、随时可取，且不被单一提供者锁定。',
  primary: {
    label: '开始构建',
    href: START_BUILDING,
    ref: 'data-storage-start-building-hero',
  },
  secondary: {
    label: '预约通话',
    href: CONTACT,
    ref: 'data-storage-talk-sales-hero',
  },
} as const

export const BUILT_FOR: { title: string; body: string; cards: FeatureCard[] } =
  {
    title: '为经常读写的数据而建',
    body: '温存储让你的文件保持在线、随时可用，内置完整性检查，不锁定于单一提供者。',
    cards: [
      {
        art: 'addressed-by-content',
        title: '随时带走',
        body: '每个文件都有内容标识（CID）。同样的数据始终有同样的 ID，所以你可以在提供者之间迁移，无需重新上传或重新链接。',
      },
      {
        art: 'intact-by-design',
        title: '确认未被篡改',
        body: '我们定期检查提供者，确认他们仍完整保存着你存入的数据。文件一旦变化，ID 就不再匹配。',
      },
      {
        art: 'replicated-across-providers',
        title: '从任意提供者检索',
        body: '按内容 ID 从任何持有你数据的提供者获取。需要分发网络时，可加上可选的 CDN 层。',
      },
    ],
  }

export const INTEGRATE: {
  title: string
  body: string
  examples: CodeExample[]
  docs: { label: string; href: string; ref?: string }
} = {
  title: '使用温存储的三种方式',
  body: '选择最适合你工作方式的一种：命令行、你自己的代码，或你的 Agent。',
  examples: [
    {
      id: 'cli',
      label: 'CLI',
      body: '从命令行',
      icon: 'terminal',
      code: [
        [
          { text: 'npm', accent: true },
          { text: ' install -g filecoin-pin@latest' },
        ],
        [{ text: 'filecoin-pin', accent: true }, { text: ' add ./photo.jpg' }],
      ],
      docs: {
        label: '文档',
        href: 'https://docs.filecoin.io/build-on-filecoin/cookbook/filecoin-pin/getting-started',
        ref: 'data-storage-example-docs',
      },
    },
    {
      id: 'sdk',
      label: 'SDK',
      body: '使用 Filecoin SDK，在你自己的代码中',
      icon: 'code',
      code: [
        [
          { text: 'const', accent: true },
          { text: ' { pieceCid } = await filecoin.storage.upload(file)' },
        ],
      ],
    },
    {
      id: 'agents',
      label: 'Agent',
      body: AGENT_PROMPT.caption,
      icon: 'robot',
      code: [],
      prompt: { label: AGENT_PROMPT.label, lines: AGENT_PROMPT.lines },
    },
  ],
  docs: { label: '文档', href: DOCS, ref: 'data-storage-docs' },
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
  title: '少付 78%，存更多',
  body: '独立提供者为你的数据存储相互竞争，所以你付得更少。',
  axisLabel: '美元 / TB / 月',
  unit: '美元每 TB 每月',
  valueHeading: '美元每 TB 每月',
  max: en.PRICING.max,
  step: en.PRICING.step,
  bars: en.PRICING.bars,
}

export const CLOSING = {
  title: ['数据始终属于你，', '无论存在哪里'],
  primary: {
    label: '开始构建',
    href: START_BUILDING,
    ref: 'data-storage-start-building-closing',
  },
  secondary: {
    label: '预约通话',
    href: CONTACT,
    ref: 'data-storage-talk-sales-closing',
  },
} as const
