// 合作表单（“与我们合作”）：文案、字段和下拉选项，与 ../partner.ts 一一对应。选项与英文版
// 顺序一致，/api/partner 按位置把中文选项换成英文后再写入表格。

export const PARTNER_FORM = {
  title: '与我们合作',
  body: '有意与 Filecoin 合作？简单介绍一下你的组织，以及你想探索的方向。',
  submit: '提交合作咨询',
  sent: {
    title: '感谢你对与 Filecoin 合作的兴趣。',
    body: '我们的团队会审阅你的咨询，如有合适的契合点将与你联系。',
    close: '完成',
  },
  error: '咨询发送失败，请稍后再试。',
} as const

export const PARTNERSHIP_OPTIONS = [
  '技术 / 产品集成',
  '存储基础设施 / 分销',
  '业务拓展 / 战略合作',
  '生态 / 开发者合作',
  '其他 / 还不确定',
] as const

export const FIELDS = {
  fullName: { label: '姓名', placeholder: '张三' },
  email: { label: '工作邮箱', placeholder: 'zhangsan@company.com' },
  company: { label: '公司 / 组织', placeholder: '组织名称' },
  type: { label: '你对哪种类型的合作感兴趣？', placeholder: '请选择' },
  details: {
    label: '简单说说你想探索的方向。',
    placeholder: '用几句话介绍你的组织，以及你设想的合作方式。',
  },
} as const

export { LIMITS } from '@/data/partner'
