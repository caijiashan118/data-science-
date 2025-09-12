import * as XLSX from 'xlsx'

// 导出Excel文件
export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  try {
    // 创建工作簿
    const workbook = XLSX.utils.book_new()
    
    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // 设置列宽
    const colWidths = []
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key, index) => {
        const maxLength = Math.max(
          key.length,
          ...data.map(row => String(row[key] || '').length)
        )
        colWidths.push({ wch: Math.min(maxLength + 2, 30) })
      })
      worksheet['!cols'] = colWidths
    }
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // 导出文件
    XLSX.writeFile(workbook, `${filename}.xlsx`)
    
    return true
  } catch (error) {
    console.error('导出Excel失败:', error)
    return false
  }
}

// 导入Excel文件
export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // 获取第一个工作表
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = (error) => {
      reject(error)
    }
    
    reader.readAsArrayBuffer(file)
  })
}

// 验证项目基本信息数据
export const validateProjectInfoData = (data) => {
  const errors = []
  const requiredFields = ['项目名称', '项目编码', '所属区域', '项目类别', '建设单位', '项目主管部门']
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`第${index + 1}行缺少必填字段: ${field}`)
      }
    })
    
    // 验证项目状态
    if (row['项目状态'] && !['在建', '续建', '完工', '暂停'].includes(row['项目状态'])) {
      errors.push(`第${index + 1}行项目状态值无效: ${row['项目状态']}`)
    }
  })
  
  return errors
}

// 验证资金安排数据
export const validateFundingData = (data) => {
  const errors = []
  const requiredFields = ['项目名称', '项目编码', '资金批复金额', '资金具体来源', '资金性质']
  
  const validSources = [
    '地方-一般债券', '地方-专项债券', '中央-中央综合财力', '地方-土地出让金', 
    '地方-一般公共预算', '中央-中央预算内投资', '中央-中央补助', '省级-省级补助', 
    '省级-省级专项', '中央-中央专项', '中央-国债', '中央-超长期国债', '中央-抗疫特别国债'
  ]
  
  const validNatures = ['地方', '中央', '省级']
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`第${index + 1}行缺少必填字段: ${field}`)
      }
    })
    
    // 验证资金来源
    if (row['资金具体来源'] && !validSources.includes(row['资金具体来源'])) {
      errors.push(`第${index + 1}行资金具体来源值无效: ${row['资金具体来源']}`)
    }
    
    // 验证资金性质
    if (row['资金性质'] && !validNatures.includes(row['资金性质'])) {
      errors.push(`第${index + 1}行资金性质值无效: ${row['资金性质']}`)
    }
    
    // 验证金额格式
    if (row['资金批复金额'] && isNaN(Number(row['资金批复金额']))) {
      errors.push(`第${index + 1}行资金批复金额格式错误: ${row['资金批复金额']}`)
    }
  })
  
  return errors
}

// 转换导入的项目信息数据格式
export const transformProjectInfoData = (data) => {
  return data.map((row, index) => ({
    key: `import_${index}`,
    projectName: row['项目名称'] || '',
    projectCode: row['项目编码'] || '',
    area: row['所属区域'] || '',
    category: row['项目类别'] || '',
    constructionUnit: row['建设单位'] || '',
    department: row['项目主管部门'] || '',
    approvalTime: row['立项时间'] || '',
    budgetAmount: row['概算批复金额'] || '',
    startTime: row['（预计）开工时间'] || '',
    endTime: row['（预计）完工时间'] || '',
    status: row['项目状态'] || ''
  }))
}

// 转换导入的资金安排数据格式
export const transformFundingData = (data) => {
  return data.map((row, index) => ({
    key: `import_${index}`,
    projectName: row['项目名称'] || '',
    projectCode: row['项目编码'] || '',
    area: row['所属区域'] || '',
    category: row['项目类别'] || '',
    constructionUnit: row['建设单位'] || '',
    department: row['项目主管部门'] || '',
    budgetAmount: row['概算批复金额'] || '',
    fundingAmount: row['资金批复金额'] || '',
    approvalDate: row['批复日期'] || '',
    fundingSource: row['资金具体来源'] || '',
    fundingNature: row['资金性质'] || '',
    documentNumber: row['财预文号'] || '',
    operator: row['经办人'] || '',
    operatorDepartment: row['经办处室'] || '',
    status: row['项目状态'] || '',
    remark: row['备注'] || ''
  }))
}

// 转换导出的项目信息数据格式
export const transformProjectInfoForExport = (data) => {
  return data.map(row => ({
    '项目名称': row.projectName,
    '项目编码': row.projectCode,
    '所属区域': row.area,
    '项目类别': row.category,
    '建设单位': row.constructionUnit,
    '项目主管部门': row.department,
    '立项时间': row.approvalTime,
    '概算批复金额': row.budgetAmount,
    '（预计）开工时间': row.startTime,
    '（预计）完工时间': row.endTime,
    '项目状态': row.status
  }))
}

// 转换导出的资金安排数据格式
export const transformFundingForExport = (data) => {
  return data.map(row => ({
    '项目名称': row.projectName,
    '项目编码': row.projectCode,
    '所属区域': row.area,
    '项目类别': row.category,
    '建设单位': row.constructionUnit,
    '项目主管部门': row.department,
    '概算批复金额': row.budgetAmount,
    '资金批复金额': row.fundingAmount,
    '批复日期': row.approvalDate,
    '资金具体来源': row.fundingSource,
    '资金性质': row.fundingNature,
    '财预文号': row.documentNumber,
    '经办人': row.operator,
    '经办处室': row.operatorDepartment,
    '项目状态': row.status,
    '备注': row.remark
  }))
}