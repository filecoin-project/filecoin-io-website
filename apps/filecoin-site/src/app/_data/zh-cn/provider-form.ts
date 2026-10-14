// 存储提供者咨询表单（/zh-cn/provide-storage/onboarding），与 ../provider-form.ts 一一对应。
// 选项与英文版顺序一致，/api/provider 按位置把中文选项换成英文后再写入表格。

import { localePath } from '@/i18n/locales'

import { AGENT_QUICKSTART, GETTING_STARTED_DOCS } from '@/data/provide-storage'

export const PATH = localePath('zh-cn', '/provide-storage/onboarding')
export const TITLE = '成为存储提供者'

export const PROVIDER_FORM = {
  title: ['成为 Filecoin', '存储提供者'],
  body: '感谢你有意在 Filecoin 上提供存储。告诉我们你当前或计划中的运营情况，我们的团队会审核你的咨询并跟进后续步骤。',
  submit: '提交咨询',
  sent: {
    title: '咨询已发送。',
    body: '感谢你有意成为 Filecoin 存储提供者。我们的团队会审核你的咨询并与你联系。',
    cta: { label: '阅读入门指南', href: GETTING_STARTED_DOCS },
  },
  error: '咨询发送失败，请稍后再试。',
  goalsMissing: '请至少选择一项。',
} as const

export const SELF_SERVICE = {
  title: '想自己动手设置？',
  links: [
    {
      label: '入门指南',
      body: '机会、所需条件以及提供者如何运营，从单个节点到数据中心。',
      href: GETTING_STARTED_DOCS,
    },
    {
      label: 'Agent 快速入门',
      body: '任意规模起步，由 Agent 引导你或你的团队完成设置。',
      href: AGENT_QUICKSTART,
    },
  ],
} as const

export const OPERATION_OPTIONS = [
  '小型运营者',
  '小型数据中心',
  '企业数据中心',
  '还不确定',
] as const

export const CAPACITY_OPTIONS = [
  '少于 100 TB',
  '100 TB–1 PB',
  '1–10 PB',
  '超过 10 PB',
  '还不确定',
] as const

export const GOAL_OPTIONS = [
  '成为 Filecoin 存储提供者',
  '扩展现有的 Filecoin 运营',
  '了解提供者的经济模型和收益机会',
  '寻找存储客户或需求',
  '探索商业合作',
] as const

export const FIELDS = {
  fullName: { label: '姓名', placeholder: '张三' },
  email: { label: '工作邮箱', placeholder: 'zhangsan@company.com' },
  company: { label: '公司 / 组织', placeholder: '公司或组织名称' },
  operation: {
    label: '哪一项最符合你当前或计划中的存储运营？',
    placeholder: '请选择',
  },
  capacity: {
    label: '你目前运营或计划部署的存储容量是多少？',
    placeholder: '请选择',
  },
  goals: { label: '你希望达成什么目标？', hint: '可多选。' },
} as const

export { LIMITS } from '@/data/provider-form'
