// 页脚链接（简体中文），与 ../footer.ts 一一对应；标签沿用 filecoin.io/zh-cn 的页脚。

import { localePath } from '@/i18n/locales'

import type { FooterLink } from '@/data/footer'
import { DOCS, START_BUILDING, STORE } from '@/data/links'

const zh = (path: string) => localePath('zh-cn', path)

export const FOOTER_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: '导航',
    links: [
      { label: '了解', href: zh('/learn') },
      { label: '案例研究', href: zh('/case-studies') },
      { label: '存储数据', href: zh(STORE) },
      { label: '提供存储', href: zh('/provide-storage') },
      { label: '开始在 Filecoin 上构建', href: START_BUILDING, external: true },
      { label: '博客', href: zh('/blog') },
    ],
  },
  {
    title: '资源',
    links: [
      { label: '文档', href: DOCS, external: true },
      {
        label: '开发手册',
        href: 'https://docs.filecoin.io/build-on-filecoin/cookbook',
        external: true,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/filecoin-project',
        external: true,
      },
      { label: '资助', href: 'https://fil.org/grants', external: true },
      {
        label: '安全漏洞赏金',
        href: 'https://immunefi.com/bug-bounty/filecoin/',
        external: true,
      },
      {
        label: '品牌工具包',
        href: 'https://hub.fil.org/design',
        external: true,
      },
      {
        label: '网络状态',
        href: 'https://status.filecoin.io/',
        external: true,
      },
      {
        label: '网络健康',
        href: 'https://dashboard.starboard.ventures/',
        external: true,
      },
    ],
  },
  {
    title: '区块浏览器',
    links: [
      { label: 'Beryx', href: 'https://beryx.io/', external: true },
      {
        label: 'Blockscout (FEVM)',
        href: 'https://www.blockscout.com/',
        external: true,
      },
      { label: 'Filfox', href: 'https://filfox.info/', external: true },
      { label: 'Filscan', href: 'https://filscan.io/en/', external: true },
    ],
  },
  {
    title: '社区',
    links: [
      { label: '社区中心', href: zh('/community-hub') },
      { label: '活动', href: 'https://fil.org/events', external: true },
      { label: 'Orbit', href: 'https://fil.org/orbit', external: true },
      {
        label: 'FIPs 与治理',
        href: 'https://fil.org/governance',
        external: true,
      },
    ],
  },
]

export { FOOTER_SOCIAL } from '@/data/footer'

export const FOOTER_LEGAL: FooterLink[] = [
  { label: '隐私政策', href: 'https://fil.org/privacy-policy', external: true },
  { label: '使用条款', href: 'https://fil.org/terms-of-use', external: true },
]

export const FOOTER_FOUNDATION = {
  label: 'Filecoin 基金会',
  href: 'https://fil.org',
}
