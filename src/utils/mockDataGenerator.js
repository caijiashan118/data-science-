import { 
  AREA_OPTIONS, PROJECT_CATEGORY_OPTIONS, CONSTRUCTION_UNIT_OPTIONS,
  DEPARTMENT_OPTIONS, PROJECT_STATUS_OPTIONS, FUNDING_SOURCE_OPTIONS
} from './constants'

// 随机选择数组中的元素
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 生成随机日期
const randomDate = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  return new Date(randomTime).toISOString().split('T')[0]
}

// 生成随机金额
const randomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 项目名称前缀
const projectPrefixes = [
  '城市道路建设', '污水处理厂', '垃圾处理中心', '公园绿化', '学校建设',
  '医院改扩建', '文化中心', '体育馆', '住宅小区', '商业综合体',
  '桥梁建设', '地下管网', '停车场建设', '河道治理', '环保设施',
  '智慧城市', '产业园区', '交通枢纽', '水利工程', '电力设施'
]

// 项目名称后缀
const projectSuffixes = [
  '工程', '项目', '建设工程', '改造项目', '扩建工程', '新建项目',
  '升级改造', '基础设施', '民生工程', '重点项目'
]

// 生成项目名称
const generateProjectName = () => {
  const prefix = randomChoice(projectPrefixes)
  const suffix = randomChoice(projectSuffixes)
  const number = Math.floor(Math.random() * 100) + 1
  return `${prefix}${suffix}${number}期`
}

// 生成项目编码
const generateProjectCode = (index) => {
  const year = new Date().getFullYear()
  const code = String(index + 1).padStart(4, '0')
  return `${year}${randomChoice(['A', 'B', 'C', 'D'])}${code}`
}

// 生成200个项目基本信息
export const generateProjectInfoData = () => {
  const projects = []
  
  for (let i = 0; i < 200; i++) {
    const budgetAmount = randomAmount(500, 20000)
    const startDate = randomDate('2023-01-01', '2024-12-31')
    const endDate = randomDate('2024-01-01', '2026-12-31')
    
    const project = {
      key: i,
      projectName: generateProjectName(),
      projectCode: generateProjectCode(i),
      area: randomChoice(AREA_OPTIONS),
      category: randomChoice(PROJECT_CATEGORY_OPTIONS),
      constructionUnit: randomChoice(CONSTRUCTION_UNIT_OPTIONS),
      department: randomChoice(DEPARTMENT_OPTIONS),
      approvalTime: randomDate('2022-01-01', '2023-12-31'),
      budgetAmount: budgetAmount,
      startTime: startDate,
      endTime: endDate,
      status: randomChoice(PROJECT_STATUS_OPTIONS.map(s => s.value))
    }
    
    projects.push(project)
  }
  
  return projects
}

