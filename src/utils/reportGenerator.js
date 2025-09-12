import { 
  LOCAL_FUNDING_SOURCES, CENTRAL_FUNDING_SOURCES, PROVINCIAL_FUNDING_SOURCES 
} from './constants'

// 计算项目资金汇总
export const generateProjectFundingSummary = (fundingData) => {
  const projectSummary = {}
  
  fundingData.forEach(funding => {
    const projectCode = funding.projectCode
    
    if (!projectSummary[projectCode]) {
      projectSummary[projectCode] = {
        projectCode: funding.projectCode,
        projectName: funding.projectName,
        area: funding.area,
        category: funding.category,
        constructionUnit: funding.constructionUnit,
        department: funding.department,
        budgetAmount: funding.budgetAmount,
        localFunding: 0,
        centralFunding: 0,
        provincialFunding: 0,
        totalFunding: 0,
        // 地方资金细分
        localGeneralBonds: 0,      // 一般债券
        localSpecialBonds: 0,      // 专项债券
        landSaleRevenue: 0,        // 土地出让金
        generalPublicBudget: 0,    // 一般公共预算
        // 中央资金细分
        centralBudgetInvestment: 0,  // 中央预算内投资
        centralSubsidy: 0,          // 中央补助
        centralSpecialFunds: 0,     // 中央专项
        treasuryBonds: 0,           // 国债
        ultraLongTreasuryBonds: 0,  // 超长期国债
        antiEpidemicBonds: 0,       // 抗疫特别国债
        // 省级资金细分
        provincialSubsidy: 0,       // 省级补助
        provincialSpecialFunds: 0   // 省级专项
      }
    }
    
    const amount = Number(funding.fundingAmount) || 0
    const summary = projectSummary[projectCode]
    
    // 按资金性质分类
    if (funding.fundingNature === '地方') {
      summary.localFunding += amount
    } else if (funding.fundingNature === '中央') {
      summary.centralFunding += amount
    } else if (funding.fundingNature === '省级') {
      summary.provincialFunding += amount
    }
    
    // 按具体来源细分
    switch (funding.fundingSource) {
      // 地方资金
      case '地方-一般债券':
        summary.localGeneralBonds += amount
        break
      case '地方-专项债券':
        summary.localSpecialBonds += amount
        break
      case '地方-土地出让金':
        summary.landSaleRevenue += amount
        break
      case '地方-一般公共预算':
        summary.generalPublicBudget += amount
        break
      // 中央资金
      case '中央-中央预算内投资':
        summary.centralBudgetInvestment += amount
        break
      case '中央-中央补助':
        summary.centralSubsidy += amount
        break
      case '中央-中央专项':
        summary.centralSpecialFunds += amount
        break
      case '中央-国债':
        summary.treasuryBonds += amount
        break
      case '中央-超长期国债':
        summary.ultraLongTreasuryBonds += amount
        break
      case '中央-抗疫特别国债':
        summary.antiEpidemicBonds += amount
        break
      // 省级资金
      case '省级-省级补助':
        summary.provincialSubsidy += amount
        break
      case '省级-省级专项':
        summary.provincialSpecialFunds += amount
        break
    }
    
    summary.totalFunding = summary.localFunding + summary.centralFunding + summary.provincialFunding
  })
  
  return Object.values(projectSummary)
}

// 生成智慧报表总表
export const generateSummaryReport = (fundingData) => {
  const summary = generateProjectFundingSummary(fundingData)
  
  // 计算总体统计
  const totalStats = {
    totalProjects: summary.length,
    totalBudget: summary.reduce((sum, item) => sum + (Number(item.budgetAmount) || 0), 0),
    totalFunding: summary.reduce((sum, item) => sum + item.totalFunding, 0),
    totalLocalFunding: summary.reduce((sum, item) => sum + item.localFunding, 0),
    totalCentralFunding: summary.reduce((sum, item) => sum + item.centralFunding, 0),
    totalProvincialFunding: summary.reduce((sum, item) => sum + item.provincialFunding, 0)
  }
  
  // 按区域统计
  const areaStats = {}
  summary.forEach(item => {
    if (!areaStats[item.area]) {
      areaStats[item.area] = {
        area: item.area,
        projectCount: 0,
        totalFunding: 0,
        localFunding: 0,
        centralFunding: 0,
        provincialFunding: 0
      }
    }
    
    const areaStat = areaStats[item.area]
    areaStat.projectCount += 1
    areaStat.totalFunding += item.totalFunding
    areaStat.localFunding += item.localFunding
    areaStat.centralFunding += item.centralFunding
    areaStat.provincialFunding += item.provincialFunding
  })
  
  // 按项目类别统计
  const categoryStats = {}
  summary.forEach(item => {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = {
        category: item.category,
        projectCount: 0,
        totalFunding: 0,
        localFunding: 0,
        centralFunding: 0,
        provincialFunding: 0
      }
    }
    
    const categoryStat = categoryStats[item.category]
    categoryStat.projectCount += 1
    categoryStat.totalFunding += item.totalFunding
    categoryStat.localFunding += item.localFunding
    categoryStat.centralFunding += item.centralFunding
    categoryStat.provincialFunding += item.provincialFunding
  })
  
  return {
    projectSummary: summary,
    totalStats,
    areaStats: Object.values(areaStats),
    categoryStats: Object.values(categoryStats)
  }
}

