// 性能监控工具

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.enabled = process.env.NODE_ENV === 'development'
  }

  // 开始计时
  startTimer(label) {
    if (!this.enabled) return
    this.metrics.set(label, performance.now())
  }

  // 结束计时并记录
  endTimer(label) {
    if (!this.enabled) return
    const startTime = this.metrics.get(label)
    if (startTime) {
      const duration = performance.now() - startTime
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
      this.metrics.delete(label)
      return duration
    }
  }

  // 测量函数执行时间
  measure(label, fn) {
    if (!this.enabled) return fn()
    
    this.startTimer(label)
    const result = fn()
    
    if (result && typeof result.then === 'function') {
      // 异步函数
      return result.finally(() => this.endTimer(label))
    } else {
      // 同步函数
      this.endTimer(label)
      return result
    }
  }

  // 监控组件渲染性能
  measureRender(componentName, renderFn) {
    return this.measure(`${componentName} render`, renderFn)
  }

  // 监控数据加载性能
  measureDataLoad(operation, loadFn) {
    return this.measure(`Data load: ${operation}`, loadFn)
  }

  // 获取Web Vitals
  getWebVitals() {
    if (!this.enabled || typeof window === 'undefined') return

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('🎯 LCP:', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('👆 FID:', entry.processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ['first-input'] })

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          console.log('📐 CLS:', entry.value)
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }

  // 监控长任务
  monitorLongTasks() {
    if (!this.enabled || typeof window === 'undefined') return

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.warn('🐌 Long task detected:', entry.duration + 'ms')
      }
    }).observe({ entryTypes: ['longtask'] })
  }

  // 内存使用监控
  logMemoryUsage() {
    if (!this.enabled || !performance.memory) return

    const memory = performance.memory
    console.log('💾 Memory usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
    })
  }

  // 初始化所有监控
  init() {
    if (!this.enabled) return

    this.getWebVitals()
    this.monitorLongTasks()
    
    // 定期记录内存使用
    setInterval(() => this.logMemoryUsage(), 30000)
  }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor()

// 导出便捷方法
export const startTimer = (label) => performanceMonitor.startTimer(label)
export const endTimer = (label) => performanceMonitor.endTimer(label)
export const measure = (label, fn) => performanceMonitor.measure(label, fn)
export const measureRender = (componentName, renderFn) => performanceMonitor.measureRender(componentName, renderFn)
export const measureDataLoad = (operation, loadFn) => performanceMonitor.measureDataLoad(operation, loadFn)

export default performanceMonitor