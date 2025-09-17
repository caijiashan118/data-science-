import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Button, Card, Tabs, Table, Row, Col, Statistic, 
  message, Empty, Spin 
} from 'antd'
import { 
  ArrowLeftOutlined, BarChartOutlined, TableOutlined,
  DownloadOutlined, PieChartOutlined 
} from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dataStore from '../utils/dataStore'
import { 
  generateSummaryReport, generateDetailedReport, 
  formatAmount, calculatePercentage 
} from '../utils/reportGenerator'
import { exportToExcel } from '../utils/excelUtils'

const { TabPane } = Tabs

const SmartReportsModule = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [summaryData, setSummaryData] = useState(null)
  const [detailedData, setDetailedData] = useState(null)

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = () => {
    setLoading(true)
    try {
      const fundingData = dataStore.getFundingArrangement()
      
      if (fundingData.length === 0) {
        message.warning('没有资金安排数据，请先在基础数据模块中添加数据')
        setSummaryData(null)
        setDetailedData(null)
        return
      }

      const summary = generateSummaryReport(fundingData)
      const detailed = generateDetailedReport(fundingData)
      
      setSummaryData(summary)
      setDetailedData(detailed)
      
      message.success('报表数据加载成功')
    } catch (error) {
      console.error('加载报表数据失败:', error)
      message.error('加载报表数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 总表数据列定义
  const summaryColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
      fixed: 'left'
    },
    {
      title: '项目编码',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 150
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      key: 'area',
      width: 120
    },
    {
      title: '项目类别',
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: '概算批复金额(万元)',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      width: 150,
      render: (value) => formatAmount(value)
    },
    {
      title: '地方资金合计(万元)',
      dataIndex: 'localFunding',
      key: 'localFunding',
      width: 150,
      render: (value) => formatAmount(value)
    },
    {
      title: '中央资金合计(万元)',
      dataIndex: 'centralFunding',
      key: 'centralFunding',
      width: 150,
      render: (value) => formatAmount(value)
    },
    {
      title: '省级资金合计(万元)',
      dataIndex: 'provincialFunding',
      key: 'provincialFunding',
      width: 150,
      render: (value) => formatAmount(value)
    },
    {
      title: '资金总计(万元)',
      dataIndex: 'totalFunding',
      key: 'totalFunding',
      width: 150,
      render: (value) => formatAmount(value)
    }
  ]

  // 细分表数据列定义
  const detailedColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 180,
      fixed: 'left'
    },
    {
      title: '项目编码',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 120
    },
    {
      title: '地方资金',
      children: [
        {
          title: '一般债券',
          dataIndex: 'localGeneralBonds',
          key: 'localGeneralBonds',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '专项债券',
          dataIndex: 'localSpecialBonds',
          key: 'localSpecialBonds',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '土地出让金',
          dataIndex: 'landSaleRevenue',
          key: 'landSaleRevenue',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '一般公共预算',
          dataIndex: 'generalPublicBudget',
          key: 'generalPublicBudget',
          width: 110,
          render: (value) => formatAmount(value)
        }
      ]
    },
    {
      title: '中央资金',
      children: [
        {
          title: '预算内投资',
          dataIndex: 'centralBudgetInvestment',
          key: 'centralBudgetInvestment',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '中央补助',
          dataIndex: 'centralSubsidy',
          key: 'centralSubsidy',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '中央专项',
          dataIndex: 'centralSpecialFunds',
          key: 'centralSpecialFunds',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '国债',
          dataIndex: 'treasuryBonds',
          key: 'treasuryBonds',
          width: 80,
          render: (value) => formatAmount(value)
        },
        {
          title: '超长期国债',
          dataIndex: 'ultraLongTreasuryBonds',
          key: 'ultraLongTreasuryBonds',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '抗疫特别国债',
          dataIndex: 'antiEpidemicBonds',
          key: 'antiEpidemicBonds',
          width: 110,
          render: (value) => formatAmount(value)
        }
      ]
    },
    {
      title: '省级资金',
      children: [
        {
          title: '省级补助',
          dataIndex: 'provincialSubsidy',
          key: 'provincialSubsidy',
          width: 100,
          render: (value) => formatAmount(value)
        },
        {
          title: '省级专项',
          dataIndex: 'provincialSpecialFunds',
          key: 'provincialSpecialFunds',
          width: 100,
          render: (value) => formatAmount(value)
        }
      ]
    }
  ]

  // 导出总表
  const exportSummaryReport = () => {
    if (!summaryData || !summaryData.projectSummary) {
      message.warning('没有数据可导出')
      return
    }

    const exportData = summaryData.projectSummary.map(item => ({
      '项目名称': item.projectName,
      '项目编码': item.projectCode,
      '所属区域': item.area,
      '项目类别': item.category,
      '建设单位': item.constructionUnit,
      '项目主管部门': item.department,
      '概算批复金额(万元)': item.budgetAmount,
      '地方资金合计(万元)': item.localFunding,
      '中央资金合计(万元)': item.centralFunding,
      '省级资金合计(万元)': item.provincialFunding,
      '资金总计(万元)': item.totalFunding
    }))

    const success = exportToExcel(exportData, '智慧报表总表', '总表')
    if (success) {
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  }

  // 导出细分表
  const exportDetailedReport = () => {
    if (!detailedData || !detailedData.projectSummary) {
      message.warning('没有数据可导出')
      return
    }

    const exportData = detailedData.projectSummary.map(item => ({
      '项目名称': item.projectName,
      '项目编码': item.projectCode,
      '所属区域': item.area,
      '项目类别': item.category,
      '地方-一般债券': item.localGeneralBonds,
      '地方-专项债券': item.localSpecialBonds,
      '地方-土地出让金': item.landSaleRevenue,
      '地方-一般公共预算': item.generalPublicBudget,
      '中央-预算内投资': item.centralBudgetInvestment,
      '中央-中央补助': item.centralSubsidy,
      '中央-中央专项': item.centralSpecialFunds,
      '中央-国债': item.treasuryBonds,
      '中央-超长期国债': item.ultraLongTreasuryBonds,
      '中央-抗疫特别国债': item.antiEpidemicBonds,
      '省级-省级补助': item.provincialSubsidy,
      '省级-省级专项': item.provincialSpecialFunds
    }))

    const success = exportToExcel(exportData, '智慧报表细分表', '细分表')
    if (success) {
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  }

  // 图表颜色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>正在生成报表...</p>
      </div>
    )
  }

  if (!summaryData || !detailedData) {
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
          <h2 style={{ margin: '16px 0', color: '#333' }}>智慧报表生成</h2>
        </div>
        <div className="content-container">
          <Empty 
            description="没有数据，请先在基础数据模块中添加资金安排数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/basic-data')}>
              前往基础数据
            </Button>
          </Empty>
        </div>
      </div>
    )
  }

  // 准备饼图数据
  const pieChartData = [
    { name: '地方资金', value: summaryData.totalStats.totalLocalFunding, color: COLORS[0] },
    { name: '中央资金', value: summaryData.totalStats.totalCentralFunding, color: COLORS[1] },
    { name: '省级资金', value: summaryData.totalStats.totalProvincialFunding, color: COLORS[2] }
  ].filter(item => item.value > 0)

  // 准备柱状图数据
  const barChartData = summaryData.areaStats.map(area => ({
    area: area.area,
    地方资金: area.localFunding,
    中央资金: area.centralFunding,
    省级资金: area.provincialFunding
  }))

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
        <h2 style={{ margin: '16px 0', color: '#333' }}>智慧报表生成</h2>
        <Button type="primary" onClick={loadReportData}>
          刷新报表
        </Button>
      </div>

      <div className="content-container">
        {/* 统计概览 */}
        <div className="report-summary">
          <div className="summary-card">
            <div className="value">{summaryData.totalStats.totalProjects}</div>
            <div className="label">项目总数</div>
          </div>
          <div className="summary-card">
            <div className="value">{formatAmount(summaryData.totalStats.totalBudget)}</div>
            <div className="label">概算总额(万元)</div>
          </div>
          <div className="summary-card">
            <div className="value">{formatAmount(summaryData.totalStats.totalFunding)}</div>
            <div className="label">资金总额(万元)</div>
          </div>
          <div className="summary-card">
            <div className="value">{formatAmount(summaryData.totalStats.totalLocalFunding)}</div>
            <div className="label">地方资金(万元)</div>
          </div>
          <div className="summary-card">
            <div className="value">{formatAmount(summaryData.totalStats.totalCentralFunding)}</div>
            <div className="label">中央资金(万元)</div>
          </div>
          <div className="summary-card">
            <div className="value">{formatAmount(summaryData.totalStats.totalProvincialFunding)}</div>
            <div className="label">省级资金(万元)</div>
          </div>
        </div>

        {/* 图表展示 */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="资金来源分布" extra={<PieChartOutlined />}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatAmount(value) + '万元'} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="各区域资金分布" extra={<BarChartOutlined />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAmount(value) + '万元'} />
                  <Legend />
                  <Bar dataKey="地方资金" stackId="a" fill={COLORS[0]} />
                  <Bar dataKey="中央资金" stackId="a" fill={COLORS[1]} />
                  <Bar dataKey="省级资金" stackId="a" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="summary">
          <TabPane tab="智慧报表总表" key="summary">
            <div className="table-actions">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={exportSummaryReport}
              >
                导出总表
              </Button>
            </div>
            <Table
              columns={summaryColumns}
              dataSource={summaryData.projectSummary}
              scroll={{ x: 1200, y: 600 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个项目`
              }}
            />
          </TabPane>

          <TabPane tab="智慧报表细分表" key="detailed">
            <div className="table-actions">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={exportDetailedReport}
              >
                导出细分表
              </Button>
            </div>
            <Table
              columns={detailedColumns}
              dataSource={detailedData.projectSummary}
              scroll={{ x: 1800, y: 600 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个项目`
              }}
            />
          </TabPane>

          <TabPane tab="区域统计" key="area">
            <Table
              columns={[
                { title: '区域', dataIndex: 'area', key: 'area' },
                { title: '项目数量', dataIndex: 'projectCount', key: 'projectCount' },
                { title: '资金总额(万元)', dataIndex: 'totalFunding', key: 'totalFunding', render: formatAmount },
                { title: '地方资金(万元)', dataIndex: 'localFunding', key: 'localFunding', render: formatAmount },
                { title: '中央资金(万元)', dataIndex: 'centralFunding', key: 'centralFunding', render: formatAmount },
                { title: '省级资金(万元)', dataIndex: 'provincialFunding', key: 'provincialFunding', render: formatAmount }
              ]}
              dataSource={summaryData.areaStats}
              pagination={false}
            />
          </TabPane>

          <TabPane tab="类别统计" key="category">
            <Table
              columns={[
                { title: '项目类别', dataIndex: 'category', key: 'category' },
                { title: '项目数量', dataIndex: 'projectCount', key: 'projectCount' },
                { title: '资金总额(万元)', dataIndex: 'totalFunding', key: 'totalFunding', render: formatAmount },
                { title: '地方资金(万元)', dataIndex: 'localFunding', key: 'localFunding', render: formatAmount },
                { title: '中央资金(万元)', dataIndex: 'centralFunding', key: 'centralFunding', render: formatAmount },
                { title: '省级资金(万元)', dataIndex: 'provincialFunding', key: 'provincialFunding', render: formatAmount }
              ]}
              dataSource={summaryData.categoryStats}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default SmartReportsModule