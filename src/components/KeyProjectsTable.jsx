import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, 
  message, Upload, Space, Popconfirm, Tag 
} from 'antd'
import { 
  ArrowLeftOutlined, PlusOutlined, DownloadOutlined, 
  UploadOutlined, EditOutlined, DeleteOutlined 
} from '@ant-design/icons'
import dayjs from 'dayjs'
import dataStore from '../utils/dataStore'
import { 
  PROJECT_STATUS_OPTIONS, AREA_OPTIONS, PROJECT_CATEGORY_OPTIONS,
  CONSTRUCTION_UNIT_OPTIONS, DEPARTMENT_OPTIONS 
} from '../utils/constants'
import { exportToExcel, importFromExcel } from '../utils/excelUtils'

const { Option } = Select
const { TextArea } = Input

const KeyProjectsTable = () => {
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
    const keyProjectsData = dataStore.getKeyProjects()
    setData(keyProjectsData.map((item, index) => ({ ...item, key: index })))
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
      title: '重点等级',
      dataIndex: 'priorityLevel',
      key: 'priorityLevel',
      width: 120,
      render: (level) => {
        const colors = {
          '国家级': '#f50',
          '省级': '#2db7f5',
          '市级': '#87d068',
          '区级': '#108ee9'
        }
        return <Tag color={colors[level]}>{level}</Tag>
      }
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
      title: '总投资(万元)',
      dataIndex: 'totalInvestment',
      key: 'totalInvestment',
      width: 150,
      render: (value) => value ? `${Number(value).toLocaleString()}` : ''
    },
    {
      title: '建设周期',
      dataIndex: 'constructionPeriod',
      key: 'constructionPeriod',
      width: 120
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colors = {
          '在建': '#52c41a',
          '续建': '#1890ff',
          '完工': '#722ed1',
          '暂停': '#f5222d'
        }
        return <span style={{ color: colors[status] || '#666' }}>{status}</span>
      }
    },
    {
      title: '项目描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true
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
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 删除记录
  const handleDelete = (index) => {
    const newData = [...data]
    newData.splice(index, 1)
    dataStore.setKeyProjects(newData)
    loadData()
    message.success('删除成功')
  }

  // 保存记录
  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      if (editingRecord) {
        const newData = [...data]
        newData[editingRecord.index] = { ...values, key: editingRecord.index }
        dataStore.setKeyProjects(newData)
        message.success('更新成功')
      } else {
        const newData = [...data, { ...values, key: data.length }]
        dataStore.setKeyProjects(newData)
        message.success('添加成功')
      }

      setModalVisible(false)
      loadData()
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  // 导出Excel
  const handleExport = () => {
    if (data.length === 0) {
      message.warning('没有数据可导出')
      return
    }

    const exportData = data.map(row => ({
      '项目名称': row.projectName,
      '项目编码': row.projectCode,
      '所属区域': row.area,
      '项目类别': row.category,
      '重点等级': row.priorityLevel,
      '建设单位': row.constructionUnit,
      '项目主管部门': row.department,
      '总投资(万元)': row.totalInvestment,
      '建设周期': row.constructionPeriod,
      '项目状态': row.status,
      '项目描述': row.description
    }))

    const success = exportToExcel(exportData, '重点项目清单', '重点项目')
    
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

      // 转换数据格式
      const transformedData = importData.map((row, index) => ({
        key: `import_${index}`,
        projectName: row['项目名称'] || '',
        projectCode: row['项目编码'] || '',
        area: row['所属区域'] || '',
        category: row['项目类别'] || '',
        priorityLevel: row['重点等级'] || '',
        constructionUnit: row['建设单位'] || '',
        department: row['项目主管部门'] || '',
        totalInvestment: row['总投资(万元)'] || '',
        constructionPeriod: row['建设周期'] || '',
        status: row['项目状态'] || '',
        description: row['项目描述'] || ''
      }))
      
      // 保存数据
      dataStore.setKeyProjects(transformedData)
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

  const priorityLevelOptions = [
    { value: '国家级', label: '国家级' },
    { value: '省级', label: '省级' },
    { value: '市级', label: '市级' },
    { value: '区级', label: '区级' }
  ]

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
        <h2 style={{ margin: '16px 0', color: '#333' }}>重点项目清单</h2>
      </div>

      <div className="content-container">
        <div className="table-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加重点项目
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
          scroll={{ x: 1800, y: 600 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />

        <Modal
          title={editingRecord ? '编辑重点项目' : '添加重点项目'}
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

            <Form.Item
              name="area"
              label="所属区域"
              rules={[{ required: true, message: '请选择所属区域' }]}
            >
              <Select placeholder="请选择所属区域">
                {AREA_OPTIONS.map(area => (
                  <Option key={area} value={area}>{area}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="项目类别"
              rules={[{ required: true, message: '请选择项目类别' }]}
            >
              <Select placeholder="请选择项目类别">
                {PROJECT_CATEGORY_OPTIONS.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="priorityLevel"
              label="重点等级"
              rules={[{ required: true, message: '请选择重点等级' }]}
            >
              <Select placeholder="请选择重点等级">
                {priorityLevelOptions.map(level => (
                  <Option key={level.value} value={level.value}>{level.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="constructionUnit"
              label="建设单位"
              rules={[{ required: true, message: '请选择建设单位' }]}
            >
              <Select placeholder="请选择建设单位">
                {CONSTRUCTION_UNIT_OPTIONS.map(unit => (
                  <Option key={unit} value={unit}>{unit}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="department"
              label="项目主管部门"
              rules={[{ required: true, message: '请选择项目主管部门' }]}
            >
              <Select placeholder="请选择项目主管部门">
                {DEPARTMENT_OPTIONS.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="totalInvestment"
              label="总投资(万元)"
              rules={[
                { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的金额' }
              ]}
            >
              <Input placeholder="请输入总投资金额" />
            </Form.Item>

            <Form.Item name="constructionPeriod" label="建设周期">
              <Input placeholder="如：2023-2025年" />
            </Form.Item>

            <Form.Item name="status" label="项目状态">
              <Select placeholder="请选择项目状态">
                {PROJECT_STATUS_OPTIONS.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="description" label="项目描述">
              <TextArea placeholder="请输入项目描述" rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default KeyProjectsTable