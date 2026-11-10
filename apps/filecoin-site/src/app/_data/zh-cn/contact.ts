// 联系表单（“联系销售”）：文案、字段和下拉选项，与 ../contact.ts 一一对应。选项与英文版
// 顺序一致，/api/contact 按位置把中文选项换成英文后再写入表格。

export const CONTACT_FORM = {
  title: '联系我们的团队',
  body: '简单介绍一下你正在构建的项目，我们会在两个工作日内回复你。',
  submit: '发送消息',
  sent: {
    title: '收到，谢谢。',
    body: 'Filecoin 团队的成员会尽快与你联系。',
    close: '完成',
  },
  error: '消息发送失败，请稍后再试。',
} as const

export const INTENT_OPTIONS = [
  '使用 Filecoin 存储构建应用',
  '存储或归档大型数据集',
  '将 Filecoin 集成到现有产品或平台',
  '为我的客户提供基于 Filecoin 的存储',
  '探索合作',
  '其他',
] as const

export const VOLUME_OPTIONS = [
  '少于 1 TB',
  '1–10 TB',
  '10 TB–1 PB',
  '超过 1 PB',
  '还不确定',
] as const

export const TIMING_OPTIONS = [
  '现在',
  '3 个月内',
  '3–6 个月',
  '6 个月以上',
  '还不确定',
] as const

export const CUSTOMERS_OPTIONS = ['有', '还没有'] as const

export const FIELDS = {
  fullName: { label: '姓名', placeholder: '张三' },
  email: { label: '工作邮箱', placeholder: 'zhangsan@company.com' },
  company: { label: '公司', placeholder: '公司名称' },
  intent: { label: '你想做什么？', placeholder: '请选择' },
  project: {
    label: '介绍一下你的项目和存储需求',
    placeholder: '介绍一下你的使用场景、存储需求，或你想讨论的内容。',
  },
  volume: { label: '未来 12 个月你预计存储多少数据？', placeholder: '请选择' },
  timing: { label: '你预计什么时候开始存储数据？', placeholder: '请选择' },
  customers: { label: '你目前有付费客户吗？', placeholder: '请选择' },
  roadmap: {
    label: '未来六个月你的路线图是什么？',
    placeholder: '里程碑、产品发布，或你预计开始存储数据的时间点。',
  },
} as const

export { LIMITS } from '@/data/contact'
