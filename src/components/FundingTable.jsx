import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, 
  message, Upload, Space, Popconfirm 
} from 'antd'
import { 
  ArrowLeftOutlined, PlusOutlined, DownloadOutlined, 
  UploadOutlined, EditOutlined, DeleteOutlined 
} from '@ant-design/icons'
import dayjs from 'dayjs'
import dataStore from '../utils/dataStore'
import { 
  FUNDING_SOURCE_OPTIONS, FUNDING_NATURE_OPTIONS, getFundingNatureBySource,
  AREA_OPTIONS, PROJECT_CATEGORY_OPTIONS, CONSTRUCTION_UNIT_OPTIONS, 
  DEPARTMENT_OPTIONS, PROJECT_STATUS_OPTIONS
} from '../utils/constants'
import { 
  exportToExcel, importFromExcel, validateFundingData,
  transformFundingData, transformFundingForExport 
} from '../utils/excelUtils'

const { Option } = Select
const { TextArea } = Input

const FundingTable = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const fundingData = dataStore.getFundingArrangement()
    setData(fundingData.map((item, index) => ({ ...item, key: index })))
  }

  // 表格列定义
  const columns = [
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
      title: '建设单位',
      dataIndex: 'constructionUnit',
      key: 'constructionUnit',
      width: 150
    },
    {
      title: '项目主管部门',
      dataIndex: 'department',
      key: 'department',
      width: 150
    },
    {
      title: '概算批复金额(万元)',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      width: 150,
      render: (value) => value ? `${Number(value).toLocaleString()}` : ''
    },
    {
      title: '资金批复金额(万元)',
      dataIndex: 'fundingAmount',
      key: 'fundingAmount',
      width: 150,
      render: (value) => value ? `${Number(value).toLocaleString()}` : ''
    },
    {
      title: '批复日期',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      width: 120
    },
    {
      title: '资金具体来源',
      dataIndex: 'fundingSource',
      key: 'fundingSource',
      width: 180
    },
    {
      title: '资金性质',
      dataIndex: 'fundingNature',
      key: 'fundingNature',
      width: 100,
      render: (nature) => {
        const colors = {
          '地方': '#52c41a',
          '中央': '#1890ff',
          '省级': '#722ed1'
        }
        return <span style={{ color: colors[nature] || '#666' }}>{nature}</span>
      }
    },
    {
      title: '财预文号',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width: 150
    },
    {
      title: '经办人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '经办处室',
      dataIndex: 'operatorDepartment',
      key: 'operatorDepartment',
      width: 150
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      key: 'status',
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record, index) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record, index)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这条记录吗？"
            onConfirm={() => handleDelete(index)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 添加新记录
  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 编辑记录
  const handleEdit = (record, index) => {
    setEditingRecord({ ...record, index })
    form.setFieldsValue({
      ...record,
      approvalDate: record.approvalDate ? dayjs(record.approvalDate) : null
    })
    setModalVisible(true)
  }

  // 删除记录
  const handleDelete = (index) => {
    dataStore.deleteFundingArrangement(index)
    loadData()
    message.success('删除成功')
  }

  // 保存记录
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        approvalDate: values.approvalDate ? values.approvalDate.format('YYYY-MM-DD') : ''
      }

      if (editingRecord) {
        dataStore.updateFundingArrangement(editingRecord.index, formattedValues)
        message.success('更新成功')
      } else {
        dataStore.addFundingArrangement(formattedValues)
        message.success('添加成功')
      }

      setModalVisible(false)
      loadData()
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  // 资金来源变化时自动设置资金性质
  const handleFundingSourceChange = (value) => {
    const nature = getFundingNatureBySource(value)
    form.setFieldValue('fundingNature', nature)
  }

  // 导出Excel
  const handleExport = () => {
    if (data.length === 0) {
      message.warning('没有数据可导出')
      return
    }

    const exportData = transformFundingForExport(data)
    const success = exportToExcel(exportData, '资金安排表', '资金安排')
    
    if (success) {
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  }

  // 导入Excel
  const handleImport = async (file) => {
    setLoading(true)
    try {
      const importData = await importFromExcel(file)
      
      if (importData.length === 0) {
        message.warning('Excel文件中没有数据')
        return false
      }

      // 验证数据
      const errors = validateFundingData(importData)
      if (errors.length > 0) {
        Modal.error({
          title: '数据验证失败',
          content: (
            <div>
              <p>发现以下错误：</p>
              <ul>
                {errors.slice(0, 10).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {errors.length > 10 && <li>... 还有 {errors.length - 10} 个错误</li>}
              </ul>
            </div>
          )
        })
        return false
      }

      // 转换数据格式
      const transformedData = transformFundingData(importData)
      
      // 保存数据
      dataStore.setFundingArrangement(transformedData)
      loadData()
      
      message.success(`成功导入 ${importData.length} 条记录`)
      return false
    } catch (error) {
      console.error('导入失败:', error)
      message.error('导入失败: ' + error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/basic-data')}
          className="back-button"
        >
          返回基础数据
        </Button>
        <h2 style={{ margin: '16px 0', color: '#333' }}>资金安排表</h2>
      </div>

      <div className="content-container">
        <div className="table-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加资金安排
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出Excel
          </Button>
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleImport}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              导入Excel
            </Button>
          </Upload>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 2000, y: 600 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />

        <Modal
          title={editingRecord ? '编辑资金安排' : '添加资金安排'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          width={800}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="projectName"
              label="项目名称"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>

            <Form.Item
              name="projectCode"
              label="项目编码"
              rules={[{ required: true, message: '请输入项目编码' }]}
            >
              <Input placeholder="请输入项目编码" />
            </Form.Item>

            <Form.Item name="area" label="所属区域">
              <Select placeholder="请选择所属区域">
                {AREA_OPTIONS.map(area => (
                  <Option key={area} value={area}>{area}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="category" label="项目类别">
              <Select placeholder="请选择项目类别">
                {PROJECT_CATEGORY_OPTIONS.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="constructionUnit" label="建设单位">
              <Select placeholder="请选择建设单位">
                {CONSTRUCTION_UNIT_OPTIONS.map(unit => (
                  <Option key={unit} value={unit}>{unit}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="department" label="项目主管部门">
              <Select placeholder="请选择项目主管部门">
                {DEPARTMENT_OPTIONS.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="budgetAmount"
              label="概算批复金额(万元)"
              rules={[
                { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的金额' }
              ]}
            >
              <Input placeholder="请输入概算批复金额" />
            </Form.Item>

            <Form.Item
              name="fundingAmount"
              label="资金批复金额(万元)"
              rules={[
                { required: true, message: '请输入资金批复金额' },
                { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的金额' }
              ]}
            >
              <Input placeholder="请输入资金批复金额" />
            </Form.Item>

            <Form.Item name="approvalDate" label="批复日期">
              <DatePicker placeholder="请选择批复日期" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="fundingSource"
              label="资金具体来源"
              rules={[{ required: true, message: '请选择资金具体来源' }]}
            >
              <Select 
                placeholder="请选择资金具体来源"
                onChange={handleFundingSourceChange}
              >
                {FUNDING_SOURCE_OPTIONS.map(source => (
                  <Option key={source.value} value={source.value}>{source.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="fundingNature"
              label="资金性质"
              rules={[{ required: true, message: '请选择资金性质' }]}
            >
              <Select placeholder="请选择资金性质">
                {FUNDING_NATURE_OPTIONS.map(nature => (
                  <Option key={nature.value} value={nature.value}>{nature.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="documentNumber" label="财预文号">
              <Input placeholder="请输入财预文号" />
            </Form.Item>

            <Form.Item name="operator" label="经办人">
              <Input placeholder="请输入经办人" />
            </Form.Item>

            <Form.Item name="operatorDepartment" label="经办处室">
              <Input placeholder="请输入经办处室" />
            </Form.Item>

            <Form.Item name="status" label="项目状态">
              <Select placeholder="请选择项目状态">
                {PROJECT_STATUS_OPTIONS.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="remark" label="备注">
              <TextArea placeholder="请输入备注" rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default FundingTable