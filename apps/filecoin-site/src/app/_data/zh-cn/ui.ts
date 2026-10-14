// 界面文字（简体中文），与 ../ui.ts 一一对应。

export const SITE = {
  title: 'Filecoin · 保存互联网上最有价值的信息',
  titleTemplate: '%s · Filecoin',
  description: 'Filecoin 是全球最大的开放存储网络，让数据安全、自主可控。',
}

export const HEADER = {
  home: 'Filecoin 首页',
  primary: '主导航',
  mainNavigation: '主导航',
  siteMenu: '站点菜单',
  openMenu: '打开菜单',
  closeMenu: '关闭菜单',
  language: '站点语言',
  languages: { en: 'EN', 'zh-cn': '中文' },
  switchTo: { en: 'English：切换到英文站点', 'zh-cn': '中文：切换到中文站点' },
}

export const FOOTER = {
  navigation: '页脚',
  newsletter: '订阅 Filecoin 最新动态',
  emailPlaceholder: '你的邮箱',
  subscribe: '订阅 Filecoin 最新动态',
  social: 'Filecoin 的社交媒体',
  on: (network: string) => `Filecoin 的 ${network}`,
  managedBy: '管理方',
  newTab: '（在新标签页中打开）',
}

export const FORM = {
  sending: '发送中…',
  close: '关闭',
}

export const COPY_BUTTON = {
  idle: '复制',
  copied: '已复制',
  failed: '失败',
  copiedStatus: '已复制到剪贴板',
  failedStatus: '无法复制，请选中文字手动复制。',
  prompt: '复制提示',
}

export const LABELS = {
  trustedBy: '信任我们的团队',
  visit: (name: string) => `访问 ${name} 网站`,
  agents: 'Agent 与平台',
  codeExamples: '代码示例',
  chartProvider: '提供者',
  globe: 'Filecoin 存储提供者分布地球仪。拖动或使用方向键旋转。',
  createAccount: '创建账户',
  inConsole: (title: string) => `在 Filecoin 控制台${title}`,
  bestFor: '适合',
  included: '包含内容',
  readMore: (title: string) => `阅读更多：${title}`,
}
