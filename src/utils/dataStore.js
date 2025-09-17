// 数据存储管理
class DataStore {
  constructor() {
    this.storageKey = 'cityConstructionData'
    this.data = {
      projectInfo: [],
      fundingArrangement: [],
      keyProjects: []
    }
    this.loadFromLocalStorage()
  }

  // 从localStorage加载数据
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsedData = JSON.parse(stored)
        // 验证数据结构
        if (this.validateDataStructure(parsedData)) {
          this.data = { ...this.data, ...parsedData }
        } else {
          console.warn('数据结构验证失败，使用默认数据')
        }
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      // 如果localStorage损坏，清除数据
      this.clearCorruptedData()
    }
  }

  // 验证数据结构
  validateDataStructure(data) {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.projectInfo) &&
      Array.isArray(data.fundingArrangement) &&
      Array.isArray(data.keyProjects)
    )
  }

  // 清除损坏的数据
  clearCorruptedData() {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('清除损坏数据失败:', error)
    }
  }

  // 保存数据到localStorage
  saveToLocalStorage() {
    try {
      const dataToSave = JSON.stringify(this.data)
      localStorage.setItem(this.storageKey, dataToSave)
      return true
    } catch (error) {
      console.error('保存数据失败:', error)
      // 检查是否是存储空间不足
      if (error.name === 'QuotaExceededError') {
        console.error('存储空间不足')
      }
      return false
    }
  }

  // 获取项目基本信息
  getProjectInfo() {
    return this.data.projectInfo
  }

  // 设置项目基本信息
  setProjectInfo(data) {
    this.data.projectInfo = data
    this.saveToLocalStorage()
  }

  // 添加项目基本信息
  addProjectInfo(project) {
    this.data.projectInfo.push(project)
    this.saveToLocalStorage()
  }

  // 更新项目基本信息
  updateProjectInfo(index, project) {
    this.data.projectInfo[index] = project
    this.saveToLocalStorage()
  }

  // 删除项目基本信息
  deleteProjectInfo(index) {
    this.data.projectInfo.splice(index, 1)
    this.saveToLocalStorage()
  }

  // 获取资金安排表
  getFundingArrangement() {
    return this.data.fundingArrangement
  }

  // 设置资金安排表
  setFundingArrangement(data) {
    this.data.fundingArrangement = data
    this.saveToLocalStorage()
  }

  // 添加资金安排
  addFundingArrangement(funding) {
    this.data.fundingArrangement.push(funding)
    this.saveToLocalStorage()
  }

  // 更新资金安排
  updateFundingArrangement(index, funding) {
    this.data.fundingArrangement[index] = funding
    this.saveToLocalStorage()
  }

  // 删除资金安排
  deleteFundingArrangement(index) {
    this.data.fundingArrangement.splice(index, 1)
    this.saveToLocalStorage()
  }

  // 获取重点项目清单
  getKeyProjects() {
    return this.data.keyProjects
  }

  // 设置重点项目清单
  setKeyProjects(data) {
    this.data.keyProjects = data
    this.saveToLocalStorage()
  }

  // 根据项目编码获取项目信息
  getProjectByCode(projectCode) {
    return this.data.projectInfo.find(project => project.projectCode === projectCode)
  }

  // 根据项目编码获取资金安排
  getFundingByProjectCode(projectCode) {
    return this.data.fundingArrangement.filter(funding => funding.projectCode === projectCode)
  }

  // 清空所有数据
  clearAllData() {
    this.data = {
      projectInfo: [],
      fundingArrangement: [],
      keyProjects: []
    }
    return this.saveToLocalStorage()
  }

  // 获取数据统计信息
  getDataStats() {
    return {
      projectCount: this.data.projectInfo.length,
      fundingCount: this.data.fundingArrangement.length,
      keyProjectCount: this.data.keyProjects.length,
      totalFunding: this.data.fundingArrangement.reduce((sum, item) => sum + (parseFloat(item.approvedAmount) || 0), 0)
    }
  }

  // 导出数据
  exportData() {
    return JSON.stringify(this.data, null, 2)
  }

  // 导入数据
  importData(jsonData) {
    try {
      const parsedData = JSON.parse(jsonData)
      if (this.validateDataStructure(parsedData)) {
        this.data = parsedData
        return this.saveToLocalStorage()
      } else {
        throw new Error('数据格式不正确')
      }
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }

  // 备份数据
  backupData() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupKey = `${this.storageKey}_backup_${timestamp}`
    try {
      localStorage.setItem(backupKey, JSON.stringify(this.data))
      return backupKey
    } catch (error) {
      console.error('备份数据失败:', error)
      return null
    }
  }
}

// 创建全局数据存储实例
const dataStore = new DataStore()

export default dataStore