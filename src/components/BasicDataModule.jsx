import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Row, Col, message, Modal } from 'antd'
import { ArrowLeftOutlined, TableOutlined, DollarOutlined, StarOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { generateAllMockData } from '../utils/mockDataGenerator'
import dataStore from '../utils/dataStore'

const BasicDataModule = () => {
  const navigate = useNavigate()

  // 生成模拟数据
  const handleGenerateMockData = () => {
    Modal.confirm({
      title: '生成模拟数据',
      content: '这将生成200个项目和1000条资金安排记录，并清空现有数据。确定要继续吗？',
      onOk: () => {
        try {
          const mockData = generateAllMockData()
          
          // 清空现有数据并设置新数据
          dataStore.setProjectInfo(mockData.projects)
          dataStore.setFundingArrangement(mockData.funding)
          dataStore.setKeyProjects(mockData.keyProjects)
          
          message.success('模拟数据生成成功！')
        } catch (error) {
          console.error('生成模拟数据失败:', error)
          message.error('生成模拟数据失败')
        }
      }
    })
  }

  const subModules = [
    {
      id: 'project-info',
      title: '项目基本信息表',
      icon: <TableOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />,
      description: '管理项目的基本信息，包括项目名称、编码、区域等',
      path: '/basic-data/project-info'
    },
    {
      id: 'funding',
      title: '资金安排表',
      icon: <DollarOutlined style={{ fontSize: '2rem', color: '#52c41a' }} />,
      description: '管理项目资金安排，包括资金来源、批复金额等',
      path: '/basic-data/funding'
    },
    {
      id: 'key-projects',
      title: '重点项目清单',
      icon: <StarOutlined style={{ fontSize: '2rem', color: '#faad14' }} />,
      description: '管理重点项目清单和相关信息',
      path: '/basic-data/key-projects'
    }
  ]

  return (
    <div>
      <div className="page-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回主页
        </Button>
        <h2 style={{ margin: '16px 0', color: '#333' }}>基础数据管理</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>管理城建项目的基础数据，支持Excel导入导出</p>
        <Button 
          type="primary" 
          icon={<ThunderboltOutlined />}
          onClick={handleGenerateMockData}
          style={{ marginBottom: 0 }}
        >
          生成模拟数据
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {subModules.map(module => (
          <Col xs={24} sm={12} lg={8} key={module.id}>
            <Card
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              onClick={() => navigate(module.path)}
              bodyStyle={{ padding: '40px 24px' }}
            >
              <div style={{ marginBottom: '20px' }}>
                {module.icon}
              </div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>{module.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>{module.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default BasicDataModule