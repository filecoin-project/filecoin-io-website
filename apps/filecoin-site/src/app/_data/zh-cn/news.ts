// 首页“最新动态”：filecoin.io/zh-cn 的三篇最新文章（2026 年 10 月 13 日快照）。

import { localePath } from '@/i18n/locales'

import type { Article } from '@/data/news'

const zh = (path: string) => localePath('zh-cn', path)

export const NEWS: {
  title: string
  intro: string
  tag: string
  viewAll: { label: string; href: string }
  articles: Article[]
} = {
  title: '最新动态',
  intro: '来自 Filecoin 建设团队的洞察、更新、生态亮点和社区故事。',
  tag: '更新',
  viewAll: { label: '查看全部文章', href: zh('/blog') },
  articles: [
    {
      title: 'CloudPaws：Filecoin Onchain Cloud 早期参与者的生态身份计划',
      description:
        'CloudPaws 是面向 Filecoin Onchain Cloud 早期建设者的 100 枚生态身份 NFT，用于可验证地识别开发者、SP 与生态贡献者，构建长期协作的去中心化云核心社区。',
      date: '2026年1月16日',
      dateTime: '2026-01-16',
      href: zh('/blog/cloudpaws-filecoin-onchain-cloud'),
    },
    {
      title:
        'Filecoin 推出 FIL-RetroPGF-1 资助项目，用于资助 Filecoin 公共事业！',
      description:
        '很高兴在此宣布第一轮追溯性公益资助 FIL-RetroPGF-1！为鼓励 Filecoin 网络贡献者所带来的影响，第一轮将奖励 20 万 FIL。',
      date: '2024年5月15日',
      dateTime: '2024-05-15',
      href: zh(
        '/blog/unveiling-fil-retropgf-1-retroactively-funding-filecoin-public-goods',
      ),
    },
    {
      title: 'Curio 简介：Filecoin 存储提供者的 Lotus-Miner 替代方案',
      description:
        '我们非常高兴宣布推出 Curio Storage，这是由 Lotus-Miner 和 Boost 团队共同研发的新产品。',
      date: '2024年5月6日',
      dateTime: '2024-05-06',
      href: zh(
        '/blog/introducing-curio-a-lotus-miner-replacement-for-filecoin-storage-providers',
      ),
    },
  ],
}