// 为每个项目生成1-8条资金安排记录
export const generateFundingData = (projects) => {
  const fundingData = []
  let fundingIndex = 0
  
  projects.forEach(project => {
    // 每个项目生成1-8条资金安排
    const fundingCount = Math.floor(Math.random() * 8) + 1
    const totalBudget = Number(project.budgetAmount)
    
    // 将总预算分配到多个资金来源
    const fundingSources = []
    for (let i = 0; i < fundingCount; i++) {
      fundingSources.push(randomChoice(FUNDING_SOURCE_OPTIONS))
    }
    
    // 分配金额，确保总和不超过预算
    const amounts = []
    let remainingAmount = totalBudget
    
    for (let i = 0; i < fundingCount - 1; i++) {
      const maxAmount = Math.floor(remainingAmount * 0.7) // 最多分配剩余金额的70%
      const amount = Math.floor(Math.random() * maxAmount) + Math.floor(remainingAmount * 0.1)
      amounts.push(amount)
      remainingAmount -= amount
    }
    amounts.push(remainingAmount) // 剩余金额分配给最后一条记录
    
    // 生成资金安排记录
    for (let i = 0; i < fundingCount; i++) {
      const source = fundingSources[i]
      const funding = {
        key: fundingIndex++,
        projectName: project.projectName,
        projectCode: project.projectCode,
        area: project.area,
        category: project.category,
        constructionUnit: project.constructionUnit,
        department: project.department,
        budgetAmount: project.budgetAmount,
        fundingAmount: Math.max(amounts[i], 0),
        approvalDate: randomDate('2023-01-01', '2024-12-31'),
        fundingSource: source.value,
        fundingNature: source.nature,
        documentNumber: `财预[${new Date().getFullYear()}]${String(fundingIndex).padStart(4, '0')}号`,
        operator: randomChoice(['张三', '李四', '王五', '赵六', '陈七', '刘八']),
        operatorDepartment: randomChoice(['计划处', '投资处', '财务处', '项目处', '监督处']),
        status: project.status,
        remark: Math.random() > 0.7 ? randomChoice([
          '按计划执行', '需要加快进度', '等待审批', '资金到位', '正在实施'
        ]) : ''
      }
      
      fundingData.push(funding)
    }
  })
  
  // 确保生成1000条记录
  while (fundingData.length < 1000) {
    const randomProject = randomChoice(projects)
    const source = randomChoice(FUNDING_SOURCE_OPTIONS)
    
    const funding = {
      key: fundingIndex++,
      projectName: randomProject.projectName,
      projectCode: randomProject.projectCode,
      area: randomProject.area,
      category: randomProject.category,
      constructionUnit: randomProject.constructionUnit,
      department: randomProject.department,
      budgetAmount: randomProject.budgetAmount,
      fundingAmount: randomAmount(50, 1000),
      approvalDate: randomDate('2023-01-01', '2024-12-31'),
      fundingSource: source.value,
      fundingNature: source.nature,
      documentNumber: `财预[${new Date().getFullYear()}]${String(fundingIndex).padStart(4, '0')}号`,
      operator: randomChoice(['张三', '李四', '王五', '赵六', '陈七', '刘八']),
      operatorDepartment: randomChoice(['计划处', '投资处', '财务处', '项目处', '监督处']),
      status: randomProject.status,
      remark: Math.random() > 0.7 ? randomChoice([
        '按计划执行', '需要加快进度', '等待审批', '资金到位', '正在实施'
      ]) : ''
    }
    
    fundingData.push(funding)
  }
  
  return fundingData.slice(0, 1000) // 确保只返回1000条记录
}

// 生成重点项目清单（从项目基本信息中选择部分作为重点项目）
export const generateKeyProjectsData = (projects) => {
  // 选择30%的项目作为重点项目
  const keyProjectsCount = Math.floor(projects.length * 0.3)
  const selectedProjects = [...projects]
    .sort(() => 0.5 - Math.random()) // 随机排序
    .slice(0, keyProjectsCount)
  
  const priorityLevels = ['国家级', '省级', '市级', '区级']
  
  return selectedProjects.map((project, index) => ({
    key: index,
    projectName: project.projectName,
    projectCode: project.projectCode,
    area: project.area,
    category: project.category,
    priorityLevel: randomChoice(priorityLevels),
    constructionUnit: project.constructionUnit,
    department: project.department,
    totalInvestment: project.budgetAmount,
    constructionPeriod: `${project.startTime?.split('-')[0] || '2023'}-${project.endTime?.split('-')[0] || '2025'}年`,
    status: project.status,
    description: `${project.projectName}是一项重要的${project.category}项目，旨在提升城市基础设施水平，改善民生福祉。项目建设周期为${project.constructionPeriod}，总投资${project.budgetAmount}万元。`
  }))
}

// 生成所有模拟数据
export const generateAllMockData = () => {
  console.log('开始生成模拟数据...')
  
  // 生成项目基本信息
  const projects = generateProjectInfoData()
  console.log(`生成了 ${projects.length} 个项目`)
  
  // 生成资金安排
  const funding = generateFundingData(projects)
  console.log(`生成了 ${funding.length} 条资金安排记录`)
  
  // 生成重点项目清单
  const keyProjects = generateKeyProjectsData(projects)
  console.log(`生成了 ${keyProjects.length} 个重点项目`)
  
  return {
    projects,
    funding,
    keyProjects
  }
}