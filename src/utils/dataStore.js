// 数据存储管理
class DataStore {
  constructor() {
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
      const stored = localStorage.getItem('cityConstructionData')
      if (stored) {
        this.data = { ...this.data, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  // 保存数据到localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem('cityConstructionData', JSON.stringify(this.data))
    } catch (error) {
      console.error('保存数据失败:', error)
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
    this.saveToLocalStorage()
  }
}

// 创建全局数据存储实例
const dataStore = new DataStore()

export default dataStore