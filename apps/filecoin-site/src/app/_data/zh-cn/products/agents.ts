// “Filecoin 与 Agent”页文案（简体中文），与 ../../products/agents.ts 一一对应。

import { localePath } from '@/i18n/locales'

import type { StartCard } from '@/data/home'
import { CONTACT } from '@/data/links'
import { offHome, START_CARDS } from '@/data/zh-cn/home'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

const AGENTS_DOCS = 'https://docs.filecoin.io/core-concepts/filecoin-for-agents'

export const PATH = localePath('zh-cn', '/products/agents')
export const TITLE = 'Filecoin 与 Agent'

const SKILLS_REPO = 'https://github.com/filecoin-project/filecoin-skills'

export const HERO = {
  title: [
    {
      rotate: ['Agent 负责', 'Claude 负责', 'ChatGPT 负责', 'Grok 负责'],
      rest: '干活。',
    },
    'Filecoin 负责保存。',
  ],
  label: 'Agent 负责干活。Filecoin 负责保存。',
  body: '让你的 Agent 能够发布它构建的成果、跨会话共享上下文，并记录每一次操作。',
  primary: {
    label: '安装技能',
    href: SKILLS_REPO,
    ref: 'agent-skills-install',
  },
  secondary: {
    label: '阅读文档',
    href: AGENTS_DOCS,
    ref: 'agent-skills-read-docs',
  },
} as const

export const USES: { title: string; cards: FeatureCard[] } = {
  title: '为 Agent 使用 Filecoin 的三种方式',
  cards: [
    {
      art: 'publish-artifacts',
      title: '发布成果',
      body: '你的 Agent 能生成报告、仪表盘、落地页等各种成果；借助“发布”技能，你可以得到一个可分享给任何人的链接。',
      link: {
        label: '了解更多',
        href: AGENTS_DOCS,
        ref: 'agent-skills-uses-docs-1',
      },
    },
    {
      art: 'share-sessions',
      title: '共享会话',
      body: '切换模型或交接给队友？让 Agent 的上下文保持完整，随时随地都能接着用。',
      link: {
        label: '了解更多',
        href: AGENTS_DOCS,
        ref: 'agent-skills-uses-docs-2',
      },
    },
    {
      art: 'keep-a-record',
      title: '保留记录',
      body: '记录 Agent 做了什么、为什么做，形成防篡改的记录，可用于调试、治理或合规审查。',
      link: { label: '即将推出', soon: true },
    },
  ],
}

export const SKILLS = {
  title: '开始使用 Agent',
  body: '一个存储账户，三种接入方式',
  options: [
    {
      title: '技能',
      body: '现成的 Agent 技能，用于在 Filecoin 上存储和检索。可直接放进 Claude、ChatGPT 或任何支持技能的 Agent。',
      code: 'filecoin-project/filecoin-skills',
      link: {
        label: '在 GitHub 查看',
        href: SKILLS_REPO,
        ref: 'agent-skills-view-github',
      },
    },
    {
      title: 'CLI',
      body: '在任何 shell 中存储、检索、列出和删除文件与文件夹。每条命令输出一个 Agent 可据此行动的 JSON 结果。',
      code: 'filecoin put ./report.pdf',
      badge: '即将推出',
    },
    {
      title: 'MCP 服务器',
      body: '面向提供者、数据集、数据片段、支付通道和会话密钥的只读工具。把 Agent 指向一个端点即可，无需注册。',
      badge: '即将推出',
    },
  ],
} as const

export const START: StartCard[] = offHome(START_CARDS.cards)

export const TRAINING = {
  title: '在海量数据上训练模型？',
  body: '对于数据量超过 100 TB 的团队，我们可以为你的流水线搭建合适的方案以降低成本。',
  cta: { label: '与我们聊聊', href: CONTACT, ref: 'agent-skills-talk-sales' },
} as const
