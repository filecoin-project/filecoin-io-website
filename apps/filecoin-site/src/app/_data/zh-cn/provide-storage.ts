// “提供存储”页文案（简体中文），与 ../provide-storage.ts 一一对应。

import { localePath } from '@/i18n/locales'

import { PROVIDER_FORM } from '@/data/links'
import type { Point, ProviderLogo } from '@/data/provide-storage'
import * as en from '@/data/provide-storage'

const zh = (path: string) => localePath('zh-cn', path)

export const PATH = zh('/provide-storage')
export const TITLE = '提供存储'

export const GETTING_STARTED_DOCS = en.GETTING_STARTED_DOCS
export const AGENT_QUICKSTART = en.AGENT_QUICKSTART

export const LEARN = { label: '了解如何提供存储', href: GETTING_STARTED_DOCS }
export const START = { label: '任意规模起步', href: AGENT_QUICKSTART }
export const TALK = { label: '联系我们的团队', href: zh(PROVIDER_FORM) }

export const HERO = {
  title: ['驱动全球最大的去中心化存储网络'],
  body: '在去中心化存储的未来中扮演关键角色。成为 Filecoin 存储提供者，为这个守护人类最重要信息的全球系统贡献容量。',
  primary: LEARN,
  secondary: TALK,
  image: {
    src: '/assets/images/colorful-nebula.webp',
    alt: '深空中一片绚丽多彩的星云，在布满星辰的深色背景上闪耀着紫色、粉色、绿色和金色的光芒。',
  },
} as const

export const PROVIDERS: { title: string; logos: ProviderLogo[] } = {
  title: '加入全球存储提供者网络',
  logos: en.PROVIDERS.logos,
}

export const PDP: {
  title: string
  body: string
  points: Point[]
  note: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
} = {
  title: '开始使用 PDP 存储',
  body: '使用数据持有证明（PDP）运行温存储节点，是开始提供 Filecoin 存储最简单的方式——不需要昂贵的硬件，也不需要长期抵押。',
  points: [
    {
      icon: 'cube',
      title: '最低的硬件成本',
      body: '温存储对基础设施要求极低，只需基本的计算和磁盘资源就能开始提供存储。',
    },
    {
      icon: 'rocket',
      title: '成为存储提供者的最快路径',
      body: '设置简单，无需封装硬件，快速上线——非常适合测试、学习和接入你的第一批客户。',
    },
    {
      icon: 'user-plus',
      title: '适合新运营者和小型团队',
      body: '无需管理复杂的流水线或大规模硬件，即可运营可靠、无需许可的存储服务。',
    },
  ],
  note: '无论你是个人运营者还是企业数据中心，Filecoin 都为你提供了起步的路径。',
  primary: START,
  secondary: {
    label: '了解更多 PDP 存储',
    href: 'https://docs.filecoin.io/storage-providers/pdp',
  },
}

export const SCALING: {
  title: string
  body: string
  points: Point[]
  link: { label: string; href: string }
} = {
  title: '扩展你的存储运营',
  body: '如果你已经在运行温存储节点并希望扩展，Filecoin 支持复制证明（PoRep）和时空证明（PoSt）等企业级证明，实现高容量、生产级的存储运营。扩展涉及：',
  points: [
    {
      icon: 'cpu',
      title: '专用封装硬件（CPU/GPU）',
      body: '为可靠、大规模处理封装工作负载而设计的高性能机器。',
    },
    {
      icon: 'gauge',
      title: '高性能存储流水线',
      body: '优化的数据通路，保持稳定的吞吐量和热性能。',
    },
    {
      icon: 'lock',
      title: '分布式封装系统',
      body: '借助联网的工作节点和生产级工具，运行并行化的封装工作流。',
    },
    {
      icon: 'handshake',
      title: 'Filecoin 解决方案架构师的深度支持',
      body: '在架构、扩展策略和大规模部署最佳实践方面获得专家指导。',
    },
  ],
  link: {
    label: '了解更多要求',
    href: 'https://docs.filecoin.io/storage-providers/architecture/lotus-components',
  },
}

export const HELP = {
  title: ['需要帮助选择', '合适的架构？'],
  body: '我们的团队可以为你讲解 PoRep 要求、推荐硬件、封装流水线和运营最佳实践。',
  cta: TALK,
} as const
