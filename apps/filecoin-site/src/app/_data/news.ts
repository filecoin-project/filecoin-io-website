// "Latest news" on the homepage: a snapshot of filecoin.io's three latest posts, retrieved
// October 13, 2026. Chinese (the posts of filecoin.io/zh-cn) is in ./zh-cn/news.ts.

export type Article = {
  title: string
  description: string
  date: string
  dateTime: string
  author?: string
  href: string
}

export const NEWS: {
  title: string
  intro: string
  tag: string
  viewAll: { label: string; href: string }
  articles: Article[]
} = {
  title: 'Latest news',
  intro:
    'Insights, updates, ecosystem spotlights, and community stories, directly from the teams building Filecoin.',
  tag: 'Updates',
  viewAll: { label: 'View all articles', href: '/blog' },
  articles: [
    {
      title: 'New IPFS Tools Launch on Filecoin',
      description: 'Migrate pinned CIDs to Filecoin unchanged',
      date: 'Sep 30, 2026',
      dateTime: '2026-09-30',
      href: '/blog/New-IPFS-Tools-Launch-on-Filecoin',
    },
    {
      title: 'Real World Assets Are Onchain. What About the Data Behind Them?',
      description:
        'A reference architecture for verifiable offchain data for tokenized assets using Avalanche, IPFS and Filecoin',
      date: 'Sep 16, 2026',
      dateTime: '2026-09-16',
      href: '/blog/Real-world-assets-are-onchain-What-about-the-data-behind-them',
    },
    {
      title: 'Filecoin ProPGF Batch 3: ~$1.4M committed',
      description:
        'The Protocol Labs Filecoin Impact Fund (PLFIF) is pleased to announce the results of Filecoin Public Goods Funding (ProPGF) Batch 3',
      date: 'Aug 19, 2026',
      dateTime: '2026-08-19',
      author: 'ProPGF Team',
      href: '/blog/Filecoin-ProPGF-Batch-3-14M-committed',
    },
  ],
}
