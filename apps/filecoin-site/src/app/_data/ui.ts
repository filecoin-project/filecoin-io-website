// Interface text that is not a page's own copy: the site title, the header and footer, form
// states, and labels for assistive technology. Chinese is in ./zh-cn/ui.ts.

export const SITE = {
  title: "Filecoin · Storing the internet's most valuable information",
  titleTemplate: '%s · Filecoin',
  description:
    "Filecoin is the world's largest open storage network, built to keep data secure and sovereign.",
}

export const HEADER = {
  home: 'Filecoin home',
  primary: 'Primary',
  mainNavigation: 'Main navigation',
  siteMenu: 'Site menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  /** The EN / 中文 switch: its name, the label of each language and what switching to it means. */
  language: 'Site language',
  languages: { en: 'EN', 'zh-cn': '中文' },
  switchTo: {
    en: 'English: switch to the English site',
    'zh-cn': '中文: switch to the Chinese site',
  },
}

export const FOOTER = {
  navigation: 'Footer',
  newsletter: 'Sign up for Filecoin updates',
  emailPlaceholder: 'Your email',
  subscribe: 'Subscribe to Filecoin updates',
  social: 'Filecoin on social media',
  on: (network: string) => `Filecoin on ${network}`,
  managedBy: 'Managed by',
  newTab: '(opens in a new tab)',
}

export const FORM = {
  sending: 'Sending…',
  close: 'Close',
}

export const COPY_BUTTON = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Failed',
  copiedStatus: 'Copied to clipboard',
  failedStatus: 'Could not copy. Select the text to copy it.',
  prompt: 'Copy prompt',
}

export const LABELS = {
  trustedBy: 'Trusted by',
  visit: (name: string) => `Visit ${name} website`,
  agents: 'Agents and platforms',
  codeExamples: 'Code examples',
  chartProvider: 'Provider',
  globe:
    'Globe of Filecoin storage provider locations. Drag or use the arrow keys to turn it.',
  createAccount: 'Create account',
  inConsole: (title: string) => `${title} in the Filecoin Console`,
  bestFor: 'Best for',
  included: 'What’s included',
  readMore: (title: string) => `Read more about ${title}`,
}
