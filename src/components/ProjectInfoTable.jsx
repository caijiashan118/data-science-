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
  PROJECT_STATUS_OPTIONS, AREA_OPTIONS, PROJECT_CATEGORY_OPTIONS,
  CONSTRUCTION_UNIT_OPTIONS, DEPARTMENT_OPTIONS 
} from '../utils/constants'
import { 
  exportToExcel, importFromExcel, validateProjectInfoData,
  transformProjectInfoData, transformProjectInfoForExport 
} from '../utils/excelUtils'

const { Option } = Select

const ProjectInfoTable = () => {
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
    const projectData = dataStore.getProjectInfo()
    setData(projectData.map((item, index) => ({ ...item, key: index })))
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
      title: '立项时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 120
    },
    {
      title: '概算批复金额(万元)',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      width: 150,
      render: (value) => value ? `${Number(value).toLocaleString()}` : ''
    },
    {
      title: '(预计)开工时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 120
    },
    {
      title: '(预计)完工时间',
      dataIndex: 'endTime',
      key: 'endTime',
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
      approvalTime: record.approvalTime ? dayjs(record.approvalTime) : null,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null
    })
    setModalVisible(true)
  }

  // 删除记录
  const handleDelete = (index) => {
    dataStore.deleteProjectInfo(index)
    loadData()
    message.success('删除成功')
  }

  // 保存记录
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        approvalTime: values.approvalTime ? values.approvalTime.format('YYYY-MM-DD') : '',
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : '',
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : ''
      }

      if (editingRecord) {
        dataStore.updateProjectInfo(editingRecord.index, formattedValues)
        message.success('更新成功')
      } else {
        dataStore.addProjectInfo(formattedValues)
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

    const exportData = transformProjectInfoForExport(data)
    const success = exportToExcel(exportData, '项目基本信息表', '项目信息')
    
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
      const errors = validateProjectInfoData(importData)
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
      const transformedData = transformProjectInfoData(importData)
      
      // 保存数据
      dataStore.setProjectInfo(transformedData)
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
        <h2 style={{ margin: '16px 0', color: '#333' }}>项目基本信息表</h2>
      </div>

      <div className="content-container">
        <div className="table-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加项目
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
          scroll={{ x: 1500, y: 600 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />

        <Modal
          title={editingRecord ? '编辑项目' : '添加项目'}
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

            <Form.Item name="approvalTime" label="立项时间">
              <DatePicker placeholder="请选择立项时间" style={{ width: '100%' }} />
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

            <Form.Item name="startTime" label="(预计)开工时间">
              <DatePicker placeholder="请选择开工时间" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="endTime" label="(预计)完工时间">
              <DatePicker placeholder="请选择完工时间" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="status" label="项目状态">
              <Select placeholder="请选择项目状态">
                {PROJECT_STATUS_OPTIONS.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default ProjectInfoTable