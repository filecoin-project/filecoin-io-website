// 首页文案（简体中文），与 ../home.ts 一一对应；数字、图标和 logo 沿用英文版。

import { localePath } from '@/i18n/locales'

import * as en from '@/data/home'
import type {
  AgentLogo,
  Feature,
  StartCard,
  UseCase,
  CostBar,
} from '@/data/home'
import { CONSOLE, CONTACT, DOCS, PARTNER, STORE } from '@/data/links'

const zh = (path: string) => localePath('zh-cn', path)

export const HERO = {
  announcement: {
    badge: '新',
    label: '现实世界资产已上链，背后的数据呢？',
    shortLabel: '现实世界资产已上链。',
    href: '/blog/Real-world-assets-are-onchain-What-about-the-data-behind-them',
  },
  title: ['保存互联网上', '最有价值的信息'],
  body: 'Filecoin 是全球最大的开放存储网络，让数据安全、自主可控。',
  primary: { label: '存储数据', href: zh(STORE), ref: 'home-hero-store-data' },
  secondary: { label: '预约通话', href: CONTACT, ref: 'home-hero-talk-sales' },
} as const

export const TRUSTED_BY: typeof en.TRUSTED_BY = {
  caption: '守护全球最重要数据的团队都在使用',
  partner: {
    prompt: '有意与 Filecoin 合作？',
    label: '与我们合作',
    href: PARTNER,
    ref: 'home-partner',
  },
  logos: en.TRUSTED_BY.logos,
}

export const NETWORK_CAPACITY = {
  title: '互联网级别的基础设施',
  value: en.NETWORK_CAPACITY.value,
  decimals: en.NETWORK_CAPACITY.decimals,
  unit: 'GB',
  caption: '网络存储容量',
} as const

export const COST_COMPARISON: {
  title: string
  body: string
  axisLabel: string
  max: number
  step: number
  bars: CostBar[]
} = {
  title: '同样的花费，存储 4.6 倍的数据',
  body: 'Filecoin 让你快速存储更多数据，无需担心成本。',
  axisLabel: '每 100 美元可存储的数据（TB）',
  max: en.COST_COMPARISON.max,
  step: en.COST_COMPARISON.step,
  bars: en.COST_COMPARISON.bars,
}

export const STORAGE_USE_CASES: {
  title: readonly string[]
  intro: string
  linkLabel: string
  steps: UseCase[]
} = {
  title: ['任何类型的数据', '都能存储'],
  intro: '以最适合你应用的方式访问和存储数据',
  linkLabel: '了解更多',
  steps: [
    {
      id: 'data-storage',
      title: '温存储',
      body: '存储数据集、AI 训练数据和视频库，按需检索。数据提供方还可以对数据集提供付费访问。',
      href: zh('/products/warm-storage'),
      ref: 'home-use-case-data-storage',
    },
    {
      id: 'backup-archives',
      title: '归档存储',
      body: '保存需要留存多年的备份、媒体档案和记录。',
      href: zh('/products/archival-storage'),
      ref: 'home-use-case-backup-archives',
    },
    {
      id: 'agent-storage',
      title: 'Agent',
      body: '让你的 Agent 发布它构建的成果、跨工具共享会话，并记录每一次操作。',
      href: zh('/products/agents'),
      ref: 'home-use-case-agent-storage',
    },
    {
      id: 'ipfs',
      title: 'IPFS',
      body: '把 IPFS 内容固定到 Filecoin。你的 CID、IPNS 名称和网关链接照常可用，并由可验证的存储提供支撑。',
      href: zh('/products/ipfs'),
      ref: 'home-use-case-ipfs',
    },
    {
      id: 'enterprise',
      title: '企业级',
      body: '来自 Fil One 的 S3 兼容对象存储。使用你已有的 S3 SDK 和 CLI，支持客户端加密和访问控制。',
      href: 'https://fil.one',
      ref: 'home-use-case-enterprise',
    },
  ],
}

