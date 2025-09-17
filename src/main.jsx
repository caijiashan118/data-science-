import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from '@components/ErrorBoundary'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import performanceMonitor from '@utils/performance'
import 'antd/dist/reset.css'
import './index.css'

// 初始化性能监控
performanceMonitor.init()

// Ant Design 主题配置
const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
    Table: {
      borderRadius: 8,
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider 
        locale={zhCN}
        theme={theme}
      >
        <App />
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)