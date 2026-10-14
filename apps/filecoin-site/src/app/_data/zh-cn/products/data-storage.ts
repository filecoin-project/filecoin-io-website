// “存储数据”页文案（简体中文），与 ../../products/data-storage.ts 一一对应。

import { localePath } from '@/i18n/locales'

import { CONTACT, DOCS, START_BUILDING } from '@/data/links'
import type { CodeExample, StoragePlan } from '@/data/products/data-storage'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

const zh = (path: string) => localePath('zh-cn', path)

export const PATH = zh('/store-data')
export const TITLE = '数据存储'

export const HERO = {
  title: ['以完整性存储数据，', '成本更低'],
  body: '面向文件、视频、备份等所有数据的开放、可验证存储。随时检查数据完整性，随时带走。',
  primary: {
    label: '开始构建',
    href: START_BUILDING,
    ref: 'store-data-start-building-hero',
  },
  secondary: {
    label: '预约通话',
    href: CONTACT,
    ref: 'store-data-talk-sales-hero',
  },
} as const

export const INTEGRITY: { title: string; body: string; cards: FeatureCard[] } =
  {
    title: '完整性，内置于存储之中',
    body: '文件由内容而非存储位置来标识，所以你随时可以迁移它们。',
    cards: [
      {
        art: 'addressed-by-content',
        title: '按内容寻址的数据',
        body: '每个文件都有唯一的内容标识（CID）。同样的数据，同样的 ID，在任何提供者、任何系统中都一致。',
      },
      {
        art: 'replicated-across-providers',
        title: '跨提供者复制',
        body: '你的数据在多个独立的存储提供者之间复制，一次故障或一个提供者退出都不会带走你的数据。',
      },
      {
        art: 'intact-by-design',
        title: '设计上保证完整',
        body: '文件哪怕只改动一个字节，ID 就会变化，所以你总能确认数据与存入时完全一致。',
      },
    ],
  }

export const STORAGE_PLANS: {
  title: string
  body: string
  plans: StoragePlan[]
} = {
  title: '在 Filecoin 上存储数据的三种方式',
  body: '从温存储开始，把很少访问的数据归档，或者把 S3 工作流带到企业级存储。',
  plans: [
    {
      title: '温存储',
      points: [
        '按需存储和检索数据',
        '默认保留多个独立副本',
        '可选 CDN 层，加速分发',
      ],
      link: {
        label: '了解更多',
        href: zh('/products/warm-storage'),
        ref: 'store-data-plan-warm-storage',
      },
    },
    {
      title: '归档存储',
      points: [
        '为一次写入、很少读取的大型数据集而建',
        '可跨独立提供者扩展到 PB 级',
        '大容量需求由我们的团队协助配置',
      ],
      link: {
        label: '了解更多',
        href: zh('/products/archival-storage'),
        ref: 'store-data-plan-archival-storage',
      },
    },
    {
      title: '企业级存储',
      points: [
        '来自 Fil One 的 S3 兼容对象存储',
        '兼容你已在使用的 S3 SDK 和 CLI',
        '客户端加密和访问控制',
      ],
      link: {
        label: '了解更多',
        href: 'https://fil.one',
        ref: 'store-data-plan-filone',
      },
    },
  ],
}

export const GET_STARTED: {
  title: string
  body: string
  examples: CodeExample[]
  docs: { label: string; href: string; ref?: string }
} = {
  title: '开始使用，存储你的第一份数据',
  body: '几行代码即可上传、检索和固定。',
  examples: [
    {
      id: 'upload',
      label: '上传文件',
      icon: 'upload',
      comment: '//上传',
      code: [
        [
          { text: 'const', accent: true },
          { text: ' { pieceCid } = await filecoin.storage.upload(file)' },
        ],
      ],
    },
    {
      id: 'retrieve',
      label: '检索文件',
      icon: 'download',
      comment: '//检索',
      code: [
        [
          { text: 'const', accent: true },
          { text: ' bytes = await filecoin.storage.download({ pieceCid })' },
        ],
      ],
    },
    {
      id: 'pin',
      label: '固定文件',
      icon: 'pin',
      comment: '//固定，从命令行',
      code: [
        [{ text: 'filecoin-pin', accent: true }, { text: ' add ./photo.jpg' }],
      ],
    },
  ],
  docs: { label: '文档', href: DOCS, ref: 'store-data-docs' },
}

export const CLOSING = {
  title: ['完全掌控数据的存储方式，', '账单成本更低'],
  primary: {
    label: '开始构建',
    href: START_BUILDING,
    ref: 'store-data-start-building-closing',
  },
  secondary: {
    label: '预约通话',
    href: CONTACT,
    ref: 'store-data-talk-sales-closing',
  },
} as const