export const MORE_FEATURES: { title: string; items: Feature[] } = {
  title: '你还能做更多',
  items: [
    {
      icon: '/assets/icons/features/media-hosting.svg',
      title: '媒体托管',
      body: '无论是你制作的视频还是 Agent 生成的视频，都能通过 Filecoin 轻松托管和分享',
    },
    {
      icon: '/assets/icons/features/agent-skills.svg',
      title: '技能与 MCP 服务器',
      body: '为你的 Agent 配备 Filecoin 技能、CLI 和 MCP 服务器，让它自己完成存储与分享。',
    },
    {
      icon: '/assets/icons/features/paid-access.svg',
      title: '付费数据访问',
      body: '在 Filecoin 上托管数据集并按访问收费，让你提供的数据自己创造收益。',
    },
    {
      icon: '/assets/icons/features/migrate-ipfs.svg',
      title: '从 IPFS 迁移',
      body: '一次性把大型 IPFS 归档迁移到 Filecoin。你的 CID 和链接照常可用',
    },
    {
      icon: '/assets/icons/features/sites-hosting.svg',
      title: '网站托管',
      body: '从落地页到静态前端，托管后即可通过公开链接分享。',
    },
    {
      icon: '/assets/icons/features/agent-sessions.svg',
      title: '共享 Agent 会话',
      body: '把 Agent 上下文存到 Filecoin，在不同模型和框架之间轻松取回。',
    },
  ],
}

export const STORAGE_PROVIDERS = {
  title: '全球的数据，由全球来存储',
  body: '在 Filecoin 上运行存储，为你托管的数据赚取奖励',
  cta: { label: '成为存储提供者', href: zh('/provide-storage') },
} as const

export const GET_STARTED = {
  title: '两步开始使用',
  account: {
    title: '创建账户',
    href: CONSOLE,
    ref: 'home-get-started-console',
    caption: '在 Filecoin 控制台注册并设置账户',
    image: {
      src: '/assets/illustrations/console-funds.svg',
      width: 620,
      height: 440,
      alt: 'Filecoin 控制台的资金概览：余额、可用资金以及存储已付费的时长',
    },
  },
  prompt: {
    title: '向你的 Agent 下达提示',
    caption: '支持 Claude、Cursor、Codex 等',
    label: 'Prompt',
    lines: [
      '安装 Filecoin Pin CLI，并把一个测试文件固定到 Filecoin。',
      '运行 npm install -g filecoin-pin@latest，然后运行 filecoin-pin payments setup，再创建一个文本文件并对它运行 filecoin-pin add。',
    ],
  },
} as const

export const AGENTS: { title: string; logos: AgentLogo[] } = {
  title: '支持你的所有 Agent',
  logos: en.AGENTS.logos,
}

/** 其他页面上的同一组卡片：页内锚点指回中文首页。 */
export const offHome = (cards: StartCard[]): StartCard[] =>
  cards.map((card) =>
    card.href?.startsWith('#')
      ? { ...card, href: `${zh('/')}${card.href}` }
      : card,
  )

export const START_CARDS: { title: string; body: string; cards: StartCard[] } =
  {
    title: '今天就开始构建',
    body: '阅读快速入门，几分钟内存储你的第一个文件；或者与我们的团队聊聊你的工作负载。',
    cards: [
      {
        icon: '/assets/icons/start/documentation.svg',
        title: '文档',
        body: '阅读快速入门指南',
        href: DOCS,
        ref: 'start-docs',
      },
      {
        icon: '/assets/icons/start/get-started.svg',
        title: '开始使用',
        body: '几分钟内存储你的文件',
        href: zh(STORE),
        ref: 'start-store-data',
      },
      {
        icon: '/assets/icons/start/talk-to-sales.svg',
        title: '联系销售',
        body: '与我们交流，找到最合适的方案',
        href: CONTACT,
        ref: 'start-talk-sales',
      },
    ],
  }