// 生成智慧报表细分表
export const generateDetailedReport = (fundingData) => {
  const summary = generateProjectFundingSummary(fundingData)
  
  // 计算各类资金的详细统计
  const detailedStats = {
    // 地方资金详细统计
    localFundingDetails: {
      total: summary.reduce((sum, item) => sum + item.localFunding, 0),
      generalBonds: summary.reduce((sum, item) => sum + item.localGeneralBonds, 0),
      specialBonds: summary.reduce((sum, item) => sum + item.localSpecialBonds, 0),
      landSaleRevenue: summary.reduce((sum, item) => sum + item.landSaleRevenue, 0),
      generalPublicBudget: summary.reduce((sum, item) => sum + item.generalPublicBudget, 0)
    },
    // 中央资金详细统计
    centralFundingDetails: {
      total: summary.reduce((sum, item) => sum + item.centralFunding, 0),
      budgetInvestment: summary.reduce((sum, item) => sum + item.centralBudgetInvestment, 0),
      subsidy: summary.reduce((sum, item) => sum + item.centralSubsidy, 0),
      specialFunds: summary.reduce((sum, item) => sum + item.centralSpecialFunds, 0),
      treasuryBonds: summary.reduce((sum, item) => sum + item.treasuryBonds, 0),
      ultraLongTreasuryBonds: summary.reduce((sum, item) => sum + item.ultraLongTreasuryBonds, 0),
      antiEpidemicBonds: summary.reduce((sum, item) => sum + item.antiEpidemicBonds, 0)
    },
    // 省级资金详细统计
    provincialFundingDetails: {
      total: summary.reduce((sum, item) => sum + item.provincialFunding, 0),
      subsidy: summary.reduce((sum, item) => sum + item.provincialSubsidy, 0),
      specialFunds: summary.reduce((sum, item) => sum + item.provincialSpecialFunds, 0)
    }
  }
  
  // 按区域和资金类型的交叉统计
  const areaFundingCrossStats = {}
  summary.forEach(item => {
    if (!areaFundingCrossStats[item.area]) {
      areaFundingCrossStats[item.area] = {
        area: item.area,
        localFunding: { total: 0, generalBonds: 0, specialBonds: 0, landSaleRevenue: 0, generalPublicBudget: 0 },
        centralFunding: { total: 0, budgetInvestment: 0, subsidy: 0, specialFunds: 0, treasuryBonds: 0, ultraLongTreasuryBonds: 0, antiEpidemicBonds: 0 },
        provincialFunding: { total: 0, subsidy: 0, specialFunds: 0 }
      }
    }
    
    const areaStat = areaFundingCrossStats[item.area]
    
    // 地方资金
    areaStat.localFunding.total += item.localFunding
    areaStat.localFunding.generalBonds += item.localGeneralBonds
    areaStat.localFunding.specialBonds += item.localSpecialBonds
    areaStat.localFunding.landSaleRevenue += item.landSaleRevenue
    areaStat.localFunding.generalPublicBudget += item.generalPublicBudget
    
    // 中央资金
    areaStat.centralFunding.total += item.centralFunding
    areaStat.centralFunding.budgetInvestment += item.centralBudgetInvestment
    areaStat.centralFunding.subsidy += item.centralSubsidy
    areaStat.centralFunding.specialFunds += item.centralSpecialFunds
    areaStat.centralFunding.treasuryBonds += item.treasuryBonds
    areaStat.centralFunding.ultraLongTreasuryBonds += item.ultraLongTreasuryBonds
    areaStat.centralFunding.antiEpidemicBonds += item.antiEpidemicBonds
    
    // 省级资金
    areaStat.provincialFunding.total += item.provincialFunding
    areaStat.provincialFunding.subsidy += item.provincialSubsidy
    areaStat.provincialFunding.specialFunds += item.provincialSpecialFunds
  })
  
  return {
    projectSummary: summary,
    detailedStats,
    areaFundingCrossStats: Object.values(areaFundingCrossStats)
  }
}

// 格式化金额显示
export const formatAmount = (amount) => {
  if (!amount) return '0'
  return Number(amount).toLocaleString()
}

// 计算百分比
export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return '0%'
  return ((part / total) * 100).toFixed(1) + '%'
}