// 系统常量定义

// 项目状态选项
export const PROJECT_STATUS_OPTIONS = [
  { value: '在建', label: '在建' },
  { value: '续建', label: '续建' },
  { value: '完工', label: '完工' },
  { value: '暂停', label: '暂停' }
]

// 资金具体来源选项
export const FUNDING_SOURCE_OPTIONS = [
  { value: '地方-一般债券', label: '地方-一般债券', nature: '地方' },
  { value: '地方-专项债券', label: '地方-专项债券', nature: '地方' },
  { value: '中央-中央综合财力', label: '中央-中央综合财力', nature: '中央' },
  { value: '地方-土地出让金', label: '地方-土地出让金', nature: '地方' },
  { value: '地方-一般公共预算', label: '地方-一般公共预算', nature: '地方' },
  { value: '中央-中央预算内投资', label: '中央-中央预算内投资', nature: '中央' },
  { value: '中央-中央补助', label: '中央-中央补助', nature: '中央' },
  { value: '省级-省级补助', label: '省级-省级补助', nature: '省级' },
  { value: '省级-省级专项', label: '省级-省级专项', nature: '省级' },
  { value: '中央-中央专项', label: '中央-中央专项', nature: '中央' },
  { value: '中央-国债', label: '中央-国债', nature: '中央' },
  { value: '中央-超长期国债', label: '中央-超长期国债', nature: '中央' },
  { value: '中央-抗疫特别国债', label: '中央-抗疫特别国债', nature: '中央' }
]

// 资金性质选项
export const FUNDING_NATURE_OPTIONS = [
  { value: '地方', label: '地方' },
  { value: '中央', label: '中央' },
  { value: '省级', label: '省级' }
]

// 根据资金来源获取资金性质
export const getFundingNatureBySource = (source) => {
  const option = FUNDING_SOURCE_OPTIONS.find(opt => opt.value === source)
  return option ? option.nature : ''
}

// 地方资金来源
export const LOCAL_FUNDING_SOURCES = [
  '地方-一般债券',
  '地方-专项债券', 
  '地方-土地出让金',
  '地方-一般公共预算'
]

// 中央资金来源
export const CENTRAL_FUNDING_SOURCES = [
  '中央-中央预算内投资',
  '中央-中央补助',
  '中央-中央专项',
  '中央-国债',
  '中央-超长期国债',
  '中央-抗疫特别国债'
]

// 省级资金来源
export const PROVINCIAL_FUNDING_SOURCES = [
  '省级-省级补助',
  '省级-省级专项'
]

// 所属区域选项
export const AREA_OPTIONS = [
  '市辖区', '开发区', '高新区', '经济区', '新区', '县城', '乡镇'
]

// 项目类别选项
export const PROJECT_CATEGORY_OPTIONS = [
  '基础设施', '民生工程', '产业项目', '环保项目', '科技项目', '文化项目', '体育项目', '其他'
]

// 建设单位选项
export const CONSTRUCTION_UNIT_OPTIONS = [
  '市政府', '区政府', '国有企业', '民营企业', '合资企业', '其他'
]

// 项目主管部门选项
export const DEPARTMENT_OPTIONS = [
  '发改委', '住建局', '交通局', '水利局', '环保局', '教育局', '卫健委', '文旅局', '体育局', '其他'
]