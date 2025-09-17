import React, { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DatabaseOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons'

const HomePage = () => {
  const navigate = useNavigate()

  const modules = useMemo(() => [
    {
      id: 'basic-data',
      title: '基础数据',
      icon: <DatabaseOutlined />,
      description: '管理项目基础数据，包括项目信息、资金安排等',
      features: [
        '项目基本信息表',
        '资金安排表', 
        '重点项目清单',
        'Excel批量导入导出'
      ],
      path: '/basic-data'
    },
    {
      id: 'smart-reports',
      title: '智慧报表生成',
      icon: <BarChartOutlined />,
      description: '基于数据生成智能化分析报表',
      features: [
        '智慧报表总表',
        '资金来源细分统计',
        '项目资金汇总分析',
        '多维度数据展示'
      ],
      path: '/smart-reports'
    },
    {
      id: 'third-module',
      title: '第三模块',
      icon: <FileTextOutlined />,
      description: '预留扩展模块，可根据需要添加功能',
      features: [
        '功能待定',
        '可扩展设计',
        '灵活配置',
        '用户自定义'
      ],
      path: '/third-module'
    }
  ], [])

  const handleModuleClick = useCallback((path) => {
    navigate(path)
  }, [navigate])

  return (
    <div>
      <div className="header">
        <h1>在线AI城建系统</h1>
        <p>智能化城市建设项目管理平台</p>
      </div>
      
      <div className="module-grid">
        {modules.map(module => (
          <div 
            key={module.id} 
            className="module-card"
            onClick={() => handleModuleClick(module.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleModuleClick(module.path)
              }
            }}
            aria-label={`进入${module.title}模块`}
          >
            <div className="module-icon">
              {module.icon}
            </div>
            <div className="module-title">
              {module.title}
            </div>
            <div className="module-description">
              {module.description}
            </div>
            <ul className="module-features">
              {module.features.map((feature, index) => (
                <li key={`${module.id}-feature-${index}`}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage