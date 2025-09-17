import { useState, useEffect, useCallback } from 'react'
import dataStore from '@utils/dataStore'

// 自定义Hook用于数据存储管理
export const useDataStore = (dataType) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 获取数据的方法映射
  const getDataMethod = {
    projectInfo: () => dataStore.getProjectInfo(),
    fundingArrangement: () => dataStore.getFundingArrangement(),
    keyProjects: () => dataStore.getKeyProjects(),
  }

  // 设置数据的方法映射
  const setDataMethod = {
    projectInfo: (newData) => dataStore.setProjectInfo(newData),
    fundingArrangement: (newData) => dataStore.setFundingArrangement(newData),
    keyProjects: (newData) => dataStore.setKeyProjects(newData),
  }

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = getDataMethod[dataType]?.() || []
      setData(result)
    } catch (err) {
      setError(err.message || '加载数据失败')
    } finally {
      setLoading(false)
    }
  }, [dataType])

  // 更新数据
  const updateData = useCallback(async (newData) => {
    try {
      setLoading(true)
      setError(null)
      const success = setDataMethod[dataType]?.(newData)
      if (success !== false) {
        setData(newData)
        return true
      } else {
        throw new Error('保存数据失败')
      }
    } catch (err) {
      setError(err.message || '更新数据失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [dataType])

  // 添加单条数据
  const addItem = useCallback(async (item) => {
    try {
      setLoading(true)
      setError(null)
      const currentData = getDataMethod[dataType]?.() || []
      const newData = [...currentData, item]
      const success = setDataMethod[dataType]?.(newData)
      if (success !== false) {
        setData(newData)
        return true
      } else {
        throw new Error('添加数据失败')
      }
    } catch (err) {
      setError(err.message || '添加数据失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [dataType])

  // 删除单条数据
  const deleteItem = useCallback(async (index) => {
    try {
      setLoading(true)
      setError(null)
      const currentData = getDataMethod[dataType]?.() || []
      const newData = currentData.filter((_, i) => i !== index)
      const success = setDataMethod[dataType]?.(newData)
      if (success !== false) {
        setData(newData)
        return true
      } else {
        throw new Error('删除数据失败')
      }
    } catch (err) {
      setError(err.message || '删除数据失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [dataType])

  // 组件挂载时加载数据
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loading,
    error,
    loadData,
    updateData,
    addItem,
    deleteItem,
  }
}

// 数据统计Hook
export const useDataStats = () => {
  const [stats, setStats] = useState({
    projectCount: 0,
    fundingCount: 0,
    keyProjectCount: 0,
    totalFunding: 0,
  })

  const refreshStats = useCallback(() => {
    const newStats = dataStore.getDataStats()
    setStats(newStats)
  }, [])

  useEffect(() => {
    refreshStats()
    // 监听存储变化
    const handleStorageChange = () => {
      refreshStats()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshStats])

  return { stats, refreshStats }
}