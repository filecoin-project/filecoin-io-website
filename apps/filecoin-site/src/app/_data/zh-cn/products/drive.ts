// “Filecoin Drive”页文案（简体中文），与 ../../products/drive.ts 一一对应。

import { localePath } from '@/i18n/locales'

import { DRIVE } from '@/data/links'

import type { FeatureCard } from '@/components/sections/product/FeatureCards'
import type { HowStep } from '@/components/sections/product/HowSteps'

const zh = (path: string) => localePath('zh-cn', path)

export const PATH = zh('/products/drive')
export const TITLE = 'Filecoin Drive'

const HOW_ID = 'how-it-works'

export const HERO = {
  title: ['你的文件，安全保存，', '始终属于你'],
  body: '存储你的照片、文档和视频，在任何浏览器里打开，并用一个链接分享。',
  primary: { label: '打开 Drive', href: DRIVE, ref: 'drive-open-hero' },
  secondary: { label: '使用方式', href: `#${HOW_ID}` },
} as const

export const FEATURES: { title: string; body: string; cards: FeatureCard[] } = {
  title: '重要文件的安身之处',
  body: 'Drive 用起来就像你熟悉的云盘，但你的文件存放在 Filecoin 上，这是一个不受任何一家公司控制的开放网络。',
  cards: [
    {
      art: 'addressed-by-content',
      title: '用链接分享',
      body: '把文件链接发给任何人，对方在浏览器里就能直接打开。',
    },
    {
      art: 'private-files',
      title: '让文件保持私密',
      body: '由你选择哪些文件只有你自己能打开。',
    },
    {
      art: 'open-source',
      title: '开源',
      body: 'Drive 的代码是公开的，任何人都可以查看它如何运作，或搭建自己的版本。',
    },
  ],
}

export const HOW: {
  sectionId: string
  title: string
  body: string
  steps: HowStep[]
} = {
  sectionId: HOW_ID,
  title: '四步开始使用',
  body: '从第一次上传，到第一次分享链接。',
  steps: [
    {
      title: '连接钱包',
      body: '浏览器或手机上的加密钱包，就是你的 Drive 账户。',
    },
    {
      title: '充值存储额度',
      body: '用 USDFC（一种数字美元）充值。只为你存储的内容付费。',
    },
    {
      title: '上传文件',
      body: '拖入照片、文档或视频，就像使用其他云盘一样。',
    },
    {
      title: '打开和分享',
      body: '在任何浏览器里打开文件，或把链接发给别人。',
    },
  ],
}

export const CLOSING = {
  title: ['把你的文件', '放进 Filecoin Drive'],
  body: '打开 Drive，上传你的第一个文件。',
  primary: { label: '打开 Drive', href: DRIVE, ref: 'drive-open-closing' },
  secondary: { label: '查看价格', href: zh('/pricing') },
} as const
