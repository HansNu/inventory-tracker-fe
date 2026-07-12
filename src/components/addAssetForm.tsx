import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Card,
  DatePicker,
  message,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { apiConstants } from '../constants'
import type { Asset, AssetCategory } from '../models/modelIndex'
import axios from 'axios'
import dayjs from 'dayjs'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Maintenance', value: 'Maintenance' },
]

async function getAssetByAssetCode(assetCode: string): Promise<Asset> {
  const res = await axios.get(`${apiConstants.getAssetByAssetCode}/${assetCode}`)
  return res.data;
}

async function getAssetCategoryList(): Promise<AssetCategory[]> {
  const res = await fetch(`${apiConstants.getAssetCategoryList}`)
  if (!res.ok) throw new Error('Failed to fetch Asset Category')
    return res.json()
}

async function addAsset(payload: Record<string, unknown>): Promise<void> {
  await axios.post(apiConstants.addAsset, payload)
}

async function updateAsset(payload: Record<string, unknown>): Promise<void> {
  await axios.put(apiConstants.updateAsset, payload)
}

// ─── Component ───────────────────────────────────────────────────────────────

const AddAssetPage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [categoryDdl, setCategoryDdl] = useState<AssetCategory[]>([])
  const [assetData, setAssetData] = useState<Asset>()
  const { assetCode } = useParams()
  const isEditMode = !!assetCode
  
  useEffect(() => {
    getAssetCategoryList()
    .then((data) => setCategoryDdl(data))
    .catch(() => message.error('Failed to load categories'))
    }, [])
    
    useEffect(() => {
      if (!assetCode) return  // add mode, do nothing
      
      getAssetByAssetCode(assetCode)
      .then((data) => {
        setAssetData(data)
        form.setFieldsValue({
          ...data,
          purchaseDate: data.purchaseDate ? dayjs(data.purchaseDate) : null
          // DatePicker needs a dayjs object, not a plain string
        })
      })
      .catch(() => message.error('Failed to load asset'))
    }, [assetCode])
  
  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true)
    try {
      // Format date to string before sending
      const payload = {
        ...values,
        id: assetData?.id,
        purchaseDate: values.purchaseDate
        ? (values.purchaseDate as { format: (f: string) => string }).format('YYYY-MM-DD')
        : null,
      }
      if (isEditMode) {
        await updateAsset(payload)
      } else {
        await addAsset(payload)
      } message.success('Asset added successfully')
      navigate(-1)
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Failed to add asset')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row align="middle" style={{ marginBottom: 20 }} gutter={12}>
        <Col>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
        </Col>
        <Col>
          <Title level={4}>{isEditMode ? 'Edit Asset' : 'Add Asset'}</Title>
        </Col>
      </Row>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Row gutter={[16, 0]}>
            {/* Asset Code */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Asset Code"
                name="assetCode"
                rules={[{ required: true, message: 'Asset code is required' }]}
              >
                <Input placeholder="e.g. AST-0001" />
              </Form.Item>
            </Col>

            {/* Asset Name */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Asset Name"
                name="assetName"
                rules={[{ required: true, message: 'Asset name is required' }]}
              >
                <Input placeholder="e.g. MacBook Pro 14" />
              </Form.Item>
            </Col>

            {/* Asset Category */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Asset Category"
                name="categoryId"
                rules={[{ required: true, message: 'Category is required' }]}
              >
                <Select placeholder="Select category" allowClear>
                  {categoryDdl.map((c) => (
                    <Option key={c.categoryName} value={c.id}>
                      {c.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Brand */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Brand" name="brand">
                <Input placeholder="e.g. Apple" />
              </Form.Item>
            </Col>

            {/* Serial Number */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Serial Number" name="serialNumber">
                <Input placeholder="e.g. C02XL0LFJGH5" />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Status is required' }]}
              >
                <Select placeholder="Select status">
                  {STATUS_OPTIONS.map((s) => (
                    <Option key={s.value} value={s.value}>
                      {s.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Location */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Location is required' }]}
              >
                <Input placeholder="e.g. HQ - Floor 3" />
              </Form.Item>
            </Col>

            {/* User */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Assigned User" name="user">
                <Input placeholder="e.g. John Doe" />
              </Form.Item>
            </Col>

            {/* Purchase Date */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Purchase Date" name="purchaseDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            {/* Description */}
            <Col xs={24}>
              <Form.Item label="Description" name="description">
                <TextArea rows={3} placeholder="Any additional notes about this asset…" />
              </Form.Item>
            </Col>
          </Row>

          {/* Actions */}
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEditMode ? 'Update Asset' : 'Save Asset'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default AddAssetPage