// 价格页文案（简体中文），与 ../pricing.ts 一一对应。

import { localePath } from '@/i18n/locales'

import type { StartCard } from '@/data/home'
import { CONTACT, STORE } from '@/data/links'
import type { Offer } from '@/data/pricing'
import { offHome, START_CARDS } from '@/data/zh-cn/home'

const zh = (path: string) => localePath('zh-cn', path)

export const PATH = zh('/pricing')
export const TITLE = '价格'

const TALK = { label: '咨询专家', href: CONTACT }
const FIL_ONE = 'https://fil.one'

export const HERO = {
  title: ['由你掌控的开放存储，', '成本更低'],
  body: 'Filecoin 是一个开放的存储网络。你的数据保持可迁移，由多个提供者存储，并始终由你掌控。从企业平台到简单的接入工具，各类团队都在使用它。',
  primary: { ...TALK, ref: 'pricing-talk-sales-hero' },
  secondary: { label: '存储数据', href: zh(STORE), ref: 'pricing-store-data' },
} as const

export const WARM_STORAGE: Offer = {
  name: 'Filecoin 温存储',
  body: '适合经常读写的文件。',
  price: { from: '起价', amount: '$2.50', unit: '每 TB 每月' },
  bestFor: '日常使用的应用、数据集和媒体库',
  features: [
    '几行代码即可上传和获取文件',
    '随处获取文件，可选更快的分发',
    '按月为存储的数据付费',
  ],
  cta: {
    label: '开始使用',
    href: 'https://filecoin.cloud/',
    ref: 'pricing-warm-get-started',
  },
}

export const ARCHIVAL_STORAGE: Offer = {
  name: 'Filecoin 归档存储',
  body: '以经济实惠、独立的冗余存储层，保障你的数据安全。',
  price: { from: '起价', amount: '$2.00', unit: '每 TB 每月' },
  bestFor: '长期备份、灾难恢复、媒体档案，以及静态或不常访问的数据。',
  features: [
    '从 TB 级扩展到 PB 级的空间',
    '根据你的数据量和取回频率，与我们的团队一起配置',
  ],
  cta: { label: '预约通话', href: CONTACT, ref: 'pricing-archival-talk-sales' },
}

export const ENTERPRISE_STORAGE: Offer = {
  name: 'Fil One S3 兼容存储',
  body: '适合已在使用 Amazon S3 工具的团队。',
  price: { from: '固定价格', amount: '$5.99', unit: '每 TB 每月' },
  bestFor: '把现有 S3 存储迁移过来的公司',
  features: [
    '兼容你已在使用的 S3 工具和库',
    '文件在离开你的系统前即已加密',
    '控制谁可以查看和修改每个存储桶',
    '锁定 1、3 或 5 年的容量',
  ],
  cta: {
    label: '访问 Fil One',
    href: FIL_ONE,
    ref: 'pricing-enterprise-filone',
  },
}

export const HERO_PLANS = [
  { label: '温存储', offer: WARM_STORAGE },
  { label: '归档', offer: ARCHIVAL_STORAGE },
  { label: 'S3 兼容', offer: ENTERPRISE_STORAGE },
].map(({ label, offer: { price } }) => ({
  label,
  from: price.from,
  amount: price.amount,
  unit: price.unit,
}))

export const PLANS: { title: string; body: string; offers: Offer[] } = {
  title: '在 Filecoin 上存储的三种方式',
  body: '常用数据用温存储，长期保存用归档存储，已有 S3 工作流则用 Fil One S3 兼容存储。',
  offers: [WARM_STORAGE, ARCHIVAL_STORAGE, ENTERPRISE_STORAGE],
}

export const CHOOSE = {
  title: ['不确定该选', '哪种存储方案？'],
  body: '告诉我们你的需求，我们会为你推荐最合适的 Filecoin 方案。',
  primary: { ...TALK, ref: 'pricing-talk-sales-closing' },
} as const

export const START: StartCard[] = offHome(START_CARDS.cards)
