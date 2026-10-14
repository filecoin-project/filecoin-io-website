// “归档存储”页文案（简体中文），与 ../../products/archival-storage.ts 一一对应。

import { localePath } from '@/i18n/locales'

import { CONTACT } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'

export const PATH = localePath('zh-cn', '/products/archival-storage')
export const TITLE = '归档存储'

const TALK_TO_US = CONTACT

export const HERO = {
  title: ['长年保存备份的地方，', '成本低得多'],
  body: '备份、媒体库和记录放在 Filecoin 归档存储，适合需要保留但几乎不动的数据。',
  primary: { label: '预约通话', href: TALK_TO_US },
} as const

export const USES: { title: string; cards: FeatureCard[] } = {
  title: '使用 Filecoin 归档存储的三种方式',
  cards: [
    {
      art: 'backups-and-records',
      title: '备份与记录',
      body: '数据库备份、系统快照以及不需要每天使用的记录文件。',
    },
    {
      art: 'media-archives',
      title: '媒体档案',
      body: '需要长期保存的视频库和原始素材。',
    },
    {
      art: 'datasets-and-models',
      title: '数据集与模型',
      body: '过往项目的训练数据和模型检查点。',
    },
  ],
}

export const SET_UP = {
  title: ['归档存储由我们与你一起', '按需求配置'],
  body: '告诉我们你有多少数据、多久需要取回一次，我们会给出方案。',
  primary: { label: '预约通话', href: TALK_TO_US },
} as const
